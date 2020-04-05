package org.ideakat.webapp.api.contract.topic.request.idea;

import lombok.Builder;
import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@Data
@Builder
public class IdeaCreateRequest {

    @NotNull
    private Long topicId;

    @NotNull
    @Valid
    private IdeaValues values;
}
