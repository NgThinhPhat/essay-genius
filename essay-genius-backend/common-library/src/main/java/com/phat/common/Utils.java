package com.phat.common;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

public class Utils {

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
