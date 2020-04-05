package org.ideakat.webapp.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.ideakat.domain.entities.user.UserEmailConfirmation;
import org.ideakat.domain.repositories.user.CommonEmailConfirmationRepository;

import java.util.Optional;

@Service
public class CommonEmailConfirmationService {

    @Autowired
    private EmailSendingService emailSendingService;

    @Value("${ideakat.publicUrl}")
    private String publicUrl;

    @Value("${ideakat.email.fromAddress}")
    private String fromAddress;

    @Value("${ideakat.email.confirmationExpirySeconds.default}")
    private Long defaultConfirmationExpirySeconds;

    public void sendEmail(String toAddress, String subject, String message){
        sendEmail(toAddress, subject, message, fromAddress);
    }

    public void sendEmail(String toAddress, String subject, String message, String fromAddress){
        emailSendingService.sendEmailAsync(toAddress, subject, message, fromAddress);
    }

    public String confirmationUrl(UserEmailConfirmation confirmationEmail, String confirmationUrlPath){
        String url = String.format("%s%s/%s",
           publicUrl,
           confirmationUrlPath,
           confirmationEmail.getConfirmationCode()
        );
        return url;
    }

    public <EC extends UserEmailConfirmation> Optional<EC> getValidEmailConfirmationByCode(String confirmationCode, CommonEmailConfirmationRepository<EC> repository){
        return getValidEmailConfirmationByCode(confirmationCode, defaultConfirmationExpirySeconds, repository);
    }

    public <EC extends UserEmailConfirmation> Optional<EC> getValidEmailConfirmationByCode(String confirmationCode, Long expirationTimeInSeconds, CommonEmailConfirmationRepository<EC> repository){
        Optional<EC> confirmation = repository.findOneByConfirmationCodeAndValidTrue(confirmationCode);
        if (confirmation.isPresent()){
            if (isConfirmationStillValid(confirmation.get(), expirationTimeInSeconds)) {
                return confirmation;
            }
        }
        return Optional.empty();
    }

    private boolean isConfirmationStillValid(UserEmailConfirmation confirmation, Long expiryTimeInSeconds){
        Long createdTimeMS = confirmation.getCreateDate().getTime();
        Long currentTimeMS = System.currentTimeMillis();
        Long elapsedInSeconds = (currentTimeMS - createdTimeMS) / 1000;
        return elapsedInSeconds <= expiryTimeInSeconds;
    }
}
