package org.ideakat.webapp.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.ideakat.domain.entities.user.User;
import org.ideakat.domain.repositories.user.UserRepository;

import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> user = TenantContextHolder.runAsSystem(() -> userRepository.findOneByEmailIgnoreCase(email));

        if (user.isPresent()){
            return new AuthenticatedUser(user.get());
        }
        else {
            throw new UsernameNotFoundException("Username not found: " + email);
        }
    }
}
