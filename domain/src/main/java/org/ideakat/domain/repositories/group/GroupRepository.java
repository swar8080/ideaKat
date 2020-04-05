package org.ideakat.domain.repositories.group;

import org.ideakat.domain.entities.group.Group;
import org.springframework.data.repository.CrudRepository;

public interface GroupRepository extends CrudRepository<Group, Long> {
    boolean existsByGroupNameIgnoreCase(String groupName);
}
