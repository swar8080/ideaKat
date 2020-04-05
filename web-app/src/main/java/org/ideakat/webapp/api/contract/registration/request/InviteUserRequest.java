package org.ideakat.webapp.api.contract.registration.request;

import lombok.Data;
import org.ideakat.domain.entities.user.User;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
public class InviteUserRequest {
    @Email
    @NotNull
    @Size(min = User.MIN_EMAIL_LENGTH, max = User.MAX_EMAIL_LENGTH)
    private String userEmail;
}
