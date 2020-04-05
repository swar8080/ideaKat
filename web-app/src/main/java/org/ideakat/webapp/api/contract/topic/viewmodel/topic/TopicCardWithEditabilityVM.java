package org.ideakat.webapp.api.contract.topic.viewmodel.topic;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.ideakat.domain.entities.group.Topic;

@Data
@EqualsAndHashCode(callSuper = true)
public class TopicCardWithEditabilityVM extends TopicCardVM {
    @JsonProperty("isEditable")
    private boolean isEditable;

    @JsonProperty("isPinnable")
    private boolean isPinnable;

    @JsonProperty("isDeleteable")
    private boolean isDeleteable;

    @Builder(builderMethodName = "editabilityBuilder")
    public TopicCardWithEditabilityVM(Topic topic, Long ideaCount, boolean isEditable, boolean isPinnable, boolean isDeleteable) {
        super(topic, ideaCount);
        this.isEditable = isEditable;
        this.isPinnable = isPinnable;
        this.isDeleteable = isDeleteable;
    }
}
