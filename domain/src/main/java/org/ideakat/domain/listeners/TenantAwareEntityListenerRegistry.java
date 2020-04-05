package org.ideakat.domain.listeners;

import org.ideakat.domain.entities.TenantAwareEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.PrePersist;
import java.util.ArrayList;
import java.util.List;

@Service
public class TenantAwareEntityListenerRegistry {

    private static TenantAwareEntityListenerRegistry INSTANCE;

    private List<TenantAwareEntityListener> listeners = new ArrayList<>();

    @PrePersist
    public void delegatePrepersist(TenantAwareEntity entity){
        if (INSTANCE != null){
            INSTANCE.listeners.forEach(listener -> listener.prePersist(entity));
        }
    }

    @Autowired(required = false)
    private void setListeners(List<TenantAwareEntityListener> listeners){
        this.listeners = listeners;
        INSTANCE = this;
    }
}
