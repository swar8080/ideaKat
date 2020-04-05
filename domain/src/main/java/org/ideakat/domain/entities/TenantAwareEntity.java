package org.ideakat.domain.entities;

import org.ideakat.domain.listeners.TenantAwareEntityListenerRegistry;

import javax.persistence.*;

@MappedSuperclass
@EntityListeners(TenantAwareEntityListenerRegistry.class)
public abstract class TenantAwareEntity extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name="tenantId", nullable = false, insertable = false, updatable = false)
    private Tenant tenant;

    @Column(name = "tenantId", nullable = false)
    private Long tenantId;

    public Tenant getTenant() {
        return tenant;
    }

    protected void setTenant(Tenant tenant) {
        this.tenant = tenant;
    }

    public Long getTenantId() {
        return tenantId;
    }

    public void setTenantId(Long tenantId) {
        this.tenantId = tenantId;
    }
}
