package com.phat.app.service.impl;

import com.phat.app.service.MinioClientService;
import com.phat.app.service.MockService;
import com.phat.app.service.UserService;
import com.phat.domain.irepository.UserRepository;
import com.phat.domain.model.User;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import net.datafaker.Faker;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.net.URL;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class MockServiceImpl implements MockService {
    UserRepository userRepository;
    UserService userService;
    Faker faker = new Faker();
    PasswordEncoder passwordEncoder;
    MinioClientService minioClientService;

    @Override
    public void init() {
        clear();
        mock();
    }

    @Override
    public void mock() {
        userService.createUser(User.builder()
                .email("nguyenthinhphat3009@gmail.com")
                .firstName("Phat")
                .lastName("Nguyen")
                .avatar("image_20250517_132027_e004037b-f8ab-4042-8c0c-6eb01223d818.jpeg")
                .password(passwordEncoder.encode("phat12"))
                .enabled(true)
                .build());
        for (int i = 0; i < 50; i++) {
            String email = faker.internet().emailAddress();
            String firstName = faker.name().firstName();
            String lastName = faker.name().lastName();
            String avatar = faker.avatar().image();
            try {
                byte[] imageBytes = downloadImageAsBytes(avatar);
                minioClientService.uploadObject(imageBytes, "user-avatars", avatar, "image/jpeg");
            } catch (Exception e) {
                log.error("Error when retrieving avatar URL for user: {}", email, e);
                avatar = "https://default-avatar-url.com";
            }

            userService.createUser(User.builder()
                    .email(email)
                    .firstName(firstName)
                    .lastName(lastName)
                    .avatar(avatar)
                    .enabled(true)
                    .password(passwordEncoder.encode("password"))
                    .build());
        }


    }

    public byte[] downloadImageAsBytes(String imageUrl) throws Exception {
        try (InputStream in = new URL(imageUrl).openStream()) {
            return in.readAllBytes();
        }
    }

    @Override
    public void clear() {
        userRepository.deleteAll();
    }
}
