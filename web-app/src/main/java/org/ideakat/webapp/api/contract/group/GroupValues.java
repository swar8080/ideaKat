package org.ideakat.webapp.api.contract.group;

import lombok.Data;
import org.ideakat.domain.entities.group.Group;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class GroupValues {

    @NotBlank
    @Size(min = Group.GROUP_NAME_MIN_LENGTH, max = Group.GROUP_NAME_LENGTH_LIMIT)
    private String groupName;

    @Size(max = Group.GROUP_DESCRIPTION_LENGTH)
    private String description;
}
