package org.ideakat.domain.entities.user;

import org.ideakat.domain.entities.TenantAwareEntity;

import javax.persistence.*;
import java.util.UUID;

@MappedSuperclass
public abstract class UserEmailConfirmation extends TenantAwareEntity {

    @Column(name = "email", nullable = false, length = User.MAX_EMAIL_LENGTH)
    private String email;

    @Column(nullable = false, unique = true, updatable = false, length = CONFIRMATION_CODE_LENGTH)
    private final String confirmationCode = UUID.randomUUID().toString();

    @Column(nullable = false)
    private boolean valid = true;

    public static final int CONFIRMATION_CODE_LENGTH = 36;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getConfirmationCode() {
        return confirmationCode;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }
}
