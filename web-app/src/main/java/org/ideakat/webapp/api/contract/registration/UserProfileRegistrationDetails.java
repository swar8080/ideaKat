package org.ideakat.webapp.api.contract.registration;

import lombok.Data;
import org.ideakat.domain.entities.user.User;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class UserProfileRegistrationDetails {
    @NotBlank
    @Size(min = User.MIN_NAME_LENGTH, max = User.MAX_NAME_LENGTH)
    private String fullName;

    @NotBlank
    @Size(min = User.MIN_PASS_LENGTH, max = User.MAX_PASS_LENGTH)
    private String password;
}
