package org.ideakat.domain.entities.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.ideakat.domain.entities.TenantAwareEntity;

import javax.persistence.*;

@Entity
@Table(name="users")
public class User extends TenantAwareEntity {

    @Column(name = "email", unique = true, nullable = false, length = MAX_EMAIL_LENGTH)
    private String email;

    @Column(name="name", nullable = false, length = MAX_NAME_LENGTH)
    private String name;

    @Column(name="imageUrl", nullable = true, length = 2048)
    private String imageUrl;

    @Column(name="password", nullable = false, length = MAX_PASS_LENGTH)
    @JsonIgnore
    private String password;

    @Column(name="isConfirmed", nullable = false)
    @JsonIgnore
    private boolean isConfirmed;

    @Column(name="isAdmin", nullable = false)
    @JsonIgnore
    private boolean isAdmin;

    public static final int MIN_EMAIL_LENGTH = 5;
    public static final int MAX_EMAIL_LENGTH = 255;
    public static final int MIN_NAME_LENGTH = 2;
    public static final int MAX_NAME_LENGTH = 255;
    public static final int MIN_PASS_LENGTH = 8;
    public static final int MAX_PASS_LENGTH = 255;

    public static final class UserBuilder {
        private String email;
        private String name;
        private Long tenantId;
        private String imageUrl;
        private String password;
        private boolean isConfirmed = false;
        private boolean isAdmin = false;

        private UserBuilder() {
        }

        public static UserBuilder aUser() {
            return new UserBuilder();
        }

        public UserBuilder withEmail(String email) {
            this.email = email;
            return this;
        }

        public UserBuilder withTenantId(Long tenantId){
            this.tenantId = tenantId;
            return this;
        }

        public UserBuilder withName(String name) {
            this.name = name;
            return this;
        }

        public UserBuilder withPassword(String password) {
            this.password = password;
            return this;
        }

        public UserBuilder withImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public UserBuilder withIsConfirmed(boolean isConfirmed){
            this.isConfirmed = isConfirmed;
            return this;
        }

        public UserBuilder withIsAdmin(boolean isAdmin){
            this.isAdmin = isAdmin;
            return this;
        }

        public User build() {
            User user = new User();
            user.name = this.name;
            user.setTenantId(tenantId);
            user.email = this.email;
            user.imageUrl = this.imageUrl;
            user.password = this.password;
            user.isConfirmed = this.isConfirmed;
            user.isAdmin = this.isAdmin;
            return user;
        }
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getPassword() {
        return password;
    }

    public boolean isConfirmed() {
        return isConfirmed;
    }

    public void setConfirmed(boolean confirmed) {
        isConfirmed = confirmed;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
