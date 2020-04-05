package org.ideakat.webapp.api;

import org.ideakat.domain.entities.group.Group;
import org.ideakat.domain.entities.group.Topic;
import org.ideakat.domain.entities.user.User;
import org.ideakat.domain.repositories.group.GroupRepository;
import org.ideakat.domain.repositories.group.TopicIdeaRepository;
import org.ideakat.domain.repositories.group.TopicRepository;
import org.ideakat.domain.repositories.projections.CountById;
import org.ideakat.webapp.auth.EntityPermissionUtil;
import org.ideakat.webapp.api.contract.topic.request.topic.TopicCreateRequest;
import org.ideakat.webapp.api.contract.topic.request.topic.TopicEditRequest;
import org.ideakat.webapp.api.contract.topic.viewmodel.topic.TopicCardWithEditabilityVM;
import org.ideakat.webapp.auth.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/topic")
public class TopicController {

    @Autowired
    private AuthService authService;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private TopicIdeaRepository topicIdeaRepository;

    @GetMapping("/{topicId}")
    public Topic getTopicById(@PathVariable("topicId") Long topicId){
        return topicRepository.findById(topicId).get();
    }

    @RequestMapping("/bygroup")
    public List<TopicCardWithEditabilityVM> getTopicsByGroup(@RequestParam("groupId") Long groupId){
        List<Topic> topics = topicRepository.findByGroup_id(groupId);
        User user = authService.getLoggedInUser();
        Map<Long, Long> ideaCountsByTopic = getIdeaCountsByTopic(topics);

        List<TopicCardWithEditabilityVM> vms = topics.stream()
            .map(topic -> toEditabilityVM(user, topic, ideaCountsByTopic))
            .collect(Collectors.toList());
        return vms;
    }

    @PostMapping("/create")
    public TopicCardWithEditabilityVM createTopic(@Valid @RequestBody TopicCreateRequest topicCreateRequest) throws Exception {
        Optional<Group> group = groupRepository.findById(topicCreateRequest.getGroupId());
        if (!group.isPresent()){
            throw new Exception();
        }

        User author = authService.getLoggedInUser();
        Topic topic = Topic.TopicBuilder
            .aTopic()
                .withGroup(group.get())
                .withAuthor(author)
                .withSummary(topicCreateRequest.getValues().getSummary())
                .withDescription(topicCreateRequest.getValues().getDescription())
                .withIdeaContributionInstructions(topicCreateRequest.getValues().getIdeaContributionInstructions())
                .withPinned(topicCreateRequest.getValues().isPinned())
            .build();

        topic = topicRepository.save(topic);
        Map<Long, Long> ideaCountsByTopic = getIdeaCountsByTopic(Collections.singletonList(topic));

        return toEditabilityVM(authService.getLoggedInUser(), topic, ideaCountsByTopic);
    }

    @PostMapping("/update")
    public TopicCardWithEditabilityVM updateTopic(@Valid @RequestBody TopicEditRequest topicEditRequest) throws Exception {
        Optional<Topic> existingTopic = topicRepository.findById(topicEditRequest.getTopicId());
        if (!existingTopic.isPresent() || !EntityPermissionUtil.isAdminOrOwner(authService.getLoggedInUser(), existingTopic.get())){
            throw new Exception(
                "User " + authService.getLoggedInUserId() + " does not have permission to edit topic " + topicEditRequest.getTopicId()
            );
        }

        existingTopic.ifPresent(topic -> {
            topic.setSummary(topicEditRequest.getValues().getSummary());
            topic.setDescription(topicEditRequest.getValues().getDescription());
            topic.setIdeaContributionInstructions(topicEditRequest.getValues().getIdeaContributionInstructions());
            topic.setPinned(topicEditRequest.getValues().isPinned());
        });
        Topic updatedTopic = topicRepository.save(existingTopic.get());
        Map<Long, Long> ideaCountByTopic = getIdeaCountsByTopic(Collections.singletonList(updatedTopic));

        return toEditabilityVM(authService.getLoggedInUser(), updatedTopic, ideaCountByTopic);
    }

    @DeleteMapping("/delete")
    @Transactional
    public APIResponse deleteTopic(@RequestParam("topicId") Long topicId){
        User user = authService.getLoggedInUser();

        Optional<Topic> topic = topicRepository.findById(topicId);
        if (topic.isPresent()){
            if (EntityPermissionUtil.isAdminOrOwner(user, topic.get())){
                topicRepository.deleteById(topicId);
                return APIResponse.successful();
            }
            else {
                return APIResponse.errorResponseMessage("Access denied");
            }
        }
        else {
            return APIResponse.successful();
        }
    }

    private TopicCardWithEditabilityVM toEditabilityVM(User user, Topic topic, Map<Long, Long> ideaCountsByTopic){
        boolean canModify = EntityPermissionUtil.isAdminOrOwner(user, topic);
        return TopicCardWithEditabilityVM.editabilityBuilder()
            .topic(topic)
            .isEditable(canModify)
            .isPinnable(canModify)
            .isDeleteable(canModify)
            .ideaCount(ideaCountsByTopic.getOrDefault(topic.getId(), 0L))
            .build();
    }

    private Map<Long, Long> getIdeaCountsByTopic(Collection<Topic> topics){
        if (topics.isEmpty()){
            return new HashMap<>();
        }
        return CountById.toMap(topics, topicIdeaRepository.getIdeaCountsForTopics(topics));
    }
}
