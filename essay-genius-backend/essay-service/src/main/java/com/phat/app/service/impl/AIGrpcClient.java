package com.phat.app.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.phat.api.model.response.EssayResponseWrapper;
import com.phat.api.model.response.EssayTaskTwoScoreResponse;
import com.phat.common.exception.AppErrorCode;
import com.phat.common.exception.AppException;
import com.phat.grpc.ai.*;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class AIGrpcClient {

    @GrpcClient("ai-service")
    private AIServiceGrpc.AIServiceBlockingStub stub;

    public EssayResponseWrapper<?> getScores(String essayPrompt, String essayText) {
        try {
            ScoringRequest request = ScoringRequest.newBuilder()
                    .setEssayPrompt(essayPrompt)
                    .setEssayText(essayText)
                    .build();
            ScoringResponse response = stub.scoring(request);

            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
            if (response.getValid()) {
                EssayTaskTwoScoreResponse essayTaskTwoScoreResponse =
                        objectMapper.readValue(response.getResult(), EssayTaskTwoScoreResponse.class);

                return EssayResponseWrapper.<EssayTaskTwoScoreResponse>builder()
                        .valid(response.getValid())
                        .result(essayTaskTwoScoreResponse)
                        .build();
            } else {
                return EssayResponseWrapper.<String>builder()
                        .valid(response.getValid())
                        .result(response.getResult())
                        .build();
            }
        } catch (Exception e) {
            log.error("gRPC Error: " + e.getMessage());
            throw new AppException(AppErrorCode.CONNECTION_REFUSED, HttpStatus.BAD_REQUEST,"gRPC request failed", e);
        }
    }

    public EssayResponseWrapper<String> generateEssayPrompt(List<String> topic)  {
        try {
            GenerateEssayPromptRequest request = GenerateEssayPromptRequest.newBuilder()
                    .addAllTopics(topic)
                    .build();

            GenerateEssayPromptResponse response = stub.generateEssayPrompt(request);

            return EssayResponseWrapper.<String>builder()
                    .valid(response.getValid())
                    .result(response.getResult())
                    .build();
        } catch (Exception e) {
            log.error("gRPC Error: " + e.getMessage());
            throw new AppException(AppErrorCode.CONNECTION_REFUSED, HttpStatus.BAD_REQUEST,"gRPC request failed", e);
        }
    }
}
