package com.phat.api.model.request;

public interface PageableWithIdsRequest<T> {
    T[] getIds();
}