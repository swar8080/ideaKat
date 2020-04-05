package org.ideakat.webapp.email;

import org.ideakat.webapp.auth.configuration.Routes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.HtmlUtils;
import org.ideakat.domain.entities.Tenant;
import org.ideakat.domain.entities.user.AdminEmailConfirmation;
import org.ideakat.domain.entities.user.User;
import org.ideakat.domain.repositories.TenantRepository;
import org.ideakat.domain.repositories.user.AdminEmailConfirmationRepository;
import org.ideakat.domain.repositories.user.UserRepository;

import java.util.Optional;

@Service
public class AdminEmailConfirmationService {

    @Autowired
    private CommonEmailConfirmationService commonEmailConfirmationService;

    @Autowired
    private AdminEmailConfirmationRepository adminEmailConfirmationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Transactional
    public void sendTenantAdminConfirmationEmail(AdminEmailConfirmation confirmation){
        Tenant tenant = tenantRepository.findById(confirmation.getTenantId()).get();

        String toAddress = confirmation.getEmail();
        String subject = "ideaKat Email Confirmation";
        String confirmationUrl = commonEmailConfirmationService.confirmationUrl(confirmation, Routes.ADMIN_REGISTRATION_CONFIRMATION);
        String safeTenantName = HtmlUtils.htmlEscape(tenant.getTenantName());
        String message = String.format(
            "<div>Team \"%s\" has been created. <a href='%s' target='_blank'>Click here</a> to confirm your account.</div>",
            safeTenantName, confirmationUrl
        );

        commonEmailConfirmationService.sendEmail(toAddress, subject, message);
    }

    @Transactional
    public Optional<AdminEmailConfirmation> getValidAdminRegistrationEmailConfirmation(String confirmationCode){
        return commonEmailConfirmationService.getValidEmailConfirmationByCode(confirmationCode, adminEmailConfirmationRepository);
    }

    @Transactional
    public boolean resendTenantRegistrationConfirmationEmailIfUnverified(String emailAddress){
        Optional<User> unconfirmedAdminWithEmail = userRepository.findOneByEmailIgnoreCaseAndIsAdminTrueAndIsConfirmedFalse(emailAddress);
        return resendAdminConfirmationEmail(unconfirmedAdminWithEmail);
    }

    private boolean resendAdminConfirmationEmail(Optional<User> unconfirmedAdmin){
        if (unconfirmedAdmin.isPresent()){
            User user = unconfirmedAdmin.get();

            AdminEmailConfirmation emailConfirmation = new AdminEmailConfirmation();
            emailConfirmation.setEmail(unconfirmedAdmin.get().getEmail());
            emailConfirmation.setAdmin(unconfirmedAdmin.get());
            emailConfirmation.setTenantId(user.getTenantId());
            emailConfirmation.setValid(true);
            emailConfirmation = adminEmailConfirmationRepository.save(emailConfirmation);

            sendTenantAdminConfirmationEmail(emailConfirmation);
            return true;
        }
        return false;
    }
}
