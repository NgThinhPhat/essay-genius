package com.phat.common.service;

import com.phat.common.exception.AppErrorCode;
import com.phat.common.exception.AppException;
import com.phat.grpc.identity.IdentityServiceGrpc;
import com.phat.grpc.identity.IntrospectRequest;
import com.phat.grpc.identity.IntrospectResponse;
import io.grpc.Status;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class IdentityServiceGrpcClient {

    @GrpcClient("identity-service")
    private IdentityServiceGrpc.IdentityServiceBlockingStub identityServiceClient;

    public IntrospectResponse introspect(String token) {
        try {
            boolean isValid = identityServiceClient
                    .introspect(IntrospectRequest.newBuilder()
                            .setToken(token)
                            .build())
                    .getValid();

            IntrospectResponse response = IntrospectResponse.newBuilder()
                    .setValid(isValid)
                    .build();

            return response;
        } catch (Exception e) {
            log.info("[{}]: Error occurred while introspecting token: {}", "COMMON-SERVICE", e.getMessage());
            throw new AppException(AppErrorCode.INTROSPECT_FAILED, Status.UNAUTHENTICATED, "Token introspection failed");
        }
    }

}
