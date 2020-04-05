package org.ideakat.webapp.api.contract.topic.request.idea;

import com.fasterxml.jackson.annotation.JsonProperty;
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
public class IdeaSearchRequest {
    @NotNull
    private Long topicId;

    @Size(max = 50)
    private String searchString;

    private TopicIdea.COLOUR colour;

    @JsonProperty("isUsersIdea")
    private Boolean isUsersIdeas;

    @Valid
    private List<IdeaTagVM> tags;

    public boolean isUsersIdeas(){
        return isUsersIdeas != null && isUsersIdeas;
    }
}
