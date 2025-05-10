package com.phat.app.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.phat.api.model.response.ToxicCheckerResponse;
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

    public ToxicCheckerResponse checkToxic(String sentence) {
        try {
            ToxicCheckerRequest request = ToxicCheckerRequest.newBuilder()
                    .setSentence(sentence)
                    .build();

            com.phat.grpc.ai.ToxicCheckerResponse response = stub.toxicChecker(request);
            return ToxicCheckerResponse.builder()
                    .valid(response.getValid())
                    .result(response.getResult())
                    .build();

        } catch (Exception e) {
            log.error("gRPC Error: " + e.getMessage());
            throw new AppException(AppErrorCode.CONNECTION_REFUSED, HttpStatus.BAD_REQUEST,"gRPC request failed", e);
        }
    }
}
