package com.phat.api;

import com.phat.api.model.request.UpdateUserRequest;
import com.phat.app.service.MinioClientService;
import com.phat.app.service.UserService;
import com.phat.common.exception.file.FileException;
import com.phat.common.response.UserInfo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;

import static com.phat.app.helper.Utils.convertMultipartFileToFile;
import static com.phat.common.Utils.generateFileName;
import static com.phat.common.exception.file.FileErrorCode.CAN_NOT_STORE_FILE;

@RestController
@RequestMapping("/users")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class UserController {
    UserService userService;
    MinioClientService minioClientService;

    @PostMapping("/upload-avatar")
    public ResponseEntity<UserInfo> uploadAvatar(@RequestPart("avatar") MultipartFile avatar) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        String contentType = avatar.getContentType();
        long size = avatar.getSize();
        String fileName = generateFileName(contentType.split("/")[0], contentType.split("/")[1]);
        try {
            File file = convertMultipartFileToFile(avatar, fileName);
            minioClientService.storeObject(file, fileName, contentType, "user-avatars");
            Files.delete(file.toPath());
            log.info("File uploaded successfully: {}", file.toPath());
        } catch (Exception e) {
            throw new FileException(CAN_NOT_STORE_FILE, HttpStatus.UNPROCESSABLE_ENTITY, e.getMessage());
        }
        return ResponseEntity.ok(
                userService.updateAvatar(userId, fileName));
    }

    @PutMapping("/update-profile/{userId}")
    public ResponseEntity<UserInfo> updateProfile(@PathVariable String userId,@RequestBody UpdateUserRequest updateUserRequest) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!currentUserId.equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        UserInfo updatedUser = userService.updateUser(userId, updateUserRequest);
        return ResponseEntity.ok(updatedUser);
    }
}
