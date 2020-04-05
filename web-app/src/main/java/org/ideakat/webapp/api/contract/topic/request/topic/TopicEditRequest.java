package org.ideakat.webapp.api.contract.topic.request.topic;

import lombok.Builder;
import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@Data
@Builder
public class TopicEditRequest {

    @NotNull
    private Long topicId;

    @NotNull
    @Valid
    private TopicValues values;
}
