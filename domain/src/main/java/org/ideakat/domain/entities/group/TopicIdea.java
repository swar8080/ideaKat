package org.ideakat.domain.entities.group;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.ideakat.domain.entities.HasOwner;
import org.ideakat.domain.entities.TenantAwareEntity;
import org.ideakat.domain.entities.user.User;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name="topicIdea")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TopicIdea extends TenantAwareEntity implements HasOwner {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic", nullable = false, foreignKey = @ForeignKey(name = "topicidea_topic_fk"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Topic topic;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author", nullable = false)
    private User author;

    @Column(nullable = false, length = IDEA_SUMMARY_MAX_LENGTH)
    private String summary;

    @Column(nullable = true, length = IDEA_MAX_LENGTH)
    private String description;

    @Column(nullable = false)
    private COLOUR colour;

    @OneToMany(mappedBy = "topicIdea", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TopicIdeaTag> tags;

    public enum COLOUR {
        Yellow,
        Blue,
        Orange,
        Green;
    }

    public static final int IDEA_SUMMARY_MAX_LENGTH = 60;
    public static final int IDEA_MAX_LENGTH = 1000;

    @Override
    @JsonIgnore
    public Long getOwnerUserId() {
        return author.getId();
    }
}
