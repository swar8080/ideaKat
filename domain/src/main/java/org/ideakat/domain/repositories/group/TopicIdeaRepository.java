package org.ideakat.domain.repositories.group;

import org.ideakat.domain.entities.group.Topic;
import org.ideakat.domain.entities.group.TopicIdea;
import org.ideakat.domain.repositories.projections.CountById;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.Collection;
import java.util.List;

public interface TopicIdeaRepository extends CrudRepository<TopicIdea, Long> {
    List<TopicIdea> findByTopic_id(Long topicId);

    @Query("SELECT i.topic.id as entityId, COUNT(i.id) as cnt FROM TopicIdea i WHERE i.topic IN :topics GROUP BY i.topic")
    List<CountById> getIdeaCountsForTopics(Collection<Topic> topics);
}
