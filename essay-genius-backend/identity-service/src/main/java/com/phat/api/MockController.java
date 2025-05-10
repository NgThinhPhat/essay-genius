package com.phat.api;

import com.phat.app.service.MockService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/mock")
@RequiredArgsConstructor
 @FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MockController {
    MockService mockService;

    @PostMapping("/init")
    public String init() {
        mockService.init();
        return "Database initialized with mock data!";
    }

    @PostMapping("/test")
    public String mock() {
        mockService.mock();
        return "Mock data succeed!";
    }

    @PostMapping("/clear")
    public String clear() {
        mockService.clear();
        return "Database cleared!";
    }
}
