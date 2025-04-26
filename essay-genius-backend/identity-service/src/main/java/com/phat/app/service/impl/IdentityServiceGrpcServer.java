package com.phat.app.service.impl;

import java.text.ParseException;
import com.nimbusds.jose.JOSEException;
import com.phat.api.mapper.UserMapper;
import com.phat.app.service.AuthService;
import com.phat.app.service.UserService;
import com.phat.common.response.UserInfo;
import com.phat.domain.model.User;
import com.phat.grpc.identity.*;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;

import static com.phat.app.helper.Constants.MICROSERVICE_NAME;

@GrpcService
@RequiredArgsConstructor
@Slf4j
public class IdentityServiceGrpcServer extends IdentityServiceGrpc.IdentityServiceImplBase {

    private final AuthService authService;
    private final UserService userService;

    @Override
    public void introspect(IntrospectRequest request,
                           StreamObserver<IntrospectResponse> responseObserver) {
        String token = request.getToken();

        IntrospectResponse.Builder responseBuilder = IntrospectResponse.newBuilder();

        try {
            boolean isValid = authService.introspect(token);

            responseBuilder.setValid(isValid);
            responseObserver.onNext(responseBuilder.build());
            responseObserver.onCompleted();

        } catch (JOSEException | ParseException e) {
            responseObserver.onError(io.grpc.Status.INTERNAL
                    .withDescription(String.format("[%s]: Token parsing or validation error: %s", MICROSERVICE_NAME, e.getMessage()))
                    .asRuntimeException());
        }
    }
    @Override
    public void getUserInfo(GetUserInfoRequest request,
                                StreamObserver<GetUserInfoResponse> responseObserver) {

        GetUserInfoResponse.Builder responseBuilder = GetUserInfoResponse.newBuilder();
        try {
            User user = userService.findById(request.getUserId());
            responseBuilder.setUserId(user.getId());
            responseBuilder.setEmail(user.getEmail());
            responseBuilder.setFirstName(user.getFirstName());
            responseBuilder.setLastName(user.getLastName());
            responseBuilder.setAvatar("");
            responseObserver.onNext(responseBuilder.build());
            responseObserver.onCompleted();

        } catch (Exception e) {
            responseObserver.onError(io.grpc.Status.INTERNAL
                    .withDescription(String.format("[%s]: Get user information error: %s", MICROSERVICE_NAME, e.getMessage()))
                    .asRuntimeException());
            return;
        }
    }
}
