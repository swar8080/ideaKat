package org.ideakat.domain.entities.group;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.ideakat.domain.entities.HasOwner;
import org.ideakat.domain.entities.TenantAwareEntity;
import org.ideakat.domain.entities.user.User;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="groups", uniqueConstraints = {
    @UniqueConstraint(
        name="unique_group_name_per_tenant",
        columnNames={"tenantId", "groupName"}
    )
})
public class Group extends TenantAwareEntity implements HasOwner {

    @Column(name = "groupName", nullable = false, length = GROUP_NAME_LENGTH_LIMIT)
    private String groupName;

    @Column(name = "description", nullable = true, length = GROUP_DESCRIPTION_LENGTH)
    private String description;

    @Column(name="imageUrl", nullable = true, length = 2048)
    private String imageUrl;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "createdBy", nullable = false)
    private User createdBy;

    @OneToMany(orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "groupId")
    @JsonIgnore
    private List<Topic> topics = new ArrayList<>();

    public static final int GROUP_NAME_MIN_LENGTH = 2;
    public static final int GROUP_NAME_LENGTH_LIMIT = 50;
    public static final int GROUP_DESCRIPTION_LENGTH = 150;

    @Override
    @JsonIgnore
    public Long getOwnerUserId() {
        return createdBy.getId();
    }

    public static final class GroupBuilder {
        private String groupName;
        private String description;
        private User createdBy;
        private String imageUrl;
        private Long tenantId;

        private GroupBuilder() {
        }

        public static GroupBuilder aGroup() {
            return new GroupBuilder();
        }

        public GroupBuilder withGroupName(String groupName) {
            this.groupName = groupName;
            return this;
        }

        public GroupBuilder withDescription(String description){
            this.description = description;
            return this;
        }

        public GroupBuilder withTenantId(Long tenantId){
            this.tenantId = tenantId;
            return this;
        }

        public GroupBuilder withImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public GroupBuilder withCreatedBy(User user){
            this.createdBy = user;
            return this;
        }

        public Group build() {
            Group group = new Group();
            group.imageUrl = this.imageUrl;
            group.groupName = this.groupName;
            group.description = this.description;
            group.createdBy = this.createdBy;
            group.setTenantId(tenantId);
            return group;
        }
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public List<Topic> getTopics() {
        return topics;
    }

    public void setTopics(List<Topic> topics) {
        this.topics = topics;
    }
}
