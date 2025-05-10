package com.phat.common.response;

import lombok.Builder;

@Builder
public record InteractionCountResponse (
        long reactionCount,
        long commentCount,
        ReactedInfo reactedInfo
){
}
