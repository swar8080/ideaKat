package org.ideakat.webapp.api.users;

import org.ideakat.domain.entities.user.User;
import org.ideakat.domain.repositories.user.UserRepository;
import org.ideakat.webapp.api.APIResponse;
import org.ideakat.webapp.api.contract.user.EditProfileRequest;
import org.ideakat.webapp.api.contract.user.UserProfileVM;
import org.ideakat.webapp.auth.AuthService;
import org.ideakat.webapp.auth.configuration.Routes;
import org.ideakat.webapp.persistence.service.images.ImageUploadService;
import org.ideakat.webapp.persistence.service.images.ImageUploadUtil;
import org.ideakat.webapp.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.Optional;

@RestController
public class UserController {

    @Autowired
    private AuthService authService;

    @Autowired
    private ImageUploadService imageUploadService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping(Routes.USER_GET_PROFILE)
    public UserProfileVM getUserProfile(){
        Long userId = authService.getLoggedInUserId();
        User updatedUserProfile = userRepository.findById(userId).get();

        UserProfileVM userProfile = UserProfileVM.builder()
                .displayName(updatedUserProfile.getName())
                .imageUrl(updatedUserProfile.getImageUrl())
                .build();
        return userProfile;
    }

    @PostMapping(value = Routes.USER_EDIT_PROFILE, consumes = {"multipart/form-data"})
    @Transactional
    public APIResponse editProfile(
            @RequestPart("editProfileDetails") @Valid EditProfileRequest editProfileRequest,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage
    ){
        Long loggedInUserId = authService.getLoggedInUserId();
        UserProfileVM existingProfileData = getUserProfile();

        String newImageUrl;
        if (editProfileRequest.isClearingProfileImage()){
            newImageUrl = null;
            if (StringUtil.hasValue(existingProfileData.getImageUrl())){
                imageUploadService.deleteImage(existingProfileData.getImageUrl());
            }
        }
        else {

            newImageUrl = ImageUploadUtil.upsertValidImage(
                    imageUploadService,
                    Optional.ofNullable(profileImage),
                    Optional.ofNullable(existingProfileData.getImageUrl())
            ).orElse(null);
        }

        userRepository.updateUserProfile(
                editProfileRequest.getDisplayName(),
                newImageUrl,
                loggedInUserId
        );

        return APIResponse.successful();
    }
}
