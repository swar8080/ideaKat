package org.ideakat.webapp.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.ideakat.domain.entities.user.PasswordResetEmailConfirmation;
import org.ideakat.domain.entities.user.User;
import org.ideakat.domain.repositories.user.PasswordResetEmailConfirmationRepository;
import org.ideakat.domain.repositories.user.UserRepository;
import org.ideakat.webapp.auth.configuration.Routes;

import java.util.Optional;

@Service
public class PasswordResetEmailService {

    @Autowired
    private CommonEmailConfirmationService commonEmailConfirmationService;

    @Autowired
    private PasswordResetEmailConfirmationRepository passwordResetEmailConfirmationRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${ideakat.email.confirmationExpirySeconds.passwordReset}")
    private Long passwordResetEmailExpirySeconds;

    @Transactional
    public void sendPasswordResetEmail(String email){
        User user = userRepository.findOneByEmailIgnoreCase(email).get();
        PasswordResetEmailConfirmation confirmation = new PasswordResetEmailConfirmation();
        confirmation.setUser(user);
        confirmation.setTenantId(user.getTenantId());
        confirmation.setEmail(email);
        confirmation.setValid(true);
        passwordResetEmailConfirmationRepository.save(confirmation);

        String subject = "ideaKat Password Reset Request";
        String resetUrl = commonEmailConfirmationService.confirmationUrl(confirmation, Routes.UI_PASSWORD_RESET_ROUTE);
        String message = String.format(
            "<div>A password reset has been requested for your account. <a href='%s' target='_blank'>Click here</a> to change your password.</div>",
            resetUrl
        );
        commonEmailConfirmationService.sendEmail(email, subject, message);
    }

    public Optional<PasswordResetEmailConfirmation> getValidEmailConfirmationByCode(String confirmationCode){
        return commonEmailConfirmationService.getValidEmailConfirmationByCode(confirmationCode, passwordResetEmailExpirySeconds, passwordResetEmailConfirmationRepository);
    }
}
