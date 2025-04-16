package com.phat.app.service.impl;

import com.phat.api.model.response.EssayResponseWrapper;
import com.phat.api.model.response.EssayTaskTwoScoreResponse;
import com.phat.app.service.MockService;

import com.phat.domain.irepository.EssaySubmissionRepository;
import com.phat.domain.model.EssaySubmission;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class MockServiceImpl implements MockService {

    private final EssaySubmissionRepository essaySubmissionRepository;

    private static final Random random = new Random();

    @Override
    public void init() {
        clear();
        mock();
    }

    @Override
    public void mock() {
        List<EssaySubmission> submissions = new ArrayList<>();

        for (int i = 1; i <= 20; i++) {
            EssayResponseWrapper<EssayTaskTwoScoreResponse> scoreWrapper = new EssayResponseWrapper<>();
            scoreWrapper.setValid(true);
            scoreWrapper.setResult(generateRandomResult());

            EssaySubmission submission = EssaySubmission.builder()
                    .promptText("Describe an important event in your life " + i)
                    .essayText("This is the essay content number " + i)
                    .band(randomBand())
                    .essayTaskTwoScoreResponse(scoreWrapper)
                    .build();

            submissions.add(submission);
        }

        essaySubmissionRepository.saveAll(submissions);
    }

    @Override
    public void clear() {
        essaySubmissionRepository.deleteAll();
    }

    private byte randomBand() {
        double[] bands = {5.0, 6.0, 7.0, 8.0, 9.0};
        double selectedBand = bands[random.nextInt(bands.length)];
        return (byte) Math.floor(selectedBand); // Ví dụ: 7.5 => 7
    }

    private double randomBandScore() {
        double[] bands = {5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0};
        double selectedBand = bands[random.nextInt(bands.length)];
        return Math.floor(selectedBand); // Ví dụ: 7.5 => 7
    }

    private EssayTaskTwoScoreResponse generateRandomResult() {
        EssayTaskTwoScoreResponse.Scores scores = new EssayTaskTwoScoreResponse.Scores();
        scores.setTaskResponse(randomScoreDetail("Task Response"));
        scores.setCoherenceAndCohesion(randomScoreDetail("Coherence"));
        scores.setLexicalResource(randomScoreDetail("Lexical Resource"));
        scores.setGrammaticalRangeAndAccuracy(randomScoreDetail("Grammar"));

        EssayTaskTwoScoreResponse response = EssayTaskTwoScoreResponse.builder()
                .scores(scores)
                .overallBand(randomBandScore())
                .overallFeedback("Good job. Some areas need improvement.")
                .corrections(List.of(
                        new EssayTaskTwoScoreResponse.Correction("misteak", "mistake", "Typo"),
                        new EssayTaskTwoScoreResponse.Correction("grammer", "grammar", "Common mistake")
                ))
                .improvementTips(List.of("Improve grammar", "Expand vocabulary", "Add more examples"))
                .rewrittenParagraph("This is the corrected version of the paragraph.")
                .build();

        return response;
    }

    private EssayTaskTwoScoreResponse.ScoreDetail randomScoreDetail(String explanationPrefix) {
        int band = 5 + random.nextInt(4); // 5 to 8
        return new EssayTaskTwoScoreResponse.ScoreDetail(band, explanationPrefix + " explanation.");
    }
}

