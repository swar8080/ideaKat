package org.ideakat.webapp.api.contract.registration.request;

import lombok.Data;
import org.ideakat.webapp.api.contract.registration.UserProfileRegistrationDetails;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class InvitedUserRegistrationRequest {

    @NotNull
    @Valid
    private UserProfileRegistrationDetails userProfileDetails;

    @NotBlank
    private String confirmationCode;
}
