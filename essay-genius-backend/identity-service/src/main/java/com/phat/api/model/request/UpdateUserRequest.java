package com.phat.api.model.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpdateUserRequest {
    private String firstName;
    private String lastName;
    private String bio;
}

