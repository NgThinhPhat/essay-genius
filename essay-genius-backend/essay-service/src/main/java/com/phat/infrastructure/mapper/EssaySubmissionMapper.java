package com.phat.infrastructure.mapper;

import com.phat.api.model.response.EssaySaveResponse;
import com.phat.domain.model.EssaySubmission;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EssaySubmissionMapper {
    @Mapping(source = "visibility.value", target = "visibility")
    EssaySaveResponse toEssaySaveResponse(EssaySubmission essaySubmission);
}
