package com.phat.api.model.request;

import com.phat.api.model.response.EssayResponseWrapper;
import com.phat.api.model.response.EssayTaskTwoScoreResponse;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EssaySaveRequest {
    @NotBlank(message = "Essay text cannot be null")
    @NotNull(message = "Essay text cannot be null")
    String essayText;
    @NotBlank(message = "Prompt text cannot be null")
    @NotNull(message = "Prompt text cannot be null")
    String promptText;
    @NotNull(message = "EssayTaskTwoScoreResponse cannot be null")
    EssayResponseWrapper<EssayTaskTwoScoreResponse> essayTaskTwoScoreResponse;
    @NotNull(message = "Visibility cannot be null")
    String visibility;

}
