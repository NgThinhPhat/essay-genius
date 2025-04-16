package com.phat.app.service.impl;

import com.google.protobuf.Empty;
import com.phat.common.exception.AppErrorCode;
import com.phat.common.exception.AppException;
import com.phat.grpc.essay.EssayServiceGrpc;
import com.phat.grpc.essay.GetEssayIdsResponse;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class EssayGrpcClient {
    @GrpcClient("essay-service")
    private EssayServiceGrpc.EssayServiceBlockingStub stub;

    public List<String> getEssayIds() {
        try {
            GetEssayIdsResponse response = stub.getEssayIds(Empty.getDefaultInstance());

            return response.getEssayIdsList();
        } catch (Exception e) {
            log.error("gRPC Error: " + e.getMessage());
            throw new AppException(AppErrorCode.CONNECTION_REFUSED, HttpStatus.BAD_REQUEST,"gRPC request failed", e);
        }
    }
}
