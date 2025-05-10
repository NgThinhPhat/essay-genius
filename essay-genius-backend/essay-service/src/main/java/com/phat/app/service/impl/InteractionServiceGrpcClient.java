package com.phat.app.service.impl;

import com.phat.common.exception.AppErrorCode;
import com.phat.common.exception.AppException;
import com.phat.common.response.InteractionCountResponse;
import com.phat.grpc.interaction.GetInteractionCountRequest;
import com.phat.grpc.interaction.GetInteractionCountResponse;
import com.phat.grpc.interaction.InteractionServiceGrpc;
import com.phat.grpc.interaction.ReactedInfo;
import io.grpc.Context;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import static com.phat.common.Utils.getCurrentUser;
import static com.phat.common.Utils.runWithAuthContext;

@Service
@Slf4j
public class InteractionServiceGrpcClient {
    @GrpcClient("interaction-service")
    private InteractionServiceGrpc.InteractionServiceBlockingStub stub;


    public InteractionCountResponse getInteractionCount(String targetId) {
        try {
            GetInteractionCountRequest request = GetInteractionCountRequest.newBuilder()
                    .setTargetId(targetId)
                    .setCurrentUserId(getCurrentUser())
                    .build();

            log.info("gRPC request: {}", request);

            GetInteractionCountResponse response = stub.getInteractionCount(request);

            ReactedInfo reactedInfo = response.getReactedInfo();
            return InteractionCountResponse.builder()
                    .reactionCount(response.getReactionCount())
                    .commentCount(response.getCommentCount())
                    .reactedInfo(com.phat.common.response.ReactedInfo.builder()
                            .isReacted(reactedInfo.getIsReacted())
                            .reactionId(
                                    reactedInfo.getIsReacted()
                                            ? reactedInfo.getReactionId()
                                            : null
                            )
                            .reactionType(
                                    reactedInfo.getIsReacted()
                                            ? reactedInfo.getReactionType()
                                            : null
                            )
                            .build()
                    )
                    .build();
        } catch (Exception e) {
            log.error("gRPC Error: {}", e.getMessage(), e);
            throw new AppException(AppErrorCode.CONNECTION_REFUSED, HttpStatus.BAD_REQUEST, "gRPC request failed", e);
        }
    }

}
