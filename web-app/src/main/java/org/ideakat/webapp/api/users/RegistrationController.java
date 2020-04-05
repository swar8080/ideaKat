package org.ideakat.webapp.api.users;

import org.ideakat.domain.entities.user.AdminEmailConfirmation;
import org.ideakat.domain.entities.user.InviteEmailConfirmation;
import org.ideakat.domain.entities.user.User;
import org.ideakat.webapp.api.APIResponse;
import org.ideakat.webapp.api.contract.auth.AuthenticationStatus;
import org.ideakat.webapp.api.contract.registration.OrganizationRegistrationDetails;
import org.ideakat.webapp.api.contract.registration.TenantRegistrationOutcome;
import org.ideakat.webapp.api.contract.registration.UserProfileRegistrationDetails;
import org.ideakat.webapp.api.contract.registration.request.InvitedUserRegistrationRequest;
import org.ideakat.webapp.api.contract.registration.request.TeamRegistrationRequest;
import org.ideakat.webapp.auth.AuthService;
import org.ideakat.webapp.auth.RegistrationService;
import org.ideakat.webapp.auth.TenantContextHolder;
import org.ideakat.webapp.auth.UserService;
import org.ideakat.webapp.auth.configuration.Routes;
import org.ideakat.webapp.email.AdminEmailConfirmationService;
import org.ideakat.webapp.email.InviteEmailConfirmationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.util.Map;
import java.util.Optional;

import static org.ideakat.webapp.auth.TenantContextHolder.runAsSystem;

@RestController
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private AdminEmailConfirmationService adminEmailConfirmationService;

    @Autowired
    private InviteEmailConfirmationService inviteEmailConfirmationService;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @Value("${ideakat.publicUrl}")
    private String publicUrl;

    @PostMapping(Routes.REGISTER_VALIDATE_ORG_DETAILS)
    public APIResponse validateOrganizationDetails(@RequestBody @Valid OrganizationRegistrationDetails details){
        Map<String, String> errors = runAsSystem(() ->
            registrationService.validateOrganizationDetails(details)
        );
        return APIResponse.successfulIfNoErrors(errors);
    }

    @PostMapping(Routes.REGISTER_VALIDATE_PROFILE_DETAILS)
    public APIResponse validateProfileDetails(@RequestBody @Valid UserProfileRegistrationDetails details){
        Map<String, String> errors = runAsSystem(() ->
            registrationService.validateUserProfileDetails(details)
        );
        return APIResponse.successfulIfNoErrors(errors);
    }

    @PostMapping(value = Routes.REGISTER_TEAM, consumes = "multipart/form-data")
    public APIResponse registerTeam(
            @RequestPart("registrationDetails") @Valid TeamRegistrationRequest registrationDetails,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage
    ){
        APIResponse response = runAsSystem(() -> {
            if (adminEmailConfirmationService.resendTenantRegistrationConfirmationEmailIfUnverified(
                    registrationDetails.getOrganizationDetails().getAdminEmail()
            )){
                return APIResponse.successful();
            }
            else {
                TenantRegistrationOutcome outcome = registrationService.registerTenant(registrationDetails, Optional.ofNullable(profileImage));
                if (outcome.getErrors().isEmpty()){
                    adminEmailConfirmationService.sendTenantAdminConfirmationEmail(outcome.getEmailConfirmation());
                    return APIResponse.successful();
                }
                else {
                    return APIResponse.error(outcome.getErrors());
                }
            }
        });
        return response;
    }

    @GetMapping(Routes.ADMIN_REGISTRATION_CONFIRMATION + Routes.CONFIRMATION_CODE_URL_PATH_VARIABLE)
    public void confirmAdminRegistration(@PathVariable(Routes.CONFIRMATION_CODE_URL_PARAM_NAME) String confirmationCode, HttpServletResponse response) throws IOException {
        boolean succesful = runAsSystem(() -> {
            Optional<AdminEmailConfirmation> confirmation = adminEmailConfirmationService.getValidAdminRegistrationEmailConfirmation(confirmationCode);
            if (confirmation.isPresent()){
                userService.confirmAdminEmail(confirmation.get());
                return true;
            }
            return false;
        });

        if (succesful){
            response.sendRedirect(publicUrl + Routes.UI_LOGIN + "?" + Routes.UI_SHOW_HELP_DIALOG_URL_PARAM);
        }
        else {
            response.sendRedirect(publicUrl + Routes.UI_EXPIRED_EMAIL_CONFIRMATION);
        }
    }

    @GetMapping(Routes.INVITE_REGISTRATON_CONFIRMATION + Routes.CONFIRMATION_CODE_URL_PATH_VARIABLE)
    public void confirmValidUserInvite(@PathVariable(Routes.CONFIRMATION_CODE_URL_PARAM_NAME) String confirmationCode, HttpServletResponse response) throws IOException {
        boolean isValidCode = runAsSystem(() ->
            inviteEmailConfirmationService.isValidConfirmationCode(confirmationCode)
        );

        if (isValidCode){
            String uiUrlWithCode = publicUrl + Routes.UI_INVITE_REGISTRATION + "/" + confirmationCode;
            response.sendRedirect(uiUrlWithCode);
        }
        else {
            response.sendRedirect(Routes.UI_EXPIRED_EMAIL_CONFIRMATION);
        }
    }

    @PostMapping(value = Routes.INVITE_REGISTRATON_COMPLETE, consumes = {"multipart/form-data"})
    public APIResponse<AuthenticationStatus> completeInviteRegistration(
            @Valid @RequestPart("registrationDetails") InvitedUserRegistrationRequest request,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
            HttpServletRequest servletRequest
    ){
        APIResponse response = TenantContextHolder.runAsSystem(() -> {
            Optional<InviteEmailConfirmation> validEmailConfirmation = inviteEmailConfirmationService.getValidConfirmationForCode(request.getConfirmationCode());
            if (validEmailConfirmation.isPresent()){
                Map<String, String> profileErrors = registrationService.validateUserProfileDetails(request.getUserProfileDetails());
                if (!profileErrors.isEmpty()){
                    return APIResponse.error(profileErrors);
                }

                if (registrationService.hasUserWithEmail(validEmailConfirmation.get().getEmail())){
                    return APIResponse.errorResponseMessage("An account already exists with this email. Try logging in.");
                }

                User invitedUser = registrationService.completeInviteRegistration(request, validEmailConfirmation.get(), Optional.ofNullable(profileImage));
                AuthenticationStatus invitedUserAuthStatus = authService.logInAsUser(
                        invitedUser.getEmail(),
                        request.getUserProfileDetails().getPassword(),
                        servletRequest.getSession(true)
                );
                return APIResponse.create(invitedUserAuthStatus);
            }
            else {
                return APIResponse.errorResponseMessage("This invitation has expired");
            }
        });
        return response;
    }
}
