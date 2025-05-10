package com.phat.api.model.response;

import lombok.Builder;

@Builder
public record ToxicCheckerResponse(
        boolean valid,
        String result
) {
}
