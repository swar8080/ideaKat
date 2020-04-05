package org.ideakat.webapp.api.contract.topic.viewmodel.topic;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import org.ideakat.domain.entities.group.Topic;

@Data
@Builder
public class TopicCardVM {
    @JsonProperty("model")
    private Topic topic;
    private Long ideaCount;
}
