package org.ideakat.domain.entities.user;

import javax.persistence.*;

@Entity
@Table(
    name = "adminEmailConfirmation",
    indexes = {
        @Index(name = "admin_confirmation_email_index", columnList = "email", unique = false)
    }
)
public class AdminEmailConfirmation extends UserEmailConfirmation {

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private User admin;

    public User getAdmin() {
        return admin;
    }

    public void setAdmin(User admin) {
        this.admin = admin;
    }
}
