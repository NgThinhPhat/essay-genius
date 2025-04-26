package com.phat.common.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReactionResponse {
    String targetId;
    String targetType;
    UserInfo user;
}
