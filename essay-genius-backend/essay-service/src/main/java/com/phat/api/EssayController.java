package com.phat.api;

import com.phat.api.model.request.EssayTaskTwoScoringRequest;
import com.phat.api.model.response.EssayScoringWrapper;
import com.phat.app.service.AIEssayGrpcClient;
import com.phat.domain.irepository.EssayRepository;
import com.phat.domain.model.Essay;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/essays")
@RequiredArgsConstructor
public class EssayController {
    private final EssayRepository essayRepository;
    private final AIEssayGrpcClient aiEssayGrpcClient;

    @GetMapping("/{userId}")
    public List<Essay> getUserEssays(@PathVariable String userId) {
        return essayRepository.findByUserId(userId);
    }

    @PostMapping
    public Essay submitEssay(@Valid @RequestBody Essay essay) {
        Essay newEssay = Essay.builder()
                .essayPrompt(essay.getEssayPrompt())
                .essayText(essay.getEssayText())
                .userId(essay.getUserId())
                .build();
        return essayRepository.save(essay);
    }

    @PostMapping("/scoring-essay")
    public ResponseEntity<EssayScoringWrapper<?>> scoring(@Valid @RequestBody EssayTaskTwoScoringRequest essayScoringRequest) throws Exception {
        return ResponseEntity.ok()
                .body(aiEssayGrpcClient.getScores(essayScoringRequest.essayPrompt(), essayScoringRequest.essayText()));
    }
}
