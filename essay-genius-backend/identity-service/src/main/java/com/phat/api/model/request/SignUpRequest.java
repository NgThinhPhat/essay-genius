package com.phat.api.model.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignUpRequest (

        @NotBlank(message = "blank_email")
        @Email(message = "invalid_email")
        String email,

        @NotBlank(message = "blank_firstName")
        @Size(min = 2, max = 20, message = "size_firstName")
        String firstName,

        @NotBlank(message = "blank_lastName")
        @Size(min = 2, max = 20, message = "size_lastName")
        String lastName,

        @NotBlank(message = "blank_password")
        @Size(min = 6, max = 20, message = "size_password")
        String password,

        @NotBlank(message = "blank_password")
        @Size(min = 6, max = 20, message = "size_password")
        String passwordConfirmation

) {

}
