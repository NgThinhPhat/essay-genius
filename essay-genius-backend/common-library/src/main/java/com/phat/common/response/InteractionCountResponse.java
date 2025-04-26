package com.phat.common.response;

import lombok.Builder;

@Builder
public record InteractionCountResponse (
        int reactionCount,
        int commentCount
){
}
