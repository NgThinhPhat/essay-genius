package com.phat.app.service;

import ai.EssayAnalysisGrpc;
import ai.EssayService;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.springframework.stereotype.Service;

@Service
public class EssayGrpcClient {
    private final EssayAnalysisGrpc.EssayAnalysisBlockingStub stub;

    public EssayGrpcClient() {
        ManagedChannel channel = ManagedChannelBuilder.forAddress("ai-service", 50051)
                .usePlaintext()
                .build();
        stub = EssayAnalysisGrpc.newBlockingStub(channel);
    }

    public String analyzeEssay(String essayText) {
        EssayService.EssayRequest request = EssayService.EssayRequest.newBuilder()
                .setEssayText(essayText)
                .build();
        EssayService.EssayResponse response = stub.analyzeEssay(request);
        return response.getFeedback();
    }
}

