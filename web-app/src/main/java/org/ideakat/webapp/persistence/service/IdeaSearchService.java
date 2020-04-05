package org.ideakat.webapp.persistence.service;

import org.ideakat.domain.entities.group.Topic_;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.ideakat.domain.entities.user.User_;
import org.ideakat.domain.entities.group.TopicIdea;
import org.ideakat.domain.entities.group.TopicIdeaTag;
import org.ideakat.domain.entities.group.TopicIdeaTag_;
import org.ideakat.domain.entities.group.TopicIdea_;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class IdeaSearchService {

    @Autowired
    private EntityManager entityManager;

    public List<TopicIdea> search(Long topicId, Optional<String> searchTerm, Optional<Long> userId, Optional<TopicIdea.COLOUR> colour, List<String> tags){
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<TopicIdea> cq = cb.createQuery(TopicIdea.class);

        Root<TopicIdea> topicIdea = cq.from(TopicIdea.class);
        cq.select(topicIdea);

        List<Predicate> conditions = new ArrayList<>();

        conditions.add(cb.equal(
            topicIdea.get(TopicIdea_.topic).get(Topic_.ID),
            topicId
        ));

        cq = cq.where(cb.equal(
            topicIdea.get(TopicIdea_.topic).get(Topic_.ID),
            topicId
        ));

        userId.ifPresent(theUserId -> conditions.add(cb.equal(
            topicIdea.get(TopicIdea_.author).get(User_.ID),
            theUserId
        )));

        colour.ifPresent(theColour -> conditions.add(cb.equal(
            topicIdea.get(TopicIdea_.colour),
            theColour
        )));

        if (tags != null && !tags.isEmpty()){
            ListJoin<TopicIdea, TopicIdeaTag> tagsJoin = topicIdea.join(TopicIdea_.tags);
            conditions.add(
                tagsJoin.get(TopicIdeaTag_.label).in(tags)
            );
        }

        Optional<ParameterExpression<String>> searchTermParam = Optional.empty();
        if (searchTerm.isPresent() && searchTerm.get().length() > 0){
            searchTermParam = Optional.of(cb.parameter(String.class));
            conditions.add(
                    cb.or(
                            cb.like(topicIdea.get(TopicIdea_.description), searchTermParam.get()),
                            cb.like(topicIdea.get(TopicIdea_.summary), searchTermParam.get())
                    )
            );
        }

        Predicate[] predicates = conditions.toArray(new Predicate[]{});
        cq.where(cb.and(predicates));
        TypedQuery<TopicIdea> query = entityManager.createQuery(cq);

        searchTermParam.ifPresent(searchParam -> {
            String searchPattern = "%" + searchTerm.get() + "%";
            query.setParameter(searchParam, searchPattern);
        });

        HashSet<Long> seenIdeaIds = new HashSet<>();
        List<TopicIdea> dedupedResults = query.getResultList().stream()
                .filter(idea -> seenIdeaIds.add(idea.getId()))
                .collect(Collectors.toList());

        return dedupedResults;
    }
}
