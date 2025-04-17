package com.phat.api.model.request;

import com.phat.domain.enums.VerificationType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SendEmailVerificationRequest(

        @NotNull(message = "null_email")
        @NotBlank(message = "blank_email")
        @Email(message = "invalid_email")
                @Schema(description = "Email", example = "nguyenthinhphat3009@gmail.com")
        String email,

        @NotNull(message = "null_verification_type")
        @Schema(
                description = "Verification type",
                example = "VERIFY_EMAIL_WITH_BOTH"
        )
        VerificationType type
) {
}
