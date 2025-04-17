package com.phat.api.model.request;
import com.phat.domain.model.Comment;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.mongodb.core.query.Criteria;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ListCommentRequest extends AbstractMongoPageableRequest<Comment> {
    @NotBlank(message = "Essay ID cannot be blank")
    private String essayId;
    private String parentId;
    private String createdBy;

    @Override
    public Criteria toCriteria() {
        List<Criteria> criteriaList = new ArrayList<>();

        // Lọc theo essayId
        if (essayId != null && !essayId.isBlank()) {
            criteriaList.add(Criteria.where("essayId").is(essayId));
        }

        // Lọc theo parentId
        if (parentId != null && !parentId.isBlank()) {
            criteriaList.add(Criteria.where("parentId").is(parentId));
        }

        // Lọc theo createdBy
        if (createdBy != null && !createdBy.isBlank()) {
            criteriaList.add(Criteria.where("createdBy").is(createdBy));
        }

        // Luôn chỉ lấy comment chưa bị xóa
        criteriaList.add(Criteria.where("isDeleted").ne(true));

        return new Criteria().andOperator(criteriaList.toArray(new Criteria[0]));
    }

}

