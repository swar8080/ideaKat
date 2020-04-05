package org.ideakat.domain.listeners;

import org.ideakat.domain.entities.TenantAwareEntity;

public interface TenantAwareEntityListener {
    void prePersist(TenantAwareEntity entity);
}
