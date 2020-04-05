package org.ideakat.domain.repositories.group;

import org.ideakat.domain.entities.group.Topic;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface TopicRepository extends CrudRepository<Topic, Long> {
    List<Topic> findByGroup_id(Long groupId);
}

