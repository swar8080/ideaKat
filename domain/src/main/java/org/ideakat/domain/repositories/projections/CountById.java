package org.ideakat.domain.repositories.projections;

import org.ideakat.domain.entities.BaseEntity;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public interface CountById {
    Long getEntityId();
    Long getCnt();

    static <E extends BaseEntity> Map<Long, Long> toMap(Collection<E> entities, List<CountById> countsById){
        Map<Long, Long> nonZeroCountsById = countsById.stream()
            .collect(Collectors.toMap(
                CountById::getEntityId,
                CountById::getCnt
            ));

        return entities.stream()
            .map(BaseEntity::getId)
            .collect(Collectors.toMap(
                Function.identity(),
                id -> nonZeroCountsById.getOrDefault(id, 0L),
                (dupe1, dupe2) -> dupe1
            ));
    }
}
