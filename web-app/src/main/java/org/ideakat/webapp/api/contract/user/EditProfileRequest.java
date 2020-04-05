package org.ideakat.webapp.api.contract.user;

import lombok.Data;
import org.ideakat.domain.entities.user.User;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
public class EditProfileRequest {

    @NotNull
    @Size(min = User.MIN_NAME_LENGTH, max = User.MAX_NAME_LENGTH)
    private String displayName;

    private boolean clearingProfileImage;
}
