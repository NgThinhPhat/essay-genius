package com.phat.api.model.response;

import java.util.Date;

public record SendEmailFogotPasswordResponse (

    String message,

    Date retryAfter

) {

}
