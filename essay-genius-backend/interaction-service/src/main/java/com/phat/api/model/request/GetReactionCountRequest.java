package com.phat.api.model.request;

import jakarta.validation.constraints.NotBlank;

public record GetReactionCountRequest (
        @NotBlank(message = "Target ID cannot be blank")
        String targetId,
        @NotBlank(message = "Reaction Type cannot be blank")
        String reactionType
){
}
