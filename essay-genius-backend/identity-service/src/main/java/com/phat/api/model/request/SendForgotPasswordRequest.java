package com.phat.api.model.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SendForgotPasswordRequest (

    @NotNull(message = "null_email")
    @NotBlank(message = "blank_email")
    @Email(message = "invalid_email")
    String email

) {

}
