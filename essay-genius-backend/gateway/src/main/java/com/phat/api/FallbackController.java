package com.phat.api;

import com.phat.app.exception.AppException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import static com.phat.app.exception.AppErrorCode.FALLBACK_ERROR;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@RestController
public class FallbackController {

    @GetMapping("/identity/fallback")
    public Mono<Void> getIdentityFallback() {
        throw new AppException(FALLBACK_ERROR, INTERNAL_SERVER_ERROR, "Identity service is down", "Identity");
    }

    @GetMapping("/profile/fallback")
    public Mono<Void> getProfileFallback() {
        throw new AppException(FALLBACK_ERROR, INTERNAL_SERVER_ERROR, "Profile service is down", "Profile");
    }

}
