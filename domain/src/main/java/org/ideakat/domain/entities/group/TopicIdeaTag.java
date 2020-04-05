package org.ideakat.domain.entities.group;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.ideakat.domain.entities.TenantAwareEntity;

import javax.persistence.*;

@Entity
@Table(name = "topicIdeaTag", uniqueConstraints = {
   @UniqueConstraint(columnNames = {"topicIdea", "label"})
})
public class TopicIdeaTag extends TenantAwareEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topicIdea", nullable = false, foreignKey = @ForeignKey(name = "topicideatag_topicidea_fk"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private TopicIdea topicIdea;

    @Column(name = "label", nullable = false, length = MAX_LABEL_LENGTH)
    private String label;

    public static final int MAX_LABEL_LENGTH = 30;

    public String getLabel() {
        return label;
    }

    public static final class Builder {
        private String label;
        private TopicIdea topicIdea;
        private Long tenantId;

        private Builder() {
        }

        public static Builder aTopicIdeaTag() {
            return new Builder();
        }

        public Builder withTopicIdea(TopicIdea topicIdea){
            this.topicIdea = topicIdea;
            return this;
        }

        public Builder withLabel(String label) {
            this.label = label;
            return this;
        }

        public Builder withTenantId(Long tenantId){
            this.tenantId = tenantId;
            return this;
        }

        public TopicIdeaTag build() {
            TopicIdeaTag topicIdeaTag = new TopicIdeaTag();
            topicIdeaTag.label = this.label;
            topicIdeaTag.topicIdea = this.topicIdea;
            topicIdeaTag.setTenantId(tenantId);
            return topicIdeaTag;
        }
    }
}
