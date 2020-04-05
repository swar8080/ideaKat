package org.ideakat.webapp.api.contract.auth;

import lombok.Data;
import org.ideakat.domain.entities.user.UserEmailConfirmation;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class ResetPasswordRequest {

    @NotBlank
    @Size(min = UserEmailConfirmation.CONFIRMATION_CODE_LENGTH, max = UserEmailConfirmation.CONFIRMATION_CODE_LENGTH)
    private String confirmationCode;

    @NotBlank
    private String newPassword;
}
