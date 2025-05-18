package com.phat.app.service;

import com.phat.api.model.request.UpdateUserRequest;
import com.phat.common.response.UserInfo;
import com.phat.domain.model.User;

public interface UserService {

    User findByEmail(String email);

    User findById(String id);

    boolean existsByEmail(String email);

    User createUser(User user);

    void updatePassword(User user, String password);

    void activateUser(User user);

    User getCurrentUserInfo();

    UserInfo updateUser(String userId, UpdateUserRequest request);

    UserInfo updateAvatar(String userId, String avaterUrl);

}
