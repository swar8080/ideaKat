package org.ideakat.domain.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "tenant")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Tenant extends BaseEntity {

    public static final int MIN_TENANT_NAME_LENGTH = 5;
    public static final int MAX_TENANT_NAME_LENGTH = 255;

    @Column(name = "tenantName", nullable = false, length = MAX_TENANT_NAME_LENGTH)
    private String tenantName;

    public String getTenantName() {
        return tenantName;
    }

    public void setTenantName(String tenantName) {
        this.tenantName = tenantName;
    }
}
