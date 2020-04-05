package org.ideakat.webapp.api;

import org.ideakat.webapp.auth.EntityPermissionUtil;
import org.ideakat.webapp.persistence.service.IdeaSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.ideakat.domain.entities.user.User;
import org.ideakat.domain.entities.group.Topic;
import org.ideakat.domain.entities.group.TopicIdea;
import org.ideakat.domain.entities.group.TopicIdeaTag;
import org.ideakat.domain.repositories.group.TopicIdeaRepository;
import org.ideakat.domain.repositories.group.TopicIdeaTagRepository;
import org.ideakat.domain.repositories.group.TopicRepository;
import org.ideakat.webapp.api.contract.topic.request.idea.IdeaCreateRequest;
import org.ideakat.webapp.api.contract.topic.request.idea.IdeaEditRequest;
import org.ideakat.webapp.api.contract.topic.request.idea.IdeaSearchRequest;
import org.ideakat.webapp.api.contract.topic.request.idea.IdeaValues;
import org.ideakat.webapp.api.contract.topic.viewmodel.idea.IdeaTagVM;
import org.ideakat.webapp.api.contract.topic.viewmodel.idea.IdeaVM;
import org.ideakat.webapp.api.contract.topic.viewmodel.idea.IdeaWithEditabilityVM;
import org.ideakat.webapp.auth.AuthService;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/idea")
public class IdeaController {

    @Autowired
    private AuthService authService;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private TopicIdeaRepository topicIdeaRepository;

    @Autowired
    private TopicIdeaTagRepository topicIdeaTagRepository;

    @Autowired
    private IdeaSearchService ideaSearchService;

    @RequestMapping("bytopic")
    public List<IdeaWithEditabilityVM> getIdeasForTopic(@RequestParam Long topicId){
        //TODO fetch and assign tags in bulk
        List<TopicIdea> ideas = topicIdeaRepository.findByTopic_id(topicId);
        List<IdeaWithEditabilityVM> vms = toEditabilityVM(ideas);
        return vms;
    }

    @PostMapping("create")
    @Transactional
    public APIResponse<IdeaVM> createIdea(@Valid @RequestBody IdeaCreateRequest request) throws Exception {
        Optional<Topic> topic = topicRepository.findById(request.getTopicId());
        if (!topic.isPresent()){
            throw new Exception("Invalid topic id");
        }

        User author = authService.getLoggedInUser();
        IdeaValues values = request.getValues();
        TopicIdea idea = TopicIdea.builder()
            .topic(topic.get())
            .author(author)
            .summary(values.getSummary())
            .description(values.getDescription())
            .colour(values.getColour())
            .build();
        idea.setTenantId(author.getTenantId());

        List<TopicIdeaTag> newTags = getNewTagsForTopicIdea(idea, values.getTags());
        idea.setTags(newTags);

        idea = topicIdeaRepository.save(idea);
        return APIResponse.create(new IdeaWithEditabilityVM(idea, true));
    }

    @Transactional
    @PostMapping("/edit")
    public APIResponse<IdeaWithEditabilityVM> editIdea(@Valid @RequestBody IdeaEditRequest request) throws Exception {
        Optional<TopicIdea> existingIdea = topicIdeaRepository.findById(request.getIdeaId());
        if (!existingIdea.isPresent() || !EntityPermissionUtil.isAdminOrOwner(authService.getLoggedInUser(), existingIdea.get())){
            throw new Exception("User " + authService.getLoggedInUserId() + " cannot edit topic idea " + request.getIdeaId());
        }

        TopicIdea idea = existingIdea.get();
        IdeaValues values = request.getValues();

        idea.setSummary(values.getSummary());
        idea.setDescription(values.getDescription());
        idea.setColour(values.getColour());

        Set<String> requestedLabels = values.getTags().stream().map(IdeaTagVM::normalize).collect(Collectors.toSet());
        Set<String> existingLabels = idea.getTags().stream().map(TopicIdeaTag::getLabel).collect(Collectors.toSet());
        idea.getTags().removeIf(tag -> !requestedLabels.contains(tag.getLabel()));
        requestedLabels.forEach(requestedLabel -> {
           if (!existingLabels.contains(requestedLabel)){
               TopicIdeaTag newTag = TopicIdeaTag.Builder.aTopicIdeaTag()
                   .withLabel(requestedLabel)
                   .withTopicIdea(idea)
                   .build();
               idea.getTags().add(newTag);
           }
        });

        TopicIdea savedIdea = topicIdeaRepository.save(idea);
        return APIResponse.create(new IdeaWithEditabilityVM(savedIdea, true));
    }

    @RequestMapping("/search")
    public List<IdeaWithEditabilityVM> search(@Valid @RequestBody IdeaSearchRequest request){
        Optional<Long> userIdFilter = Optional.ofNullable(
            request.isUsersIdeas()? authService.getLoggedInUser().getId() : null
        );

        List<TopicIdea> searchResults = ideaSearchService.search(
            request.getTopicId(),
            Optional.ofNullable(request.getSearchString()),
            userIdFilter,
            Optional.ofNullable(request.getColour()),
            IdeaTagVM.getNormalizedLabels(request.getTags())
        );

        List<IdeaWithEditabilityVM> vms = toEditabilityVM(searchResults);
        return vms;
    }

    @RequestMapping("/tagsForTopic")
    public List<IdeaTagVM> getTagsForTopic(Long topicId){
        List<String> uniqueTopicTags = topicIdeaTagRepository.findUniqueLabelsForTopic(topicId);
        return uniqueTopicTags.stream().map(IdeaTagVM::new).collect(Collectors.toList());
    }

    private List<IdeaWithEditabilityVM> toEditabilityVM(List<TopicIdea> ideas){
        User currentUser = authService.getLoggedInUser();
        return ideas.stream()
                .map(idea -> {
                    boolean isEditable = EntityPermissionUtil.isAdminOrOwner(currentUser, idea);
                    return new IdeaWithEditabilityVM(idea, isEditable);
                })
                .collect(Collectors.toList());
    }

    private List<TopicIdeaTag> getNewTagsForTopicIdea(TopicIdea topicIdea, List<IdeaTagVM> tags){
        List<TopicIdeaTag> newTags = tags.stream()
                .map(tag -> TopicIdeaTag.Builder.aTopicIdeaTag()
                        .withTopicIdea(topicIdea)
                        .withLabel(tag.getLabel())
                        .build()
                )
                .collect(Collectors.toList());
        return newTags;
    }
}
