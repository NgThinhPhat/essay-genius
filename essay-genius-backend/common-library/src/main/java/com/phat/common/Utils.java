package com.phat.common;

import io.grpc.Context;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Random;
import java.util.UUID;
import java.util.function.Supplier;
import java.util.stream.Collectors;

import static com.phat.common.Constants.GRPC_AUTHORIZATION_CONTEXT;

@Component
@RequiredArgsConstructor
public class Utils {
    public static <T> T runWithAuthContext(String token, Supplier<T> supplier) throws Exception {
        return Context.current()
                .withValue(GRPC_AUTHORIZATION_CONTEXT, token)
                .call(supplier::get);
    }

    public static void handleRawFile(String filePath) throws IOException {
        String[] fileNameParts = filePath.split("/");

        String fileName = fileNameParts[fileNameParts.length - 1];

        String pathToFile = (fileNameParts.length > 1)
                ? "/" + filePath.replace("/" + fileName, "") : "";

        Path pathToNewFolder = Paths.get("output/" + pathToFile);

        Files.createDirectories(pathToNewFolder);
    }

    public static String convertToUpperHyphen(String input) {
        StringBuilder result = new StringBuilder();

        for (int i = 0; i < input.length(); i++) {
            char c = input.charAt(i);
            if (Character.isUpperCase(c) && i > 0) {
                result.append("-");
            }
            result.append(c);
        }

        return result.toString().toUpperCase();
    }

    public static String convertToTitleCase(String input) {
        return Arrays.stream(input.split("-"))
                .map(word -> word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase())
                .collect(Collectors.joining(" "));
    }

    public static String generateFileName(String fileType, String extension) {
        // Lấy thời gian hiện tại với format yyyyMMdd_HHmmss
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");
        String timestamp = LocalDateTime.now().format(dateTimeFormatter);

        // Tạo UUID duy nhất
        String uniqueId = UUID.randomUUID().toString();

        // Kết hợp tên file
        return String.format("%s_%s_%s.%s", fileType, timestamp, uniqueId, extension);
    }

    public static <T extends Enum<?>> T getRandomEnum(Class<T> enumClass) {
        Random random = new Random();
        int x = random.nextInt(enumClass.getEnumConstants().length);
        return enumClass.getEnumConstants()[x];
    }

    public static String getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return "anonymous";
        }

        return authentication.getName();
    }

}
