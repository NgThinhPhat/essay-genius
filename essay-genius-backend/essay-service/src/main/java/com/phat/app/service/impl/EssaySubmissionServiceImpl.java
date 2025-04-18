package com.phat.app.service.impl;

import com.phat.api.model.request.ListEssayRequest;
import com.phat.api.model.response.EssayResponseWrapper;
import com.phat.api.model.response.EssaySaveResponse;
import com.phat.api.model.response.EssayTaskTwoScoreResponse;
import com.phat.domain.enums.Visibility;
import com.phat.domain.irepository.EssaySubmissionRepository;
import com.phat.domain.model.EssaySubmission;
import com.phat.infrastructure.mapper.EssaySubmissionMapper;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.phat.common.Utils.getCurrentUser;

@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Service
public class EssaySubmissionServiceImpl implements com.phat.app.service.EssaySubmissionService {
    EssaySubmissionRepository essaySubmissionRepository;
    EssaySubmissionMapper essaySubmissionMapper;
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

        Byte band = (byte) Math.floor(overallBand);

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
    public Page<EssaySaveResponse> findAllEssays(ListEssayRequest listEssayRequest) throws Exception {
        Criteria criteria = listEssayRequest.toCriteria();
        Query query = new Query(criteria).with(listEssayRequest.toPageable());
        long count = mongoTemplate.count(query, EssaySubmission.class);
        List<EssaySubmission> essaySubmissions = mongoTemplate.find(query, EssaySubmission.class);
        List<EssaySaveResponse> responses = essaySubmissions.stream()
                .map(essaySubmissionMapper::toEssaySaveResponse)
                .toList();
        return new PageImpl<>(responses, listEssayRequest.toPageable(), count);
    }

}
