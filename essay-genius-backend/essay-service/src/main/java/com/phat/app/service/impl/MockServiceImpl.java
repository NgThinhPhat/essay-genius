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
            EssayTaskTwoScoreResponse randomScores = generateRandomResult();
            scoreWrapper.setResult(randomScores);
            EssaySubmission submission = EssaySubmission.builder()
                    .promptText("Describe an important event in your life " + i)
                    .essayText("This is the essay content number " + i)
                    .band(Math.floor(randomScores.getOverallBand()))
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

    private double randomBandScore() {
        double[] bands = {5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0};
        return bands[random.nextInt(bands.length)];
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
        Random random = new Random();
        double band = 5.0 + (random.nextInt(9)); // 0 -> 8  →  0*0.5 + 5.0 = 5.0  đến  8*0.5 + 5.0 = 9.0
        band = 5.0 + (random.nextInt(9)) * 0.5; // 5 to 8
        return new EssayTaskTwoScoreResponse.ScoreDetail(band, explanationPrefix + " explanation.");
    }
}

