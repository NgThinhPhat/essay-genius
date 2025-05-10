package com.phat.api.model.request;

import com.mongodb.lang.Nullable;
import jakarta.validation.constraints.NotBlank;

public record CreateCommentRequest (
        @NotBlank(message = "Essay ID cannot be blank")
        String essayId,
        @Nullable
        String parentId,
        @NotBlank(message = "Content cannot be blank")
        String content
){
}
