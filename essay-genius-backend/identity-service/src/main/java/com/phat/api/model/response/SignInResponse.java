package com.phat.api.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.phat.api.model.UserInfo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
//@JsonInclude(JsonInclude.Include.NON_NULL)
public class SignInResponse {
    private String accessToken;
    private String refreshToken;
    UserInfo user;
}
