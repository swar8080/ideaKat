package org.ideakat.webapp.api.contract.registration.request;

import lombok.Data;
import org.ideakat.webapp.api.contract.registration.OrganizationRegistrationDetails;
import org.ideakat.webapp.api.contract.registration.UserProfileRegistrationDetails;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@Data
public class TeamRegistrationRequest {

    @Valid
    @NotNull
    private OrganizationRegistrationDetails organizationDetails;

    @Valid
    @NotNull
    private UserProfileRegistrationDetails tenantAdminDetails;
}
