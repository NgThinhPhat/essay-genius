package com.phat.app.service;

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

    public String getScores(String essayPrompt, String essayText) throws AppException {
        EssayServiceOuterClass.ScoringRequest request = EssayServiceOuterClass.ScoringRequest.newBuilder()
                .setEssayPrompt(essayPrompt)
                .setEssayText(essayText)
                .build();

        try {
            EssayServiceOuterClass.ScoringResponse response = stub.scoring(request);
            return response.getResult();
        } catch (Exception e) {
            System.err.println("gRPC Error: " + e.getMessage());
            log.error("gRPC Error: " + e.getMessage());
            throw new RuntimeException("gRPC request failed", e);
        }
    }

}
