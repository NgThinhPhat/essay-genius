package com.phat.domain.model;

import com.phat.api.model.response.EssayScoringWrapper;
import com.phat.api.model.response.EssayTaskTwoScoreResponse;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "essay_submissions")
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class EssaySubmission extends AbstractEntity{
    @Id
    String id;
    EssayScoringWrapper<EssayTaskTwoScoreResponse> essayTaskTwoScoreResponse;
    @Indexed
    String promptText;
    String essayText;
    @Indexed
    Double band;
    @Indexed
    int star;
}