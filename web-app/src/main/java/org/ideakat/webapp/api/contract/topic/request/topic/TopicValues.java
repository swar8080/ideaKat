package org.ideakat.webapp.api.contract.topic.request.topic;

import lombok.Builder;
import lombok.Data;
import org.ideakat.domain.entities.group.Topic;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@Builder
public class TopicValues {

    @NotBlank
    @Size(max = Topic.SUMMARY_MAX_LENGTH)
    private String summary;

    @Size(max = Topic.DESCRIPTION_MAX_LENGTH)
    private String description;

    @Size(max = Topic.IDEA_CONTRIBUTION_INSTRUCTIONS_MAX_LENGTH)
    private String ideaContributionInstructions;

    private boolean pinned;
}
