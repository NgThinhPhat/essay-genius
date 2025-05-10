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
                .avatar(faker.avatar().image())
                .password(passwordEncoder.encode("password"))
                .build());
        for (int i = 0; i < 20; i++) {
            String email = faker.internet().emailAddress();
            String firstName = faker.name().firstName();
            String lastName = faker.name().lastName();
            String avatar = faker.avatar().image();
            try {
                // Download the image as bytes
                byte[] imageBytes = downloadImageAsBytes(avatar);
                // Upload the image to MinIO
                minioClientService.uploadObject(imageBytes, email, "image/jpeg", "user-avatars");
            } catch (Exception e) {
                log.error("Error when retrieving avatar URL for user: {}", email, e);
                avatar = "https://default-avatar-url.com"; // Fallback URL
            }

            userService.createUser(User.builder()
                    .email(email)
                    .firstName(firstName)
                    .lastName(lastName)
                    .avatar(avatar)
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
