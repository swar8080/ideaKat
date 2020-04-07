package org.ideakat.domain.entities.group;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.ideakat.domain.entities.HasOwner;
import org.ideakat.domain.entities.TenantAwareEntity;
import org.ideakat.domain.entities.user.User;

import javax.persistence.*;

@Entity
@Table(name = Topic.TABLE_NAME)
public class Topic extends TenantAwareEntity implements HasOwner {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="groupId", nullable = false)
    @JsonIgnore
    private Group group;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="author", nullable = false)
    private User author;

    @Column(name = "summary", nullable = false, length = SUMMARY_MAX_LENGTH)
    private String summary;

    @Column(name = "description", nullable = false, length = DESCRIPTION_MAX_LENGTH)
    private String description;

    @Column(name = "pinned", nullable = false)
    private boolean pinned;

    @Column(name = "ideaContributionInstructions", nullable = false, length = IDEA_CONTRIBUTION_INSTRUCTIONS_MAX_LENGTH)
    private String ideaContributionInstructions;

    @JsonProperty("groupId")
    public Long getGroupId(){
        return group.getId();
    }

    public static final String TABLE_NAME = "topic";
    public static final int SUMMARY_MAX_LENGTH = 200;
    public static final int DESCRIPTION_MAX_LENGTH = 1000;
    public static final int IDEA_CONTRIBUTION_INSTRUCTIONS_MAX_LENGTH = 400;

    @Override
    @JsonIgnore
    public Long getOwnerUserId() {
        return author.getId();
    }

    public static final class TopicBuilder {
        private Group group;
        private User author;
        private String summary;
        private String description;
        private boolean pinned;
        private String ideaContributionInstructions;
        private Long tenantId;

        private TopicBuilder() {
        }

        public static TopicBuilder aTopic() {
            return new TopicBuilder();
        }

        public TopicBuilder withGroup(Group group) {
            this.group = group;
            return this;
        }

        public TopicBuilder withAuthor(User author) {
            this.author = author;
            return this;
        }

        public TopicBuilder withSummary(String summary) {
            this.summary = summary;
            return this;
        }

        public TopicBuilder withDescription(String description) {
            this.description = description;
            return this;
        }

        public TopicBuilder withPinned(boolean pinned) {
            this.pinned = pinned;
            return this;
        }

        public TopicBuilder withIdeaContributionInstructions(String ideaContributionInstructions) {
            this.ideaContributionInstructions = ideaContributionInstructions;
            return this;
        }

        public TopicBuilder withTenantId(Long tenantId) {
            this.tenantId = tenantId;
            return this;
        }

        public Topic build() {
            Topic topic = new Topic();
            topic.pinned = this.pinned;
            topic.ideaContributionInstructions = this.ideaContributionInstructions;
            topic.summary = this.summary;
            topic.author = this.author;
            topic.group = this.group;
            topic.description = this.description;
            topic.setTenantId(this.tenantId);
            return topic;
        }
    }

    public Group getGroup() {
        return group;
    }

    public void setGroup(Group group) {
        this.group = group;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isPinned() {
        return pinned;
    }

    public void setPinned(boolean pinned) {
        this.pinned = pinned;
    }

    public String getIdeaContributionInstructions() {
        return ideaContributionInstructions;
    }

    public void setIdeaContributionInstructions(String ideaContributionInstructions) {
        this.ideaContributionInstructions = ideaContributionInstructions;
    }
}
