package org.ideakat.domain.entities.user;

import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.Table;

@Entity
@Table(
    name = "inviteEmailConfirmation",
    indexes = {
        @Index(name = "invite_confirmation_email_index", columnList = "email", unique = false)
    }
)
public class InviteEmailConfirmation extends UserEmailConfirmation {
}
