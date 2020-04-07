package org.ideakat.webapp.persistence.repositories;

import org.ideakat.domain.entities.BaseEntity;
import org.ideakat.domain.entities.group.Group;
import org.ideakat.domain.entities.group.Topic;
import org.ideakat.domain.entities.group.TopicIdea;
import org.ideakat.domain.repositories.group.GroupRepository;
import org.ideakat.domain.repositories.group.TopicIdeaRepository;
import org.ideakat.domain.repositories.group.TopicRepository;
import org.ideakat.webapp.persistence.PersistenceBaseTest;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
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

    @Autowired
    private TopicIdeaRepository topicIdeaRepository;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    public void getGroupsOrderedByActivityCount() {
        Group groupWithTopic = groupRepository.save(Group.GroupBuilder.aGroup()
                                                                      .withGroupName("group2")
                                                                      .withTenantId(tenantId)
                                                                      .withCreatedBy(user)
                                                                      .build()
        );

        Topic recentlyCreatedTopic = Topic.TopicBuilder.aTopic()
                                                       .withGroup(groupWithTopic)
                                                       .withAuthor(user)
                                                       .withTenantId(tenantId)
                                                       .withSummary("summary")
                                                       .withDescription("description")
                                                       .withIdeaContributionInstructions("instructions")
                                                       .build();
        recentlyCreatedTopic = topicRepository.save(recentlyCreatedTopic);
        updateCreateDate(recentlyCreatedTopic, Topic.TABLE_NAME, Date.from(Instant.now()));


        Topic oldTopicWithNewIdea = Topic.TopicBuilder.aTopic()
                                                      .withGroup(groupWithTopic)
                                                      .withAuthor(user)
                                                      .withTenantId(tenantId)
                                                      .withSummary("summary")
                                                      .withDescription("description")
                                                      .withIdeaContributionInstructions("instructions")
                                                      .build();
        oldTopicWithNewIdea = topicRepository.save(oldTopicWithNewIdea);
        updateCreateDate(oldTopicWithNewIdea, Topic.TABLE_NAME, Date.from(Instant.EPOCH));

        TopicIdea newIdea = TopicIdea.builder()
                                     .topic(oldTopicWithNewIdea)
                                     .summary("summary")
                                     .description("description")
                                     .author(user)
                                     .colour(TopicIdea.COLOUR.Yellow)
                                     .build();
        newIdea.setTenantId(tenantId);
        newIdea = topicIdeaRepository.save(newIdea);
        updateCreateDate(newIdea, TopicIdea.TABLE_NAME ,Date.from(Instant.now()));

        Group groupWithoutRecentActivity = group;
        Topic oldTopic = Topic.TopicBuilder.aTopic()
                                           .withGroup(groupWithoutRecentActivity)
                                           .withAuthor(user)
                                           .withTenantId(tenantId)
                                           .withSummary("summary")
                                           .withDescription("description")
                                           .withIdeaContributionInstructions("instructions")
                                           .build();
        oldTopic = topicRepository.save(oldTopic);
        updateCreateDate(oldTopic, Topic.TABLE_NAME, Date.from(Instant.EPOCH));

        Date yesterday = Date.from(Instant.now().minus(1L, ChronoUnit.DAYS));
        List<GroupWithActivityCount> countsByGroup = groupActivityRepository.getGroupsOrderedByActivityCountSince(yesterday);

        assertEquals(2, countsByGroup.size());

        assertEquals(groupWithTopic.getId(), countsByGroup.get(0).getGroupId());
        assertEquals(2, (long) countsByGroup.get(0).getActivityCount());

        assertEquals(groupWithoutRecentActivity.getId(), countsByGroup.get(1).getGroupId());
        assertEquals(0, (long) countsByGroup.get(1).getActivityCount());
    }

    //used to override hibernate's @CreationTimestamp
    private void updateCreateDate(BaseEntity entity, String tableName, Date newCreateDate){
        entityManager.flush();
        jdbcTemplate.update("UPDATE " + tableName + " SET createDate=? WHERE id=?", newCreateDate, entity.getId());
        entityManager.refresh(entity);
    }
}