package org.ideakat.webapp.api.contract.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import org.ideakat.domain.entities.user.User;

@Data
@Builder
public class AuthenticationStatus {
    @JsonProperty("isLoggedIn")
    private boolean isLoggedIn;

    private User user;

    @JsonProperty("isAdmin")
    private boolean isAdmin;
}
