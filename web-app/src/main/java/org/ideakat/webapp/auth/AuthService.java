package org.ideakat.webapp.auth;

import org.ideakat.webapp.api.contract.auth.AuthenticationStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.ideakat.domain.entities.user.User;

import javax.servlet.http.HttpSession;

import static org.springframework.security.web.context.HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    public boolean isAuthenticated(){
        Authentication user = SecurityContextHolder.getContext().getAuthentication();
        return user != null && !"anonymousUser".equals(user.getName());
    }

    public User getLoggedInUser(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        AuthenticatedUser userDetails = (AuthenticatedUser)auth.getPrincipal();
        return userDetails.getUser();
    }

    public Long getLoggedInUserId(){
        return getLoggedInUser().getId();
    }

    public Long getTenantIdForUser(){
        return getLoggedInUser().getTenantId();
    }

    public AuthenticationStatus getAuthenticationStatus(){
        AuthenticationStatus status;
        if (isAuthenticated()){
            User user = getLoggedInUser();
            status = AuthenticationStatus.builder()
                    .isLoggedIn(true)
                    .user(user)
                    .isAdmin(user.isAdmin())
                    .build();
        }
        else {
            status = AuthenticationStatus.builder()
                    .isLoggedIn(false)
                    .isAdmin(false)
                    .build();
        }
        return status;
    }

    public AuthenticationStatus logInAsUser(String email, String password, HttpSession session){
        UsernamePasswordAuthenticationToken credentials = new UsernamePasswordAuthenticationToken(email, password);
        Authentication auth = authenticationManager.authenticate(credentials);

        SecurityContext context = SecurityContextHolder.getContext();
        context.setAuthentication(auth);
        session.setAttribute(SPRING_SECURITY_CONTEXT_KEY, context);

        return getAuthenticationStatus();
    }
}
