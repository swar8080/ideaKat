package org.ideakat.domain.repositories.group;

import org.ideakat.domain.entities.group.TopicIdeaTag;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface TopicIdeaTagRepository extends CrudRepository<TopicIdeaTag, Long> {
    @Query(
        "SELECT DISTINCT(tag.label) FROM TopicIdeaTag tag "
        + "JOIN tag.topicIdea idea "
        + "WHERE idea.topic.id = :topicId"
    )
    List<String> findUniqueLabelsForTopic(Long topicId);
}
