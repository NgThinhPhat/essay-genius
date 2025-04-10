package com.phat.app.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.phat.api.model.response.EssayScoringWrapper;
import com.phat.api.model.response.EssayTaskTwoScoreResponse;
import com.phat.app.exception.AppException;
import com.phat.grpc.essay.EssayServiceGrpc;
import com.phat.grpc.essay.EssayServiceOuterClass;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AIEssayGrpcClient {

    @GrpcClient("essay-service")
    private EssayServiceGrpc.EssayServiceBlockingStub stub;


    public EssayScoringWrapper<?> getScores(String essayPrompt, String essayText) throws AppException {
        EssayServiceOuterClass.ScoringRequest request = EssayServiceOuterClass.ScoringRequest.newBuilder()
                .setEssayPrompt(essayPrompt)
                .setEssayText(essayText)
                .build();

        try {
            EssayServiceOuterClass.ScoringResponse response = stub.scoring(request);

            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
            if (response.getValid()) {
                EssayTaskTwoScoreResponse essayTaskTwoScoreResponse =
                        objectMapper.readValue(response.getResult(), EssayTaskTwoScoreResponse.class);

                return EssayScoringWrapper.<EssayTaskTwoScoreResponse>builder()
                        .valid(response.getValid())
                        .result(essayTaskTwoScoreResponse)
                        .build();
            } else {
                return EssayScoringWrapper.<String>builder()
                        .valid(response.getValid())
                        .result(response.getResult())
                        .build();
            }
        } catch (Exception e) {
            log.error("gRPC Error: " + e.getMessage());
            throw new RuntimeException("gRPC request failed", e);
        }
    }


}
