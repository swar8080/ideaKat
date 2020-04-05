package org.ideakat.webapp.api.contract.registration;

import lombok.Data;
import org.ideakat.domain.entities.Tenant;
import org.ideakat.domain.entities.user.User;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class OrganizationRegistrationDetails {
    @NotBlank
    @Size(min = Tenant.MIN_TENANT_NAME_LENGTH, max = Tenant.MAX_TENANT_NAME_LENGTH)
    private String organizationName;

    @NotBlank
    @Email
    @Size(min = User.MIN_EMAIL_LENGTH, max = User.MAX_EMAIL_LENGTH)
    private String adminEmail;
}
