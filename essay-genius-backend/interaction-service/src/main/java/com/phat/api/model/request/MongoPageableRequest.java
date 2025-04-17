package com.phat.api.model.request;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.stream.IntStream;

public interface MongoPageableRequest<T> {
    Integer getPage();
    Integer getSize();
    String[] getSortFields();
    Boolean[] getDesc();
    String[] getIds();

    default Sort toSort() {
        if (getSortFields() == null || getSortFields().length == 0) {
            return Sort.unsorted();
        }

        return Sort.by(
                IntStream.range(0, getSortFields().length)
                        .mapToObj(i -> new Sort.Order(
                                (getDesc() != null && i < getDesc().length && getDesc()[i])
                                        ? Sort.Direction.DESC
                                        : Sort.Direction.ASC,
                                getSortFields()[i]))
                        .toList());
    }

    default Pageable toPageable() {
        if (getIds() != null && getIds().length > 0) {
            return PageRequest.of(0, getIds().length, toSort());
        }
        return PageRequest.of(getPage() != null ? getPage() : 0,
                getSize() != null ? getSize() : 10,
                toSort());
    }

    default Query toQuery(String idFieldName) {
        Query query = new Query();

        if (getIds() != null && getIds().length > 0) {
            query.addCriteria(Criteria.where(idFieldName).in((Object[]) getIds()));
        }

        query.with(toPageable());
        return query;
    }

    default Query toQuery() {
        return toQuery("id");
    }
}

