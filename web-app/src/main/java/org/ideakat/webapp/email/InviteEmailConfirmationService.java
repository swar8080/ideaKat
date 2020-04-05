package org.ideakat.webapp.email;

import org.ideakat.webapp.auth.configuration.Routes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.HtmlUtils;
import org.ideakat.domain.entities.Tenant;
import org.ideakat.domain.entities.user.InviteEmailConfirmation;
import org.ideakat.domain.entities.user.User;
import org.ideakat.domain.repositories.TenantRepository;
import org.ideakat.domain.repositories.user.InviteEmailConfirmationRepository;
import org.ideakat.webapp.api.contract.registration.request.InviteUserRequest;

import java.util.Optional;

@Service
public class InviteEmailConfirmationService {

    @Autowired
    private CommonEmailConfirmationService commonEmailConfirmationService;

    @Autowired
    private InviteEmailConfirmationRepository inviteRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Transactional
    public InviteEmailConfirmation inviteUserToTeam(User invitedBy, InviteUserRequest inviteDetailsVM){
        Tenant invitedTo = tenantRepository.findById(invitedBy.getTenantId()).get();

        InviteEmailConfirmation confirmation = new InviteEmailConfirmation();
        confirmation.setTenantId(invitedBy.getTenantId());
        confirmation.setEmail(inviteDetailsVM.getUserEmail());
        confirmation.setValid(true);
        confirmation = inviteRepository.save(confirmation);

        String subject = String.format("%s has invited you to ideaKat", invitedBy.getName());
        Object[] messageInputs = new Object[]{
            HtmlUtils.htmlEscape(invitedBy.getName()),
            HtmlUtils.htmlEscape(invitedTo.getTenantName()),
            commonEmailConfirmationService.confirmationUrl(confirmation, Routes.INVITE_REGISTRATON_CONFIRMATION)
        };
        String message = String.format(
            "<div>%s has invited you to join %s on ideaKat. " +
            "<a href='%s' target='_blank'>Click here</a> to get started.</div>",
            messageInputs
        );
        commonEmailConfirmationService.sendEmail(inviteDetailsVM.getUserEmail(), subject, message);

        return confirmation;
    }

    public boolean isValidConfirmationCode(String confirmationCode){
        return getValidConfirmationForCode(confirmationCode).isPresent();
    }

    public Optional<InviteEmailConfirmation> getValidConfirmationForCode(String confirmationCode){
        return commonEmailConfirmationService.getValidEmailConfirmationByCode(confirmationCode, inviteRepository);
    }
}
