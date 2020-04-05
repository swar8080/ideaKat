package org.ideakat.webapp.api.contract.topic.viewmodel.idea;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.ideakat.domain.entities.group.TopicIdea;

@Data
@EqualsAndHashCode(callSuper = true)
public class IdeaWithEditabilityVM extends IdeaVM {
    @JsonProperty("isEditable")
    private boolean isEditable;

    public IdeaWithEditabilityVM(TopicIdea idea, boolean isEditable) {
        super(idea);
        this.isEditable = isEditable;
    }
}
