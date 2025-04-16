package com.phat.app.service;

import com.phat.api.model.response.EssayResponseWrapper;
import com.phat.api.model.response.EssaySaveResponse;
import com.phat.api.model.response.EssayTaskTwoScoreResponse;
import com.phat.domain.enums.Visibility;
import com.phat.domain.model.EssaySubmission;
import org.springframework.data.domain.Page;

public interface EssaySubmissionService {
    EssaySubmission saveEssay(String essayText, String promptText, EssayResponseWrapper<EssayTaskTwoScoreResponse> essayTaskTwoScoreResponse, Visibility visibility) throws Exception;

    void deleteEssay(String id);

    EssaySubmission findEssayById(String id) throws Exception;

    Page<EssaySaveResponse> findAllEssays(int page, int size, String sortBy, String sortDirection) throws Exception;

}
