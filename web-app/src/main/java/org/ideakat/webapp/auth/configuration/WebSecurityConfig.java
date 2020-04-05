package org.ideakat.webapp.auth.configuration;

import org.ideakat.domain.entities.user.UserAuthorities;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.DelegatingAuthenticationEntryPoint;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

import java.util.LinkedHashMap;

import static org.ideakat.webapp.auth.configuration.Routes.*;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                .antMatchers(HOME, ALL_PUBLIC_API_ROUTES, ALL_STATIC_APP_RESOURCES, FAVICON).permitAll()
                .antMatchers(ALL_ADMIN_ROUTES).hasAuthority(UserAuthorities.ADMIN)
                .anyRequest().authenticated()
            .and()
                .userDetailsService(userDetailsService)
                .formLogin()
                    .loginPage(HOME)
                    .loginProcessingUrl(LOGIN_API)
                    .successForwardUrl(LOGIN_SUCCESS)
                    .failureForwardUrl(LOGIN_FAIL)
                    .usernameParameter("email")
            .and()
                .logout().logoutSuccessUrl(UI_LOGIN)
            .and()
                .exceptionHandling().authenticationEntryPoint(delegatingEntryPoint())
            .and().csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
    }

    @Bean
    public AuthenticationEntryPoint delegatingEntryPoint() {
        final LinkedHashMap<RequestMatcher, AuthenticationEntryPoint> map = new LinkedHashMap();
        map.put(new AntPathRequestMatcher("/"), new LoginUrlAuthenticationEntryPoint(HOME));
        map.put(new AntPathRequestMatcher("/api/**"), new Http403ForbiddenEntryPoint());

        final DelegatingAuthenticationEntryPoint entryPoint = new DelegatingAuthenticationEntryPoint(map);
        entryPoint.setDefaultEntryPoint(new LoginUrlAuthenticationEntryPoint(HOME));

        return entryPoint;
    }

    @Bean
    public AuthenticationManager authenticationManager() throws Exception {
        return super.authenticationManager();
    }
}
