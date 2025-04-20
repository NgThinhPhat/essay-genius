package com.phat.api.model.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ForgotPasswordRequest (

        @NotBlank(message = "blank_email")
        @Email(message = "invalid_email")
        String email,

        @NotBlank(message = "code_invalid")
        @Size(min = 6, max = 6, message = "code_invalid")
        String code

) {
}
