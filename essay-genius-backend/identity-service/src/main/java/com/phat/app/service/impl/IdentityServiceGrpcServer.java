package com.phat.app.service.impl;

import java.text.ParseException;
import com.nimbusds.jose.JOSEException;
import com.phat.app.service.AuthService;
import com.phat.grpc.identity.IdentityServiceGrpc;
import com.phat.grpc.identity.IntrospectRequest;
import com.phat.grpc.identity.IntrospectResponse;
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

    @Override
    public void introspect(IntrospectRequest request,
                           StreamObserver<IntrospectResponse> responseObserver) {
        // Get the token from the request
        String token = request.getToken();

        // Initialize response builder
        IntrospectResponse.Builder responseBuilder = IntrospectResponse.newBuilder();

        try {
            // Call the introspect method to validate the token
            boolean isValid = authService.introspect(token);

            // Set the response according to the token validation result
            responseBuilder.setValid(isValid);

        } catch (JOSEException | ParseException e) {
            // Handle possible exceptions (optional: log the error)
            responseObserver.onError(io.grpc.Status.INTERNAL
                    .withDescription(String.format("[%s]: Token parsing or validation error: %s", MICROSERVICE_NAME, e.getMessage()))
                    .asRuntimeException());
            return;
        }

        // Send the response
        responseObserver.onNext(responseBuilder.build());
        responseObserver.onCompleted();
    }

}
