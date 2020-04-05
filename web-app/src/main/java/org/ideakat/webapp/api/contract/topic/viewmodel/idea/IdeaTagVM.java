package org.ideakat.webapp.api.contract.topic.viewmodel.idea;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.ideakat.domain.entities.group.TopicIdeaTag;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class IdeaTagVM {

    @NotBlank
    @Size(max = TopicIdeaTag.MAX_LABEL_LENGTH)
    private String label;

    public IdeaTagVM(String label){
        this.label = normalize(label);
    }

    public static IdeaTagVM fromTopicIdeaTag(TopicIdeaTag tag){
        return new IdeaTagVM(tag.getLabel());
    }

    public String normalize(){
        return normalize(label);
    }

    public static List<String> getNormalizedLabels(List<IdeaTagVM> tags){
        if (tags == null){
            return new ArrayList<>();
        }

        return tags.stream()
            .map(IdeaTagVM::normalize)
            .collect(Collectors.toList());
    }

    private static String normalize(String label){
        if (label != null){
            return label.toLowerCase().trim();
        }
        return null;
    }
}
