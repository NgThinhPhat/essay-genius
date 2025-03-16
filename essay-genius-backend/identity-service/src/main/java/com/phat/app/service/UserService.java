package com.phat.app.service;

import com.phat.domain.model.User;

public interface UserService {

    User findByEmail(String email);

    User findById(String id);

    boolean existsByEmail(String email);

    User createUser(User user);

    void updatePassword(User user, String password);

    void activateUser(User user);
}
