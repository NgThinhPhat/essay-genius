package com.phat.api.model.request;

import jakarta.validation.constraints.NotBlank;

public record EssayTaskTwoScoringRequest(
        @NotBlank
        String essayPrompt,

        @NotBlank
        String essayText
){
}
