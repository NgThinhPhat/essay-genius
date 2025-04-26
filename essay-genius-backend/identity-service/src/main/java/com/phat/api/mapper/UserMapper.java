package com.phat.api.mapper;

import com.phat.common.response.UserInfo;
import com.phat.api.model.request.SignUpRequest;
import com.phat.domain.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toUser(SignUpRequest request);

    UserInfo toUserInfo(User user);

}
