package com.phat.api.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;

@Builder
public record RefreshTokenResponse (

        String message,

        String accessToken,
        String refreshToken

) {
}