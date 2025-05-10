package com.phat.api.model.response;

import com.phat.common.response.UserInfo;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class CommentResponse {
    String id;
    String essayId;
    String content;
    String parentId;
    UserInfo user;
    Date createdAt;
    long reactionCount;
    long replyCount;
}
