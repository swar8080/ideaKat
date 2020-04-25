package org.ideakat.webapp.persistence.repositories;

import org.ideakat.domain.entities.group.Group;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import java.util.Date;
import java.util.List;

public interface GroupActivityRepository extends Repository<Group, Long> {

    @Query(
        nativeQuery = true,
        value = "SELECT g.id as \"groupId\", g.\"groupName\", g.description, g.\"imageUrl\", g.\"createdBy\", COALESCE(\"activityCount\", 0) as \"activityCount\" " +
        "FROM groups g " +
        "LEFT JOIN(" +
                "SELECT topics.\"groupId\", COUNT(*) as \"activityCount\" " +
                "FROM topic topics " +
                "WHERE topics.\"createDate\" > :since OR EXISTS(" +
                    "SELECT 1 FROM \"topicIdea\" ideas WHERE ideas.topic=topics.id AND ideas.\"createDate\" > :since" +
                ") " +
                "GROUP BY topics.\"groupId\"" +
        ") \"groupActivity\" ON \"groupActivity\".\"groupId\"=g.\"id\" " +
        "ORDER BY \"activityCount\" DESC, g.\"groupName\" ASC"
    )
    List<GroupWithActivityCount> getGroupsOrderedByActivityCountSince(Date since);
}
