package com.phat.app.service.impl;

import com.google.protobuf.Empty;
import com.phat.domain.irepository.EssaySubmissionRepository;
import com.phat.domain.model.EssaySubmission;
import com.phat.grpc.essay.EssayServiceGrpc;
import com.phat.grpc.essay.GetEssayIdsResponse;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@GrpcService
@RequiredArgsConstructor
public class EssayGrpcService extends EssayServiceGrpc.EssayServiceImplBase {

    private final EssaySubmissionRepository essaySubmissionRepository;

    @Override
    public void getEssayIds(Empty request, StreamObserver<GetEssayIdsResponse> responseObserver) {
        List<String> essayIds = essaySubmissionRepository.findAll()
                .stream()
                .map(EssaySubmission::getId)
                .collect(Collectors.toList());

        GetEssayIdsResponse response = GetEssayIdsResponse.newBuilder()
                .addAllEssayIds(essayIds)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}

