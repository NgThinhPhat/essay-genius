package com.phat.api.model.response;

public record ForgotPasswordResponse (

        String message,

        String token

) {
}