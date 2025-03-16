package com.phat.app.service.impl;

import com.phat.app.exception.AppException;
import com.phat.app.service.UserService;
import com.phat.domain.model.User;
import com.phat.domain.irepository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static com.phat.app.exception.AppErrorCode.USER_NOT_FOUND;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new AppException(USER_NOT_FOUND, NOT_FOUND, "User not found with email: " + email));
    }

    @Override
    public User findById(String id) {
        return userRepository.findById(id).orElseThrow(() -> new AppException(USER_NOT_FOUND, NOT_FOUND, "User not found with id: " + id));
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public void updatePassword(User user, String password) {
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }

    @Override
    public void activateUser(User user) {
        userRepository.save(user);
    }
}
