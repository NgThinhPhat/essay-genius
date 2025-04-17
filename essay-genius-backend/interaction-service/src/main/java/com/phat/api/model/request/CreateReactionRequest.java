package com.phat.api.model.request;

import jakarta.validation.constraints.NotBlank;

public record CreateReactionRequest (
        @NotBlank(message = "Target ID cannot be blank")
        String targetId,
        @NotBlank(message = "Target type cannot be blank")
        String targetType,
        @NotBlank(message = "Type cannot be blank")
        String type
){
}
