package org.ideakat.webapp.persistence.repositories;

import org.ideakat.domain.entities.group.Group;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import java.util.Date;
import java.util.List;

public interface GroupActivityRepository extends Repository<Group, Long> {

    @Query(
       "SELECT g.id as groupId, g.groupName as groupName, g.description as description, g.imageUrl as imageUrl, g.createdBy.id as createdBy,  COUNT(t.id) as activityCount "
       + "FROM Group g "
       + "LEFT JOIN g.topics t "
        + "WHERE "
            + "t.id IS NULL "
            + "OR t.createDate > :since "
            + "OR EXISTS("
                + "SELECT 1 "
                + "FROM TopicIdea ideas "
                + "WHERE ideas.topic.id=t.id AND ideas.createDate > :since"
            + ") "
       + "GROUP BY g.id "
       + "ORDER BY COUNT(t.id) DESC, g.groupName ASC"
    )
    List<GroupWithActivityCount> getGroupsOrderedByActivityCount(Date since);
}
