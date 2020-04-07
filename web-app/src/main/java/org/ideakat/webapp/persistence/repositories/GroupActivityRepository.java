package org.ideakat.webapp.persistence.repositories;

import org.ideakat.domain.entities.group.Group;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import java.util.Date;
import java.util.List;

public interface GroupActivityRepository extends Repository<Group, Long> {

    //TODO see how well postgres can optimize this with a larger dataset compared to a native query joining on a subselect
    @Query(
       "SELECT g.id as groupId, g.groupName as groupName, g.description as description, g.imageUrl as imageUrl, g.createdBy.id as createdBy, "
       + "SUM("
           + "CASE WHEN "
               + "t.id IS NOT NULL AND( "
                   + "t.createDate > :since OR EXISTS("
                        + "SELECT 1 "
                        + "FROM TopicIdea ideas "
                        + "WHERE ideas.topic.id=t.id AND ideas.createDate > :since"
                    + ")"
               + ") THEN 1 ELSE 0 END"
           + ") as activityCount "
       + "FROM Group g "
       + "LEFT JOIN g.topics t "
       + "GROUP BY g.id "
       + "ORDER BY activityCount DESC, g.groupName ASC"
    )
    List<GroupWithActivityCount> getGroupsOrderedByActivityCountSince(Date since);
}
