package org.ideakat.webapp.persistence.repositories;

import org.ideakat.domain.entities.group.Group;
import org.ideakat.domain.entities.group.Topic;
import org.ideakat.domain.repositories.group.GroupRepository;
import org.ideakat.domain.repositories.group.TopicRepository;
import org.ideakat.webapp.persistence.PersistenceBaseTest;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.Instant;
import java.util.List;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@DataJpaTest
@ActiveProfiles({"test-jpa"})
public class GroupActivityRepositoryTest extends PersistenceBaseTest {

    @Autowired
    private GroupActivityRepository groupActivityRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Test
    public void getGroupsOrderedByActivityCount() {
        Group groupWithTopic = groupRepository.save(Group.GroupBuilder.aGroup()
                .withGroupName("group2")
                .withTenantId(tenantId)
                .withCreatedBy(user)
                .build()
        );
        topicRepository.save(Topic.TopicBuilder.aTopic()
            .withGroup(groupWithTopic)
            .withAuthor(user)
            .withTenantId(tenantId)
            .withSummary("summary")
            .withDescription("description")
            .withIdeaContributionInstructions("instructions")
            .build()
        );

        List<GroupWithActivityCount> countsByGroup = groupActivityRepository.getGroupsOrderedByActivityCount(java.util.Date.from(Instant.EPOCH));

        assertEquals(2, countsByGroup.size());

        assertEquals(groupWithTopic.getId(), countsByGroup.get(0).getGroupId());
        assertEquals(1, (long)countsByGroup.get(0).getActivityCount());
        assertEquals(user.getId(), countsByGroup.get(0).getCreatedBy());

        assertEquals(group.getId(), countsByGroup.get(1).getGroupId());
        assertEquals(0, (long)countsByGroup.get(1).getActivityCount());
    }
}