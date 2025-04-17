package com.phat.api.model.request;

import com.phat.domain.model.Reaction;
import com.phat.domain.model.ReactionType;
import com.phat.domain.model.TargetType;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.query.Criteria;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Getter
@Setter
public class ListReactionRequest extends AbstractMongoPageableRequest<Reaction> {
    @NotBlank(message = "Target ID cannot be blank")
    private String targetId;
    private TargetType targetType;
    private ReactionType reactionType;
    private String createdBy;

    @Override
    public Criteria toCriteria() {
        List<Criteria> criteriaList = new ArrayList<>();

        // Lọc theo danh sách ids
        if (getIds() != null && getIds().length > 0) {
            criteriaList.add(Criteria.where("id").in(Arrays.asList(getIds())));
        }

        // Lọc theo targetId
        if (targetId != null && !targetId.isBlank()) {
            criteriaList.add(Criteria.where("targetId").is(targetId));
        }

        // Lọc theo targetType
        if (targetType != null) {
            criteriaList.add(Criteria.where("target_type").is(targetType));
        }

        // Lọc theo reactionType
        if (reactionType != null) {
            criteriaList.add(Criteria.where("reactionType").is(reactionType));
        }

        // Lọc theo createdBy
        if (createdBy != null && !createdBy.isBlank()) {
            criteriaList.add(Criteria.where("createdBy").is(createdBy));
        }

        return criteriaList.isEmpty()
                ? new Criteria()
                : new Criteria().andOperator(criteriaList.toArray(new Criteria[0]));
    }
}
