package com.phat.domain.model;

import com.phat.api.model.response.EssayResponseWrapper;
import com.phat.api.model.response.EssayTaskTwoScoreResponse;
import com.phat.domain.enums.Visibility;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "essay_submissions")
@Getter
@Builder
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class EssaySubmission extends AbstractEntity {
    @Id
    String id;
    EssayResponseWrapper<EssayTaskTwoScoreResponse> essayTaskTwoScoreResponse;
    @Indexed
    String promptText;
    @Indexed
    String essayText;
    @Indexed
    @Min(0)
    @Max(9)
    byte band;
    @Builder.Default
    @NotNull
    Visibility visibility = Visibility.PUBLIC;

}