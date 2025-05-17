package com.phat.api.model.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Builder
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class ToxicCheckerResponse {
    boolean valid;
    String message;
    CommentResponse commentResponse;
}