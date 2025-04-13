package com.phat.api;

import com.phat.api.model.request.EssayTaskTwoScoringRequest;
import com.phat.api.model.response.EssayScoringWrapper;
import com.phat.app.service.impl.AIEssayGrpcClient;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/essays")
@RequiredArgsConstructor
public class EssayController {
    private final AIEssayGrpcClient aiEssayGrpcClient;

    @GetMapping("hello")
    public String hello() {
        return "Hello";
    }

    @PostMapping("/scoring-essay")
    public ResponseEntity<EssayScoringWrapper<?>> scoring(@Valid @RequestBody EssayTaskTwoScoringRequest essayScoringRequest) throws Exception {
        return ResponseEntity.ok()
                .body(aiEssayGrpcClient.getScores(essayScoringRequest.essayPrompt(), essayScoringRequest.essayText()));
    }
}
