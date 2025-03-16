package com.phat.api.model.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

public record SignInRequest (
        @NotBlank(message = "blank_email")
        @Email(message = "invalid_email")
        String email,

        @NotBlank(message = "blank_password")
        @Size(min = 6, max = 20, message = "size_password")
        String password
) {
}

