package org.ideakat.domain.entities.user;

import javax.persistence.*;

@Entity
@Table(
    name = "passwordResetEmailConfirmation",
    indexes = {
            @Index(name = "password_reset_email_index", columnList = "email", unique = false)
    }
)
public class PasswordResetEmailConfirmation extends UserEmailConfirmation {

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private User user;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
