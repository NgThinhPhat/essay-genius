package com.phat.api.model.request;

import jakarta.validation.constraints.NotBlank;

public record EssayScoringRequest (
        @NotBlank
        String essayPrompt,

        @NotBlank
        String essayText
){
}
