package org.ideakat.webapp.persistence.multitenancy;

import org.springframework.stereotype.Component;
import org.ideakat.domain.entities.TenantAwareEntity;
import org.ideakat.domain.listeners.TenantAwareEntityListener;
import org.ideakat.webapp.auth.TenantContextHolder;

import java.util.Optional;

@Component
public class TenantAwareEntityPersistenceListener implements TenantAwareEntityListener {

    @Override
    public void prePersist(TenantAwareEntity entity) {
        if (entity.getTenantId() == null){
            Optional<Long> tenantId = TenantContextHolder.getLoggedInUsersTenantIdentifier();
            tenantId.ifPresent(entity::setTenantId);
        }
    }
}
