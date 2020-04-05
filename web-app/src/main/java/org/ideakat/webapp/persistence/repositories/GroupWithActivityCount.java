package org.ideakat.webapp.persistence.repositories;

public interface GroupWithActivityCount {
    Long getGroupId();
    String getGroupName();
    String getDescription();
    String getImageUrl();
    Long getCreatedBy();
    Long getActivityCount();
}
