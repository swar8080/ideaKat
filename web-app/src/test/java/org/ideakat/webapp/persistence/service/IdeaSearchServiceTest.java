package org.ideakat.webapp.persistence.service;

import org.ideakat.domain.entities.BaseEntity;
import org.ideakat.domain.entities.group.Topic;
import org.ideakat.domain.entities.group.TopicIdea;
import org.ideakat.domain.entities.group.TopicIdeaTag;
import org.ideakat.domain.entities.user.User;
import org.ideakat.domain.repositories.group.TopicIdeaRepository;
import org.ideakat.domain.repositories.group.TopicIdeaTagRepository;
import org.ideakat.domain.repositories.group.TopicRepository;
import org.ideakat.domain.repositories.user.UserRepository;
import org.ideakat.webapp.persistence.PersistenceBaseTest;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@RunWith(SpringRunner.class)
@DataJpaTest
@Import({IdeaSearchService.class})
@ActiveProfiles({"test-jpa"})
public class IdeaSearchServiceTest extends PersistenceBaseTest {

    @Autowired
    private IdeaSearchService ideaSearchService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private TopicIdeaRepository topicIdeaRepository;

    @Autowired
    private TopicIdeaTagRepository topicIdeaTagRepository;

    private Topic topic;

    private TopicIdea.TopicIdeaBuilder builder;

    @Before
    public void setUp() {
        super.setUp();
        topic = topicRepository.save(
                Topic.TopicBuilder.aTopic()
                                  .withAuthor(user)
                                  .withDescription("desc")
                                  .withGroup(group)
                                  .withSummary("summary")
                                  .withIdeaContributionInstructions("instructions")
                                  .withTenantId(tenant.getId())
                                  .build()
        );

        builder = TopicIdea.builder()
                           .author(user)
                           .description("desc")
                           .summary("summary")
                           .topic(topic)
                           .colour(TopicIdea.COLOUR.Blue)
                           .tags(new ArrayList<>());
    }

    private TopicIdea build(Function<TopicIdea.TopicIdeaBuilder, TopicIdea> build) {
        TopicIdea topicIdeaTag = build.apply(builder);
        topicIdeaTag.setTenantId(tenant.getId());
        return topicIdeaTag;
    }

    @Test
    public void search_ByTopic() {
        TopicIdea targetIdea = topicIdeaRepository.save(build(builder -> builder.topic(topic)
                                                               .build()));

        Topic otherTopic = topicRepository.save(
                Topic.TopicBuilder.aTopic()
                                  .withGroup(group)
                                  .withAuthor(user)
                                  .withSummary("summary")
                                  .withDescription("desc")
                                  .withIdeaContributionInstructions("das")
                                  .withTenantId(tenant.getId())
                                  .build()
        );
        topicIdeaRepository.save(build((builder) -> builder.topic(otherTopic)
                                                           .build()));

        List<TopicIdea> results = ideaSearchService.search(
                topic.getId(), Optional.empty(), Optional.empty(), Optional.empty(), Collections.emptyList()
        );

        assertEquals(1, results.size());
        assertEquals(targetIdea.getId(), results.get(0)
                                                .getId());
    }

    @Test
    public void search_ByUser() {
        TopicIdea usersIdea = topicIdeaRepository.save(build(builder -> builder.author(user)
                                                              .build()));

        User otherUser = userRepository.save(
                User.UserBuilder.aUser()
                                .withName("other")
                                .withEmail("other email")
                                .withPassword("password")
                                .withImageUrl("ds")
                                .withIsAdmin(false)
                                .withIsConfirmed(true)
                                .withTenantId(tenant.getId())
                                .build()
        );
        topicIdeaRepository.save(
                build(builder -> builder.author(otherUser)
                                        .build())
        );

        List<TopicIdea> results = ideaSearchService.search(
                topic.getId(), Optional.empty(), Optional.of(user.getId()), Optional.empty(), Collections.emptyList()
        );

        assertEquals(1, results.size());
        assertEquals(usersIdea.getId(), results.get(0)
                                               .getId());

        results = ideaSearchService.search(
                topic.getId(), Optional.empty(), Optional.empty(), Optional.empty(), Collections.emptyList()
        );
        assertEquals(2, results.size());
    }

    @Test
    public void search_ByColour() {
        TopicIdea yellowIdea = topicIdeaRepository.save(build(builder -> builder.colour(TopicIdea.COLOUR.Yellow)
                                                               .build()));
        topicIdeaRepository.save(build(builder -> builder.colour(TopicIdea.COLOUR.Blue)
                                                         .build()));

        List<TopicIdea> results = ideaSearchService.search(
                topic.getId(), Optional.empty(), Optional.empty(), Optional.of(TopicIdea.COLOUR.Yellow), Collections.emptyList()
        );

        assertEquals(1, results.size());
        assertEquals(yellowIdea.getId(), results.get(0)
                                                .getId());
    }

    @Test
    public void search_BySearchTerm() {
        TopicIdea matchingDescription = topicIdeaRepository.save(build(builder -> builder.description("matching description")
                                                                                         .build()));
        TopicIdea matchingSummary = topicIdeaRepository.save(build(builder -> builder.description("ignore")
                                                                                     .summary("matching summary")
                                                                                     .build()));
        topicIdeaRepository.save(build(builder -> builder.description("ignore")
                                                         .summary("ignore")
                                                         .build()));

        List<TopicIdea> results = ideaSearchService.search(
                topic.getId(), Optional.of("match"), Optional.empty(), Optional.empty(), Collections.emptyList()
        );

        assertEquals(2, results.size());
        Set<Long> matchingIds = results.stream()
                                       .map(BaseEntity::getId)
                                       .collect(Collectors.toSet());
        assertTrue(matchingIds.contains(matchingDescription.getId()));
        assertTrue(matchingIds.contains(matchingSummary.getId()));
    }

    @Test
    public void search_ByTags() {
        TopicIdea ideaWithNoTags = topicIdeaRepository.save(build(TopicIdea.TopicIdeaBuilder::build));

        TopicIdea ideaWithTag1 = topicIdeaRepository.save(build(TopicIdea.TopicIdeaBuilder::build));
        topicIdeaTagRepository.save(
                TopicIdeaTag.Builder.aTopicIdeaTag()
                                    .withTopicIdea(ideaWithTag1)
                                    .withLabel("tag1")
                                    .withTenantId(tenant.getId())
                                    .build()
        );

        TopicIdea ideaWithTag2 = topicIdeaRepository.save(build(TopicIdea.TopicIdeaBuilder::build));
        topicIdeaTagRepository.save(
                TopicIdeaTag.Builder.aTopicIdeaTag()
                                    .withTopicIdea(ideaWithTag2)
                                    .withLabel("tag2")
                                    .withTenantId(tenant.getId())
                                    .build()
        );

        topicIdeaTagRepository.save(
                TopicIdeaTag.Builder.aTopicIdeaTag()
                                    .withTopicIdea(ideaWithTag2)
                                    .withLabel("ignore")
                                    .withTenantId(tenant.getId())
                                    .build()
        );

        List<TopicIdea> results = ideaSearchService.search(topic.getId(),
                Optional.empty(), Optional.empty(), Optional.empty(),
                Arrays.asList("tag1", "tag2"));

        assertEquals(2, results.size());
        Set<Long> matchingTopicIds = results.stream()
                                            .map(TopicIdea::getId)
                                            .collect(Collectors.toSet());
        assertTrue(matchingTopicIds.contains(ideaWithTag1.getId()));
        assertTrue(matchingTopicIds.contains(ideaWithTag2.getId()));
    }

    @Test
    public void searchWithMultipleConditions() {
        TopicIdea expected = topicIdeaRepository.save(
                build(builder -> builder
                        .description("matching description")
                        .colour(TopicIdea.COLOUR.Yellow)
                        .build())
        );

        List<TopicIdea> results = ideaSearchService.search(
                topic.getId(), Optional.of("match"), Optional.empty(), Optional.of(TopicIdea.COLOUR.Yellow), Collections.emptyList()
        );

        assertEquals(expected.getId(), results.get(0)
                                              .getId());
    }
}