package com.phat.api.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

public record SignInRequest (
        @NotBlank(message = "blank_email")
        @Email(message = "invalid_email")
        @Schema(description = "Email", example = "nguyenthinhphat3009@gmail.com")
        String email,

        @Schema(description = "Password", example = "phat12")
        @NotBlank(message = "blank_password")
        @Size(min = 6, max = 20, message = "size_password")
        String password
) {
}

