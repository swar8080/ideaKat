package org.ideakat.domain.repositories;

import org.ideakat.domain.entities.Tenant;
import org.springframework.data.repository.CrudRepository;

public interface TenantRepository extends CrudRepository<Tenant, Long> {
    boolean existsByTenantNameIgnoreCase(String tenantName);
}
