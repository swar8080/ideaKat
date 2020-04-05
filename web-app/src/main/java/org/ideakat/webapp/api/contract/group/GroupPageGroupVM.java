package org.ideakat.webapp.api.contract.group;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GroupPageGroupVM {
    private Long groupId;
    private String groupName;
    private String description;
    private String imageUrl;
    private Long activityCount;
    @JsonProperty("isEditable") private boolean isEditable;
}
