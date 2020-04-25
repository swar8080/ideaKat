package org.ideakat.webapp.persistence.repositories;

import org.assertj.core.util.Sets;
import org.ideakat.domain.entities.group.Topic;
import org.ideakat.domain.entities.group.TopicIdea;
import org.ideakat.domain.entities.group.TopicIdeaTag;
import org.ideakat.domain.repositories.group.TopicIdeaRepository;
import org.ideakat.domain.repositories.group.TopicIdeaTagRepository;
import org.ideakat.domain.repositories.group.TopicRepository;
import org.ideakat.webapp.persistence.PersistenceBaseTest;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@DataJpaTest
@ActiveProfiles({"integration"})
public class TopicIdeaTagRepositoryTest extends PersistenceBaseTest {

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private TopicIdeaRepository topicIdeaRepository;

    @Autowired
    private TopicIdeaTagRepository topicIdeaTagRepository;

    private TopicIdea.TopicIdeaBuilder ideaBuilder;

    @Before
    public void setUp() {
        super.setUp();
        ideaBuilder = TopicIdea.builder()
                               .description("desc")
                               .author(user)
                               .colour(TopicIdea.COLOUR.Yellow)
                               .summary("summary");
    }

    @Test
    public void findUniqueLabelsForTopic() {
        Topic targetTopic = Topic.TopicBuilder.aTopic()
                                              .withGroup(group)
                                              .withAuthor(user)
                                              .withSummary("summary")
                                              .withDescription("description")
                                              .withPinned(true)
                                              .withIdeaContributionInstructions("instructions")
                                              .withTenantId(tenantId)
                                              .build();
        targetTopic = topicRepository.save(targetTopic);

        //first idea tag1, tag2
        TopicIdea idea1 = topicIdeaRepository.save(
                build(ideaBuilder.topic(targetTopic))
        );
        topicIdeaTagRepository.save(TopicIdeaTag.Builder.aTopicIdeaTag()
                                                        .withLabel("tag1")
                                                        .withTopicIdea(idea1)
                                                        .withTenantId(tenantId)
                                                        .build()
        );
        topicIdeaTagRepository.save(TopicIdeaTag.Builder.aTopicIdeaTag()
                                                        .withLabel("tag2")
                                                        .withTopicIdea(idea1)
                                                        .withTenantId(tenantId)
                                                        .build()
        );

        //second idea tag1, tag3
        TopicIdea idea2 = topicIdeaRepository.save(
                build(ideaBuilder.topic(targetTopic))
        );
        topicIdeaTagRepository.save(TopicIdeaTag.Builder.aTopicIdeaTag()
                                                        .withLabel("tag1")
                                                        .withTopicIdea(idea2)
                                                        .withTenantId(tenantId)
                                                        .build()
        );
        topicIdeaTagRepository.save(TopicIdeaTag.Builder.aTopicIdeaTag()
                                                        .withLabel("tag3")
                                                        .withTopicIdea(idea2)
                                                        .withTenantId(tenantId)
                                                        .build()
        );

        //set-up tags belonging to other topic to ignore
        Topic otherTopic = Topic.TopicBuilder.aTopic()
                                             .withGroup(group)
                                             .withAuthor(user)
                                             .withSummary("summary")
                                             .withDescription("description")
                                             .withPinned(true)
                                             .withIdeaContributionInstructions("instructions")
                                             .withTenantId(tenantId)
                                             .build();
        otherTopic = topicRepository.save(otherTopic);
        TopicIdea otherIdea = topicIdeaRepository.save(
                build(ideaBuilder.topic(otherTopic))
        );
        topicIdeaTagRepository.save(TopicIdeaTag.Builder.aTopicIdeaTag()
                                                        .withLabel("ignore")
                                                        .withTopicIdea(otherIdea)
                                                        .withTenantId(tenantId)
                                                        .build()
        );

        List<String> uniqueTagsForTopic = topicIdeaTagRepository.findUniqueLabelsForTopic(targetTopic.getId());
        assertEquals(3, uniqueTagsForTopic.size());
        assertEquals(
                Sets.newHashSet(Arrays.asList("tag1", "tag2", "tag3")),
                new HashSet<>(uniqueTagsForTopic)
        );
    }

    private TopicIdea build(TopicIdea.TopicIdeaBuilder builder) {
        TopicIdea topicIdea = builder.build();
        topicIdea.setTenantId(tenantId);
        return topicIdea;
    }
}