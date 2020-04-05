package org.ideakat.webapp.api.contract.topic.request.idea;

import lombok.Builder;
import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@Data
@Builder
public class IdeaEditRequest {

    @NotNull
    private Long ideaId;

    @NotNull
    @Valid
    private IdeaValues values;
}