package org.ideakat.webapp.api.users;

import org.ideakat.webapp.api.APIResponse;
import org.ideakat.webapp.api.contract.auth.AuthenticationStatus;
import org.ideakat.webapp.api.contract.auth.ResetPasswordRequest;
import org.ideakat.webapp.auth.configuration.Routes;
import org.ideakat.webapp.email.PasswordResetEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.WebAttributes;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.ideakat.domain.entities.user.PasswordResetEmailConfirmation;
import org.ideakat.webapp.auth.AuthService;
import org.ideakat.webapp.auth.TenantContextHolder;
import org.ideakat.webapp.auth.UserService;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
public class LoginController {

    @Autowired
    private AuthService authService;

    @Autowired
    private PasswordResetEmailService passwordResetEmailService;

    @Autowired
    private UserService userService;

    @GetMapping(Routes.LOGIN_API + "/getAuthenticationStatus")
    public APIResponse<AuthenticationStatus> getAuthenticationStatus(){
        return APIResponse.create(authService.getAuthenticationStatus());
    }

    @PostMapping(Routes.LOGIN_SUCCESS)
    public APIResponse<AuthenticationStatus> handleLoginSuccess(){
        return getAuthenticationStatus();
    }

    @PostMapping(Routes.LOGIN_FAIL)
    public APIResponse handleLoginFailed(HttpServletRequest request){
        AuthenticationException exception = (AuthenticationException)request.getAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);

        if (exception != null && StringUtils.hasText(exception.getMessage())){
            return APIResponse.errorResponseMessage(exception.getMessage());
        }
        else {
            return APIResponse.errorResponseMessage("Error while logging in");
        }
    }

    @PostMapping(Routes.PASSWORD_RESET_REQUEST)
    public APIResponse requestPasswordReset(@RequestParam("email") String email){
        return TenantContextHolder.runAsSystem(() -> {
            if (userService.canResetPassword(email)){
                passwordResetEmailService.sendPasswordResetEmail(email);
            }
            return APIResponse.successful();
        });
    }

    @PostMapping(Routes.PASSWORD_RESET)
    public APIResponse<AuthenticationStatus> resetPassword(@Valid @RequestBody ResetPasswordRequest resetRequest, HttpServletRequest request){
        APIResponse<AuthenticationStatus> result = TenantContextHolder.runAsSystem(() -> {
            Optional<PasswordResetEmailConfirmation> confirmation = passwordResetEmailService.getValidEmailConfirmationByCode(resetRequest.getConfirmationCode());
            if (!confirmation.isPresent()){
                return APIResponse.errorResponseMessage("This password reset request is no longer valid");
            }

            Optional<String> newPasswordValidationError = userService.getPasswordStrengthValidatorError(resetRequest.getNewPassword());
            if (newPasswordValidationError.isPresent()){
                Map<String, String> errors = new HashMap<>();
                errors.put("newPassword", newPasswordValidationError.get());
                return APIResponse.error(errors);
            }

            userService.resetUserPassword(confirmation.get(), resetRequest.getNewPassword());
            AuthenticationStatus loggedInStatus = authService.logInAsUser(
               confirmation.get().getEmail(),
               resetRequest.getNewPassword(),
               request.getSession(true)
            );
            return APIResponse.create(loggedInStatus);
        });
        return result;
    }
}
