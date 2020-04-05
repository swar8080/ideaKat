package org.ideakat.webapp.api.admin;

import org.ideakat.webapp.api.APIResponse;
import org.ideakat.webapp.auth.configuration.Routes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.ideakat.domain.entities.user.User;
import org.ideakat.webapp.api.contract.registration.request.InviteUserRequest;
import org.ideakat.webapp.auth.AuthService;
import org.ideakat.webapp.auth.RegistrationService;
import org.ideakat.webapp.email.InviteEmailConfirmationService;

import javax.validation.Valid;
import java.util.Map;

@RestController
public class AdminController {

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private InviteEmailConfirmationService inviteEmailConfirmationService;

    @Autowired
    private AuthService authService;

    @PostMapping(Routes.ADMIN_INVITE)
    public APIResponse inviteUserToTeam(@RequestBody @Valid InviteUserRequest inviteDetails){
        Map<String, String> validationErrors = registrationService.validateUserInvite(inviteDetails);
        if (validationErrors.isEmpty()){
            User invitedBy = authService.getLoggedInUser();
            inviteEmailConfirmationService.inviteUserToTeam(invitedBy, inviteDetails);
            return APIResponse.successful();
        }
        else {
            return APIResponse.error(validationErrors);
        }
    }
}
