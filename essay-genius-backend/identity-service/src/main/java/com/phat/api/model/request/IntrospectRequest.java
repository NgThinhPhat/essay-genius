package com.phat.api.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record IntrospectRequest (

    @NotNull
    @NotBlank
    String token

) {

}
