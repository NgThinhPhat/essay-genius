package com.phat.api.model.request;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.query.Criteria;

@Getter
@Setter
public abstract class AbstractMongoPageableRequest<T> implements MongoPageableRequest<T> {
    private Integer page = 0;
    private Integer size = 10;
    private String[] sortFields = new String[] {"createdAt"};
    private Boolean[] desc = new Boolean[] {true};
    private String[] ids;

    public abstract Criteria toCriteria();
}
