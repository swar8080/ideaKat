package org.ideakat.webapp.api.contract.group;

import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@Data
public class EditGroupRequest {

    @NotNull
    private Long groupId;

    @Valid
    private GroupValues values;

    private boolean clearingGroupImage;
}
