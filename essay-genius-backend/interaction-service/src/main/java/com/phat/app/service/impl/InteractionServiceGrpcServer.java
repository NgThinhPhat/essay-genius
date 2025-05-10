package com.phat.app.service.impl;

import com.phat.common.response.InteractionCountResponse;
import com.phat.app.service.InteractionService;
import com.phat.grpc.interaction.*;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;


@GrpcService
@RequiredArgsConstructor
@Slf4j
public class InteractionServiceGrpcServer extends InteractionServiceGrpc.InteractionServiceImplBase {
    private final InteractionService interactionService;

    @Override
    public void getInteractionCount(GetInteractionCountRequest request, StreamObserver<GetInteractionCountResponse> responseObserver) {
        try{
            com.phat.common.response.ReactedInfo reactedInfo = interactionService.isUserReacted(request.getTargetId(), request.getCurrentUserId());

            ReactedInfo.Builder builder = ReactedInfo.newBuilder().setIsReacted(reactedInfo.isReacted());
            if (reactedInfo.isReacted()){
                builder.setReactionType(reactedInfo.reactionType());
                builder.setReactionId(reactedInfo.reactionId());
            }

            GetInteractionCountResponse response = GetInteractionCountResponse.newBuilder()
                    .setReactionCount(interactionService.getReactionCount(request.getTargetId()))
                    .setCommentCount(interactionService.getCommentCount(request.getTargetId()))
                    .setReactedInfo(builder)
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        }catch (Exception e){
            log.error("Error while processing getReaction request: {}", e.getMessage());
            responseObserver.onError(io.grpc.Status.INTERNAL
                    .withDescription(String.format("Error while processing getReaction request: %s", e.getMessage()))
                    .asRuntimeException());
        }

    }

}
