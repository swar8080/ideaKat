package org.ideakat.webapp.api.contract.topic.viewmodel.idea;

import lombok.Builder;
import lombok.Data;
import org.ideakat.domain.entities.user.User;
import org.ideakat.domain.entities.group.TopicIdea;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class IdeaVM {
    private Long id;
    private Long topicId;
    private User author;
    private String summary;
    private String description;
    private TopicIdea.COLOUR colour;
    private List<IdeaTagVM> tags;

    public IdeaVM(Long id, Long topicId, User author, String summary, String description, TopicIdea.COLOUR colour, List<IdeaTagVM> tags) {
        this.id = id;
        this.topicId = topicId;
        this.author = author;
        this.summary = summary;
        this.description = description;
        this.colour = colour;

        this.tags = new ArrayList<>(tags);
        this.tags.sort(Comparator.comparing(IdeaTagVM::getLabel));
    }

    public IdeaVM(TopicIdea idea){
        this(idea.getId(), idea.getTopic().getId(), idea.getAuthor(), idea.getSummary(), idea.getDescription(), idea.getColour(),
                idea.getTags().stream().map(IdeaTagVM::fromTopicIdeaTag).collect(Collectors.toList()));
    }
}
