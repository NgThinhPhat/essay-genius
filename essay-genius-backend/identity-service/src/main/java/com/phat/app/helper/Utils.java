package com.phat.app.helper;

import com.phat.app.exception.AppErrorCode;
import com.phat.app.exception.AppException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.File;
import java.io.IOException;
import java.util.Base64;
import java.util.Date;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

@Slf4j
public class Utils {
    public static String getUserIdFromContext() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    public static String getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return "anonymous";
        }

        return authentication.getName();
    }

    public static File getRandomFile(String folderPath) {
        int random = new Random().nextInt(9) + 1;
        ClassPathResource resource = new ClassPathResource(String.format("%s/%s-%s.jpg", folderPath, folderPath, random));
        log.info("Random file: {}", String.format("%s/%s-%s", folderPath, folderPath, random));
        try {
            return resource.getFile();
        } catch (IOException e) {
            log.error("Error when get random file", e);
            throw new AppException(AppErrorCode.TERMS_NOT_ACCEPTED, HttpStatus.NOT_FOUND, "File not found", e);
        }
    }

    public static Date randomDate(Date start, Date end) {
        long startMillis = start.getTime();
        long endMillis = end.getTime();

        long randomMillis = ThreadLocalRandom.current().nextLong(startMillis, endMillis);
        return new Date(randomMillis);
    }

    public static String toHmacSHA256(String data, String secretKey) throws Exception {

        // Generate HmacSHA256 signature
        Mac hmacSha256 = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(), "HmacSHA256");
        hmacSha256.init(secretKeySpec);
        byte[] hash = hmacSha256.doFinal(data.getBytes());
        return Base64.getEncoder().encodeToString(hash);
    }
}
