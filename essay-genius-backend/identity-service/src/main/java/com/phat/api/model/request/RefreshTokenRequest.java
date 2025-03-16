package com.phat.api.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RefreshTokenRequest (

    @NotNull(message = "null_token")
    @NotBlank(message = "blank_token")
    String refreshToken

) {
}
