package com.phat.api.model.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.util.List;

@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class EssayTaskTwoScoreResponse {
    private Scores scores;
    private double overallBand;
    private String overallFeedback;
    private List<Correction> corrections;
    private List<String> improvementTips;
    private String rewrittenParagraph;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Scores {
        private ScoreDetail taskResponse;
        private ScoreDetail coherenceAndCohesion;
        private ScoreDetail lexicalResource;
        private ScoreDetail grammaticalRangeAndAccuracy;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ScoreDetail {
        private int band;
        private String explanation;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Correction {
        private String mistake;
        private String suggestion;
        private String explanation;
    }
}

