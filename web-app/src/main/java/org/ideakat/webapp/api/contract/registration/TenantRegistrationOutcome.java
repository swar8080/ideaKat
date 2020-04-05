package org.ideakat.webapp.api.contract.registration;

import lombok.Data;
import org.ideakat.domain.entities.Tenant;
import org.ideakat.domain.entities.user.AdminEmailConfirmation;
import org.ideakat.domain.entities.user.User;

import java.util.HashMap;
import java.util.Map;

@Data
public final class TenantRegistrationOutcome {
    private Tenant tenant;
    private User tenantAdmin;
    private AdminEmailConfirmation emailConfirmation;
    private Map<String, String> errors = new HashMap<>();
}
