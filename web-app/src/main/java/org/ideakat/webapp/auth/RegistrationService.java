package org.ideakat.webapp.auth;

import org.ideakat.domain.entities.Tenant;
import org.ideakat.domain.entities.user.AdminEmailConfirmation;
import org.ideakat.domain.entities.user.InviteEmailConfirmation;
import org.ideakat.domain.entities.user.User;
import org.ideakat.domain.repositories.TenantRepository;
import org.ideakat.domain.repositories.user.AdminEmailConfirmationRepository;
import org.ideakat.domain.repositories.user.InviteEmailConfirmationRepository;
import org.ideakat.domain.repositories.user.UserRepository;
import org.ideakat.webapp.api.contract.registration.OrganizationRegistrationDetails;
import org.ideakat.webapp.api.contract.registration.TenantRegistrationOutcome;
import org.ideakat.webapp.api.contract.registration.UserProfileRegistrationDetails;
import org.ideakat.webapp.api.contract.registration.request.InviteUserRequest;
import org.ideakat.webapp.api.contract.registration.request.InvitedUserRegistrationRequest;
import org.ideakat.webapp.api.contract.registration.request.TeamRegistrationRequest;
import org.ideakat.webapp.persistence.service.images.ImageUploadService;
import org.ideakat.webapp.persistence.service.images.ImageUploadUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class RegistrationService {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ImageUploadService imageUploadService;

    @Autowired
    private AdminEmailConfirmationRepository adminEmailConfirmationRepository;

    @Autowired
    private InviteEmailConfirmationRepository inviteEmailConfirmationRepository;

    private Map<String, String> validateRegistration(TeamRegistrationRequest request) {
        Map<String, String> errors = validateOrganizationDetails(request.getOrganizationDetails());
        errors.putAll(validateUserProfileDetails(request.getTenantAdminDetails()));

        return errors;
    }

    public Map<String, String> validateOrganizationDetails(OrganizationRegistrationDetails details) {
        Map<String, String> errors = new HashMap<>();
        if (tenantRepository.existsByTenantNameIgnoreCase(details.getOrganizationName())) {
            errors.put("organizationName", "A team with that name already exists");
        }

        getNewUserEmailValidationError(details.getAdminEmail()).ifPresent(errorMessage ->
                errors.put("adminEmail", errorMessage)
        );

        return errors;
    }

    public Optional<String> getNewUserEmailValidationError(String email) {
        return Optional.ofNullable(hasUserWithEmail(email) ? "Email address already in use" : null);
    }

    public boolean hasUserWithEmail(String email) {
        return userRepository.existsByEmailIgnoreCase(email);
    }

    public Map<String, String> validateUserProfileDetails(UserProfileRegistrationDetails details) {
        Map<String, String> errors = new HashMap<>();

        userService.getPasswordStrengthValidatorError(details.getPassword())
                   .ifPresent(error -> {
                       errors.put("password", error);
                   });

        return errors;
    }

    @Transactional
    public TenantRegistrationOutcome registerTenant(TeamRegistrationRequest registration, Optional<MultipartFile> profileImage) {
        TenantRegistrationOutcome outcome = new TenantRegistrationOutcome();
        outcome.setErrors(validateRegistration(registration));

        if (outcome.getErrors()
                   .isEmpty()) {
            Tenant newTenant = Tenant.builder()
                                     .tenantName(registration.getOrganizationDetails()
                                                             .getOrganizationName())
                                     .build();
            newTenant = tenantRepository.save(newTenant);

            UserProfileRegistrationDetails userDetails = registration.getTenantAdminDetails();
            String encryptedPassword = userService.encryptPassword(userDetails.getPassword());

            Optional<String> profileImageUrl = ImageUploadUtil.uploadValidImage(imageUploadService, profileImage);
            User tenantAdmin = User.UserBuilder.aUser()
                                               .withTenantId(newTenant.getId())
                                               .withEmail(registration.getOrganizationDetails()
                                                                      .getAdminEmail())
                                               .withName(userDetails.getFullName())
                                               .withImageUrl(profileImageUrl.orElse(null))
                                               .withPassword(encryptedPassword)
                                               .withIsAdmin(true)
                                               .withIsConfirmed(false)
                                               .build();
            tenantAdmin = userRepository.save(tenantAdmin);

            AdminEmailConfirmation confirmationEmail = new AdminEmailConfirmation();
            confirmationEmail.setEmail(registration.getOrganizationDetails()
                                                   .getAdminEmail());
            confirmationEmail.setAdmin(tenantAdmin);
            confirmationEmail.setTenantId(newTenant.getId());
            confirmationEmail.setValid(true);
            confirmationEmail = adminEmailConfirmationRepository.save(confirmationEmail);

            outcome.setTenant(newTenant);
            outcome.setTenantAdmin(tenantAdmin);
            outcome.setEmailConfirmation(confirmationEmail);
        }

        return outcome;
    }

    public Map<String, String> validateUserInvite(InviteUserRequest inviteDetails) {
        Map<String, String> errors = new HashMap<>();
        getNewUserEmailValidationError(inviteDetails.getUserEmail()).ifPresent(errorMsg ->
                errors.put("userEmail", errorMsg)
        );
        return errors;
    }

    @Transactional
    public User completeInviteRegistration(InvitedUserRegistrationRequest request, InviteEmailConfirmation confirmation, Optional<MultipartFile> profileImage) {
        String encryptedPassword = userService.encryptPassword(request.getUserProfileDetails().getPassword());

        Optional<String> profileImageUrl = ImageUploadUtil.uploadValidImage(imageUploadService, profileImage);
        User invitedUser = User.UserBuilder.aUser()
                                           .withEmail(confirmation.getEmail())
                                           .withName(request.getUserProfileDetails()
                                                            .getFullName())
                                           .withImageUrl(profileImageUrl.orElse(null))
                                           .withPassword(encryptedPassword)
                                           .withTenantId(confirmation.getTenantId())
                                           .withIsConfirmed(true)
                                           .withIsAdmin(false)
                                           .build();
        invitedUser = userRepository.save(invitedUser);

        inviteEmailConfirmationRepository.deleteByEmail(confirmation.getEmail());

        return invitedUser;
    }
}
