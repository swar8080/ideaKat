package org.ideakat.webapp.persistence;

import org.hibernate.context.spi.CurrentTenantIdentifierResolver;

public class TestTenantIdentifierResolver implements CurrentTenantIdentifierResolver {
    @Override
    public String resolveCurrentTenantIdentifier() {
        return null;
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        return false;
    }
}
