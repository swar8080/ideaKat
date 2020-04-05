package org.ideakat.webapp.api;

import org.ideakat.domain.entities.group.Group;
import org.ideakat.domain.entities.user.User;
import org.ideakat.domain.repositories.group.GroupRepository;
import org.ideakat.webapp.api.contract.group.EditGroupRequest;
import org.ideakat.webapp.api.contract.group.GroupPageGroupVM;
import org.ideakat.webapp.api.contract.group.GroupValues;
import org.ideakat.webapp.auth.AuthService;
import org.ideakat.webapp.auth.EntityPermissionUtil;
import org.ideakat.webapp.persistence.repositories.GroupActivityRepository;
import org.ideakat.webapp.persistence.repositories.GroupWithActivityCount;
import org.ideakat.webapp.persistence.service.images.ImageUploadService;
import org.ideakat.webapp.persistence.service.images.ImageUploadUtil;
import org.ideakat.webapp.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/group")
public class GroupController {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private GroupActivityRepository groupActivityRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private ImageUploadService imageUploadService;

    @GetMapping("/{groupId}")
    public Group getGroup(@PathVariable("groupId") Long groupId) throws Exception {
        return groupRepository.findById(groupId)
                              .orElseThrow(Exception::new);
    }

    @GetMapping("/byactivity")
    public List<GroupPageGroupVM> getGroupsOrderedByActivity() {
        User currentUser = authService.getLoggedInUser();

        List<GroupWithActivityCount> groupWithActivityCounts = groupActivityRepository.getGroupsOrderedByActivityCount(getDateToTrackActivityFrom());
        List<GroupPageGroupVM> groupVMs = groupWithActivityCounts.stream()
             .map(group -> GroupPageGroupVM.builder()
                                           .groupId(group.getGroupId())
                                           .groupName(group.getGroupName())
                                           .description(group.getDescription())
                                           .imageUrl(group.getImageUrl())
                                           .activityCount(group.getActivityCount())
                                           .isEditable(EntityPermissionUtil.isAdminOrOwner(currentUser, group.getCreatedBy()))
                                           .build())
             .collect(Collectors.toList());
        return groupVMs;
    }

    private Date getDateToTrackActivityFrom(){
        return Date.from(Instant.now().minus(3L, ChronoUnit.DAYS));
    }

    /**
     *
     * @param groupValues
     * @param groupImage
     * @return ID of created group
     */
    @PostMapping(value = "/create", consumes = {"multipart/form-data"})
    @Transactional
    public APIResponse<Long> createGroup(
            @RequestPart("groupDetails") @Valid GroupValues groupValues,
            @RequestPart(value = "groupImage", required = false) MultipartFile groupImage
            ){

        if (groupRepository.existsByGroupNameIgnoreCase(groupValues.getGroupName())){
            Map<String, String> errors = new HashMap<>();
            errors.put("groupName", "Name already in use");
            return APIResponse.error(errors);
        }

        Group group = Group.GroupBuilder.aGroup()
                .withGroupName(groupValues.getGroupName())
                .withDescription(groupValues.getDescription())
                .withImageUrl(ImageUploadUtil.uploadValidImage(imageUploadService, Optional.ofNullable(groupImage)).orElse(null))
                .withCreatedBy(authService.getLoggedInUser())
                .withTenantId(authService.getTenantIdForUser())
                .build();
        group = groupRepository.save(group);

        return APIResponse.create(group.getId());
    }

    @PostMapping(value = "/edit", consumes = {"multipart/form-data"})
    @Transactional
    public APIResponse editGroup(
            @RequestPart("editGroupDetails") @Valid EditGroupRequest editRequest,
            @RequestPart(value = "groupImage", required = false) MultipartFile groupImage
    ) throws Exception {
        Optional<Group> group = groupRepository.findById(editRequest.getGroupId());

        if (!group.isPresent() || !EntityPermissionUtil.isAdminOrOwner(authService.getLoggedInUser(), group.get())){
            throw new Exception("User " + authService.getLoggedInUserId() + " does not have permission to edit group " + editRequest.getGroupId());
        }

        String newGroupName = editRequest.getValues().getGroupName();
        if (!newGroupName.equalsIgnoreCase(group.get().getGroupName()) && groupRepository.existsByGroupNameIgnoreCase(newGroupName)){
            Map<String, String> errors = new HashMap<>();
            errors.put("groupName", "Name already in use");
            return APIResponse.error(errors);
        }

        group.get().setGroupName(editRequest.getValues().getGroupName());
        group.get().setDescription(editRequest.getValues().getDescription());

        if (editRequest.isClearingGroupImage()){
            if (StringUtil.hasValue(group.get().getImageUrl())){
                imageUploadService.deleteImage(group.get().getImageUrl());
            }
            group.get().setImageUrl(null);
        }
        else {
           ImageUploadUtil
               .upsertValidImage(imageUploadService, Optional.ofNullable(groupImage), Optional.ofNullable(group.get().getImageUrl()))
               .ifPresent(newImageUrl -> {
                   group.get().setImageUrl(newImageUrl);
               });
        }

        return APIResponse.successful();
    }
}
