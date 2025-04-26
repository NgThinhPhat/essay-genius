package com.phat.app.service.impl;

import com.phat.common.exception.AppErrorCode;
import com.phat.common.exception.AppException;
import com.phat.common.response.InteractionCountResponse;
import com.phat.grpc.interaction.GetInteractionCountRequest;
import com.phat.grpc.interaction.GetInteractionCountResponse;
import com.phat.grpc.interaction.InteractionServiceGrpc;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class InteractionServiceGrpcClient {
    @GrpcClient("interaction-service")
    private InteractionServiceGrpc.InteractionServiceBlockingStub stub;

    public InteractionCountResponse getInteractionCount(String targetId) {
        try {
            GetInteractionCountRequest request = GetInteractionCountRequest.newBuilder()
                    .setTargetId(targetId)
                    .build();
            GetInteractionCountResponse response = stub.getInteractionCount(request);
            return InteractionCountResponse.builder()
                    .reactionCount(response.getReactionCount())
                    .commentCount(response.getCommentCount())
                    .build();
        } catch (Exception e) {
            log.error("gRPC Error: " + e.getMessage());
            throw new AppException(AppErrorCode.CONNECTION_REFUSED, HttpStatus.BAD_REQUEST,"gRPC request failed", e);
        }
    }
}
