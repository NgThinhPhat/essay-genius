package com.phat.api.model.request;

import com.phat.domain.enums.Visibility;
import com.phat.domain.model.EssaySubmission;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static com.phat.common.Utils.getCurrentUser;

@Getter
@Setter
public class ListEssayRequest extends AbstractMongoPageableRequest<EssaySubmission> {

  private String promptText;

  private Double bandFrom;
  private Double bandTo;

  private Visibility visibility;

  private String createdBy;

  private Date createdAtFrom;
  private Date createdAtTo;

  private Boolean isDeleted;

  private Boolean ownByCurrentUser = false;

  @Override
  public Criteria toCriteria() {
    List<Criteria> criteriaList = new ArrayList<>();

    if (getIds() != null && getIds().length > 0) {
      criteriaList.add(Criteria.where("id").in(Arrays.asList(getIds())));
    }

    if (StringUtils.hasText(promptText)) {
      criteriaList.add(Criteria.where("promptText").regex(promptText, "i"));
    }

    if (bandFrom != null && bandTo != null) {
      criteriaList.add(Criteria.where("band").gte(bandFrom).lte(bandTo));
    } else if (bandFrom != null) {
      criteriaList.add(Criteria.where("band").gte(bandFrom));
    } else if (bandTo != null) {
      criteriaList.add(Criteria.where("band").lte(bandTo));
    }

    if (visibility != null) {
      criteriaList.add(Criteria.where("visibility").is(visibility));
    }

    if (StringUtils.hasText(createdBy)) {
      criteriaList.add(Criteria.where("createdBy").is(createdBy));
    }

    if (createdAtFrom != null && createdAtTo != null) {
      criteriaList.add(Criteria.where("createdAt").gte(createdAtFrom).lte(createdAtTo));
    } else if (createdAtFrom != null) {
      criteriaList.add(Criteria.where("createdAt").gte(createdAtFrom));
    } else if (createdAtTo != null) {
      criteriaList.add(Criteria.where("createdAt").lte(createdAtTo));
    }

    if (isDeleted != null) {
      criteriaList.add(Criteria.where("isDeleted").is(isDeleted));
    }

    if (ownByCurrentUser != null) {
      if (ownByCurrentUser) {
        criteriaList.add(Criteria.where("createdBy").is(getCurrentUser()));
      } else {
        criteriaList.add(Criteria.where("createdBy").nin(Arrays.asList(getCurrentUser(), null)));
      }
    }

    return criteriaList.isEmpty()
        ? new Criteria()
        : new Criteria().andOperator(criteriaList.toArray(new Criteria[0]));
  }
}
