package com.phat.app.service.impl;

import com.phat.api.model.response.EssayScoringWrapper;
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
            EssaySubmission submission = new EssaySubmission();
            submission.setPromptText("Describe an important event in your life " + i);
            submission.setEssayText("This is the essay content number " + i);
            submission.setBand(randomBand());
            submission.setStar(random.nextInt(6)); // from 0 to 5

            EssayScoringWrapper<EssayTaskTwoScoreResponse> scoreWrapper = new EssayScoringWrapper<>();
            scoreWrapper.setValid(true);
            scoreWrapper.setResult(generateRandomResult());

            submission.setEssayTaskTwoScoreResponse(scoreWrapper);

            submissions.add(submission);
        }

        essaySubmissionRepository.saveAll(submissions);
    }

    @Override
    public void clear() {
        essaySubmissionRepository.deleteAll();
    }

    private Double randomBand() {
        float[] bands = {5.0f, 5.5f, 6.0f, 6.5f, 7.0f, 7.5f, 8.0f};
        return (double) bands[random.nextInt(bands.length)];
    }

    private EssayTaskTwoScoreResponse generateRandomResult() {
        EssayTaskTwoScoreResponse.Scores scores = new EssayTaskTwoScoreResponse.Scores();
        scores.setTaskResponse(randomScoreDetail("Task Response"));
        scores.setCoherenceAndCohesion(randomScoreDetail("Coherence"));
        scores.setLexicalResource(randomScoreDetail("Lexical Resource"));
        scores.setGrammaticalRangeAndAccuracy(randomScoreDetail("Grammar"));

        EssayTaskTwoScoreResponse response = EssayTaskTwoScoreResponse.builder()
                .scores(scores)
                .overallBand(randomBand())
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

