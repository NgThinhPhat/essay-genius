package com.phat.api;

import com.phat.domain.irepository.EssayRepository;
import com.phat.domain.model.Essay;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/essays")
@RequiredArgsConstructor
public class EssayController {
    private final EssayRepository essayRepository;

    @GetMapping("/{userId}")
    public List<Essay> getUserEssays(@PathVariable String userId) {
        return essayRepository.findByUserId(userId);
    }

    @PostMapping
    public Essay submitEssay(@RequestBody Essay essay) {
        Essay newEssay = Essay.builder()
                .title(essay.getTitle())
                .content(essay.getContent())
                .userId(essay.getUserId())
                .build();
        return essayRepository.save(essay);
    }
}
