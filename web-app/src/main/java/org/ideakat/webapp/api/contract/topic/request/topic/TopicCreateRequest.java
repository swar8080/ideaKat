package org.ideakat.webapp.api.contract.topic.request.topic;

import lombok.Builder;
import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@Data
@Builder
public class TopicCreateRequest {

    @NotNull
    private Long groupId;

    @NotNull
    @Valid
    private TopicValues values;
}
