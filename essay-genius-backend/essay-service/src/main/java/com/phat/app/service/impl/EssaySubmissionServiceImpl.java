package com.phat.app.service.impl;

import com.phat.api.model.request.ListEssayRequest;
import com.phat.api.model.response.EssayResponseWrapper;
import com.phat.api.model.response.EssaySaveResponse;
import com.phat.api.model.response.EssayScoredResponse;
import com.phat.api.model.response.EssayTaskTwoScoreResponse;
import com.phat.common.response.InteractionCountResponse;
import com.phat.common.response.UserInfo;
import com.phat.common.service.IdentityServiceGrpcClient;
import com.phat.domain.enums.Visibility;
import com.phat.domain.irepository.EssaySubmissionRepository;
import com.phat.domain.model.EssaySubmission;
import com.phat.infrastructure.mapper.EssaySubmissionMapper;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.phat.common.Utils.getCurrentUser;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Service
public class EssaySubmissionServiceImpl implements com.phat.app.service.EssaySubmissionService {
    EssaySubmissionRepository essaySubmissionRepository;
    EssaySubmissionMapper essaySubmissionMapper;
    IdentityServiceGrpcClient identityServiceGrpcClient;
    InteractionServiceGrpcClient interactionServiceGrpcClient;
    MongoTemplate mongoTemplate;

    @Transactional
    public EssaySubmission saveEssay(String essayText, String promptText, EssayResponseWrapper<EssayTaskTwoScoreResponse> essayTaskTwoScoreResponse, Visibility visibility) throws Exception {
        if (essayTaskTwoScoreResponse == null || essayTaskTwoScoreResponse.getResult() == null) {
            throw new IllegalArgumentException("Essay response result must not be null");
        }

        Double overallBand = essayTaskTwoScoreResponse.getResult().getOverallBand();
        if (overallBand == null || overallBand.isNaN()) {
            throw new IllegalArgumentException("Overall band must be a valid number");
        }

        Double band = Math.floor(overallBand);

        return essaySubmissionRepository.save(EssaySubmission.builder()
                .essayText(essayText)
                .promptText(promptText)
                .band(band)
                .visibility(visibility)
                .essayTaskTwoScoreResponse(essayTaskTwoScoreResponse)
                .build());
    }

    @Override
    public void deleteEssay(String id) {
        EssaySubmission submission = essaySubmissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Essay not found with id: " + id));
        submission.softDelete();

        essaySubmissionRepository.save(submission);
    }

    @Override
    public EssaySubmission findEssayById(String id) throws Exception {
        return essaySubmissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Essay not found with id: " + id));
    }

    @Override
    public Page<EssayScoredResponse> findAllEssays(ListEssayRequest listEssayRequest) throws Exception {
        Criteria criteria = listEssayRequest.toCriteria();
        Query baseQuery = new Query(criteria);
        long count = mongoTemplate.count(baseQuery, EssaySubmission.class);

        Query query = new Query(criteria).with(listEssayRequest.toPageable());
        List<EssaySubmission> essaySubmissions = mongoTemplate.find(query, EssaySubmission.class);
        List<EssayScoredResponse> responses = essaySubmissions.stream()
                .map(submission -> {
                    UserInfo userInfo = identityServiceGrpcClient.getUserInfo(submission.getCreatedBy());
                    InteractionCountResponse interaction = interactionServiceGrpcClient.getInteractionCount(submission.getId());

                    // Mapping to response
                    return EssayScoredResponse.builder()
                            .id(submission.getId())
                            .user(userInfo)
                            .essayText(submission.getEssayText())
                            .promptText(submission.getPromptText())
                            .band(submission.getEssayTaskTwoScoreResponse().getResult().getOverallBand())
                            .createdAt(submission.getCreatedAt())
                            .stars(interaction.reactionCount())
                            .comments(interaction.commentCount())
                            .reactedInfo(interaction.reactedInfo())
                            .build();
                })
                .toList();
        return new PageImpl<>(responses, listEssayRequest.toPageable(), count);
    }

}
