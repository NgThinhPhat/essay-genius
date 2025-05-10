package com.phat.api.model.response;

import com.phat.common.response.UserInfo;
import com.phat.domain.model.ReactionType;
import com.phat.domain.model.TargetType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReactionResponse {
    String id;

    String targetId;

    ReactionType reactionType;

    TargetType targetType;

    UserInfo user;

    Date createdAt;

}