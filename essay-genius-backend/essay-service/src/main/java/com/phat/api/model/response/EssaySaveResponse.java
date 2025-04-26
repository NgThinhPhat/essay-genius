package com.phat.api.model.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EssaySaveResponse {
    String essayText;
    String promptText;
    EssayResponseWrapper<EssayTaskTwoScoreResponse> essayTaskTwoScoreResponse;
    String visibility;
    Double band;
}
