package org.ideakat.webapp.auth;

import org.passay.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.ideakat.domain.entities.user.PasswordResetEmailConfirmation;
import org.ideakat.domain.entities.user.User;
import org.ideakat.domain.entities.user.AdminEmailConfirmation;
import org.ideakat.domain.repositories.TenantRepository;
import org.ideakat.domain.repositories.user.AdminEmailConfirmationRepository;
import org.ideakat.domain.repositories.user.PasswordResetEmailConfirmationRepository;
import org.ideakat.domain.repositories.user.UserRepository;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private AdminEmailConfirmationRepository adminEmailConfirmationRepository;

    @Autowired
    private PasswordResetEmailConfirmationRepository passwordResetEmailConfirmationRepository;

    final static String PASSWORD_LENGTH_MSG = String.format(
        "Must be between %d and %d characters",
        User.MIN_PASS_LENGTH, User.MAX_PASS_LENGTH
    );
    final static String PASSWORD_CHARACTER_MSG = "Must contain at least 1 upper case, digit, and special character";

    public String encryptPassword(String password){
        return PasswordEncoderFactories.createDelegatingPasswordEncoder().encode(password);
    }

    public Optional<String> getPasswordStrengthValidatorError(String password){
        PasswordData passwordData = new PasswordData(password);

        LengthRule lengthRule = new LengthRule(User.MIN_PASS_LENGTH, User.MAX_PASS_LENGTH);
        RuleResult lengthValidation = lengthRule.validate(passwordData);
        if (!lengthValidation.isValid()){
            return Optional.of(PASSWORD_LENGTH_MSG);
        }

        PasswordValidator characterValidator = new PasswordValidator(
            new CharacterRule(EnglishCharacterData.UpperCase, 1),
            new CharacterRule(EnglishCharacterData.Digit, 1),
            new CharacterRule(EnglishCharacterData.Special, 1)
        );
        RuleResult characterValidation = characterValidator.validate(passwordData);
        if (!characterValidation.isValid()){
            return Optional.of(PASSWORD_CHARACTER_MSG);
        }

        return Optional.empty();
    }

    @Transactional
    public void confirmAdminEmail(AdminEmailConfirmation confirmation){
        User userToConfirm = userRepository.findById(confirmation.getAdmin().getId()).get();
        userToConfirm.setConfirmed(true);
        userRepository.save(userToConfirm);
        adminEmailConfirmationRepository.deleteByEmail(confirmation.getEmail());
    }

    public boolean canResetPassword(String email){
        return userRepository.findOneByEmailIgnoreCase(email).isPresent();
    }

    @Transactional
    public void resetUserPassword(PasswordResetEmailConfirmation emailConfirmation, String newPassword){
        User user = emailConfirmation.getUser();
        user.setPassword(encryptPassword(newPassword));
        user.setConfirmed(true);
        userRepository.save(user);

        passwordResetEmailConfirmationRepository.deleteByEmail(emailConfirmation.getEmail());
    }
}
