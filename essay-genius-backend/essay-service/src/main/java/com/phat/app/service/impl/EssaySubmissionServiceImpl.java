package com.phat.app.service.impl;

import com.phat.api.model.response.EssayResponseWrapper;
import com.phat.api.model.response.EssaySaveResponse;
import com.phat.api.model.response.EssayTaskTwoScoreResponse;
import com.phat.domain.enums.Visibility;
import com.phat.domain.irepository.EssaySubmissionRepository;
import com.phat.domain.model.EssaySubmission;
import com.phat.infrastructure.mapper.EssaySubmissionMapper;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.phat.common.Utils.getCurrentUser;

@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Service
public class EssaySubmissionServiceImpl implements com.phat.app.service.EssaySubmissionService {
    EssaySubmissionRepository essaySubmissionRepository;
    EssaySubmissionMapper essaySubmissionMapper;

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
    public Page<EssaySaveResponse> findAllEssays(int page, int size, String sortBy, String sortDirection) throws Exception {
        Sort sort = sortDirection.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        String currentUserId = getCurrentUser();
        Page<EssaySubmission> essaySubmissions = essaySubmissionRepository.findAllByIsDeletedAndCreatedBy(false, currentUserId, pageable);
        return essaySubmissions.map(essaySubmissionMapper::toEssaySaveResponse);
    }

}
