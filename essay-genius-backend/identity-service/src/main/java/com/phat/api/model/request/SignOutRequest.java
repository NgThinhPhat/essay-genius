package com.phat.api.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SignOutRequest (

    @NotNull(message = "null_token")
    @NotBlank(message = "blank_token")
    String accessToken,

    @NotNull(message = "null_token")
    @NotBlank(message = "blank_token")
    String refreshToken

) {
}