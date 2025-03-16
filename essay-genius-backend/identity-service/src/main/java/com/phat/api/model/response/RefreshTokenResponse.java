package com.phat.api.model.response;

public record RefreshTokenResponse (

        String message,

        String accessToken

) {
}