package org.ideakat.webapp.api.contract.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileVM {
    private String displayName;
    private String imageUrl;
}
