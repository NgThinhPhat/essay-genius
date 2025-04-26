package com.phat.api.model.response;

import com.phat.common.response.UserInfo;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EssayScoredResponse {
  String id;
  UserInfo user;
  String essayText;
  String promptText;
  Double band;
  Date createdAt;
  int stars;
  int comments;
}
