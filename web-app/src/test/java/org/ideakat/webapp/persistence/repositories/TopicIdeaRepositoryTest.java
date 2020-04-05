package org.ideakat.webapp.persistence.repositories;

import org.ideakat.domain.entities.group.Topic;
import org.ideakat.domain.entities.group.TopicIdea;
import org.ideakat.domain.repositories.group.TopicIdeaRepository;
import org.ideakat.domain.repositories.group.TopicRepository;
import org.ideakat.domain.repositories.projections.CountById;
import org.ideakat.webapp.persistence.PersistenceBaseTest;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Arrays;
import java.util.Map;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@DataJpaTest
@ActiveProfiles({"test-jpa"})
public class TopicIdeaRepositoryTest extends PersistenceBaseTest {

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private TopicIdeaRepository topicIdeaRepository;

    @Test
    public void getIdeaCountByTopic() {
        Topic topic = Topic.TopicBuilder.aTopic()
                                        .withGroup(group)
                                        .withAuthor(user)
                                        .withSummary("summary")
                                        .withDescription("description")
                                        .withPinned(true)
                                        .withIdeaContributionInstructions("instructions")
                                        .withTenantId(tenantId)
                                        .build();
        topic = topicRepository.save(topic);
        topicIdeaRepository.save(buildTopicIdea(TopicIdea.builder()
                                                         .topic(topic)
                                                         .author(user)
                                                         .summary("summary2")
                                                         .colour(TopicIdea.COLOUR.Yellow)
                                                         .description("desc")
        ));
        topicIdeaRepository.save(buildTopicIdea(TopicIdea.builder()
                                                         .topic(topic)
                                                         .author(user)
                                                         .summary("summary2")
                                                         .colour(TopicIdea.COLOUR.Yellow)
                                                         .description("desc")
        ));

        Topic topic2 = topicRepository.save(Topic.TopicBuilder.aTopic()
                                                              .withGroup(group)
                                                              .withAuthor(user)
                                                              .withSummary("summary2")
                                                              .withDescription("description2")
                                                              .withPinned(true)
                                                              .withIdeaContributionInstructions("instructions2")
                                                              .withTenantId(tenantId)
                                                              .build());
        topicIdeaRepository.save(buildTopicIdea(TopicIdea.builder()
                                                         .topic(topic2)
                                                         .summary("summary2")
                                                         .author(user)
                                                         .colour(TopicIdea.COLOUR.Yellow)
                                                         .description("desc")
        ));

        Topic topic3 = topicRepository.save(Topic.TopicBuilder.aTopic()
                                                              .withGroup(group)
                                                              .withAuthor(user)
                                                              .withSummary("summary2")
                                                              .withDescription("description2")
                                                              .withPinned(true)
                                                              .withIdeaContributionInstructions("instructions2")
                                                              .withTenantId(tenantId)
                                                              .build());

        Topic ignoredTopic = topicRepository.save(Topic.TopicBuilder.aTopic()
                                                                    .withGroup(group)
                                                                    .withAuthor(user)
                                                                    .withSummary("summary2")
                                                                    .withDescription("description2")
                                                                    .withPinned(true)
                                                                    .withIdeaContributionInstructions("instructions2")
                                                                    .withTenantId(tenantId)
                                                                    .build());

        Map<Long, Long> countsById = CountById.toMap(
                Arrays.asList(topic, topic2, topic3),
                topicIdeaRepository.getIdeaCountsForTopics(Arrays.asList(topic, topic2, topic3))
        );
        assertEquals(3, countsById.size());
        assertEquals(2, (long) countsById.get(topic.getId()));
        assertEquals(1, (long) countsById.get(topic2.getId()));
        assertEquals(0, (long) countsById.get(topic3.getId()));
    }

    private TopicIdea buildTopicIdea(TopicIdea.TopicIdeaBuilder builder) {
        TopicIdea topicIdea = builder.build();
        topicIdea.setTenantId(tenantId);
        return topicIdea;
    }
}
