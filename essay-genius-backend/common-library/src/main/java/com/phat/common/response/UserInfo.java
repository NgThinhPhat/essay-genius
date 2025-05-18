package com.phat.common.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserInfo {
    String id;

    String email;

    String firstName;

    String lastName;

    String avatar;

    String bio;
}
