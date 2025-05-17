package com.phat.app.service.impl;

import com.phat.api.model.response.EssayResponseWrapper;
import com.phat.api.model.response.EssayTaskTwoScoreResponse;
import com.phat.app.service.MockService;

import com.phat.common.service.IdentityServiceGrpcClient;
import com.phat.domain.irepository.EssaySubmissionRepository;
import com.phat.domain.model.EssaySubmission;
import lombok.RequiredArgsConstructor;
import net.datafaker.Faker;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.TimeUnit;

import static com.phat.common.Utils.getCurrentUser;
import static com.phat.common.Utils.mockSecurityContext;

@Service
@RequiredArgsConstructor
public class MockServiceImpl implements MockService {

    private final EssaySubmissionRepository essaySubmissionRepository;
    private final IdentityServiceGrpcClient identityServiceGrpcClient;
    private final Faker faker = new Faker(new Locale("en"));

    private static final Random random = new Random();

    @Override
    public void init() {
        clear();
        mock();
    }

    @Override
    public void mock() {
        List<String> userIds = identityServiceGrpcClient.getUserIds();

        for (int i = 1; i <= 200; i++) {
            String randomUserId = userIds.get(faker.random().nextInt(userIds.size()));
            mockSecurityContext(randomUserId);

            EssayResponseWrapper<EssayTaskTwoScoreResponse> scoreWrapper = new EssayResponseWrapper<>();
            scoreWrapper.setValid(true);
            EssayTaskTwoScoreResponse randomScores = generateRandomResult();
            scoreWrapper.setResult(randomScores);
            EssaySubmission submission = EssaySubmission.builder()
                    .promptText(faker.lorem().paragraph(4))
                    .essayText(faker.lorem().paragraph(50))
                    .band(Math.floor(randomScores.getOverallBand()))
                    .essayTaskTwoScoreResponse(scoreWrapper)
                    .build();
            submission.setCreatedAt(Date.from(faker.timeAndDate().past(60, TimeUnit.DAYS)));
            essaySubmissionRepository.save(submission);
        }
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

