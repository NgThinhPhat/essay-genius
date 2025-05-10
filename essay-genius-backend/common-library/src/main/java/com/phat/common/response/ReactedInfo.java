package com.phat.common.response;

import lombok.Builder;

@Builder
public record ReactedInfo(
        boolean isReacted,
        String reactionId,
        String reactionType
) {
}
