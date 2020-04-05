package org.ideakat.webapp.auth;

import org.junit.Before;
import org.junit.Test;

import java.util.Optional;

import static org.junit.Assert.assertEquals;

public class UserServiceTest {

    private UserService userService;

    @Before
    public void setUp(){
        userService = new UserService();
    }

    @Test
    public void getPasswordStrengthValidatorError() {
        assertEquals(
            Optional.empty(),
            userService.getPasswordStrengthValidatorError("Avalidpassword9!")
        );

        assertEquals(
           Optional.of(UserService.PASSWORD_LENGTH_MSG),
           userService.getPasswordStrengthValidatorError("a")
        );

        assertEquals(
            Optional.of(UserService.PASSWORD_CHARACTER_MSG),
            userService.getPasswordStrengthValidatorError("a password missing a digit")
        );
    }
}