package org.ideakat.webapp.api.contract.topic.request.idea;

import lombok.Builder;
import lombok.Data;
import org.ideakat.domain.entities.group.TopicIdea;
import org.ideakat.webapp.api.contract.topic.viewmodel.idea.IdeaTagVM;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Data
@Builder
public class IdeaValues {
    @NotNull
    @Size(max = TopicIdea.IDEA_SUMMARY_MAX_LENGTH)
    private String summary;

    @NotNull
    @Size(max = TopicIdea.IDEA_MAX_LENGTH)
    private String description;

    @NotNull
    private TopicIdea.COLOUR colour;

    @NotNull
    @Valid
    private List<IdeaTagVM> tags;
}
