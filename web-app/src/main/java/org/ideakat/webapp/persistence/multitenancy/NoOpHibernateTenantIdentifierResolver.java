package org.ideakat.webapp.persistence.multitenancy;

import org.hibernate.context.spi.CurrentTenantIdentifierResolver;

public class NoOpHibernateTenantIdentifierResolver implements CurrentTenantIdentifierResolver {
    @Override
    public String resolveCurrentTenantIdentifier() {
        return "";
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        return false;
    }
}
