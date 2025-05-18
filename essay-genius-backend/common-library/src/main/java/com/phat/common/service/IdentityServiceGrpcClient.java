package com.phat.common.service;

import com.google.protobuf.Empty;
import com.phat.common.exception.AppErrorCode;
import com.phat.common.exception.AppException;
import com.phat.common.response.UserInfo;
import com.phat.grpc.essay.GetEssayIdsResponse;
import com.phat.grpc.identity.*;
import com.phat.grpc.interaction.GetInteractionCountResponse;
import io.grpc.Status;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.apache.catalina.User;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.phat.common.Utils.runWithAuthContext;

@Slf4j
@Service
public class IdentityServiceGrpcClient {

    @GrpcClient("identity-service")
    private IdentityServiceGrpc.IdentityServiceBlockingStub identityServiceClient;

    public IntrospectResponse introspect(String token) {
        try {
//            boolean isValid = runWithAuthContext(token, () -> identityServiceClient
//                    .introspect(IntrospectRequest.newBuilder()
//                            .setToken(token)
//                            .build()))
//                    .getValid();
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
            throw new AppException(AppErrorCode.INTROSPECT_FAILED, Status.UNAUTHENTICATED, e.getLocalizedMessage());
        }
    }

    public UserInfo getUserInfo(String userId) {
        try {
            GetUserInfoResponse response = identityServiceClient
                    .getUserInfo(GetUserInfoRequest.newBuilder()
                            .setUserId(userId)
                            .build());

            return UserInfo.builder()
                    .id(response.getUserId())
                    .firstName(response.getFirstName())
                    .lastName(response.getLastName())
                    .avatar(response.getAvatar())
                    .email(response.getEmail())
                    .bio(response.getBio())
                    .build();
        } catch (Exception e) {
            log.info("[{}]: Error occurred while getting user info: {}", "COMMON-SERVICE", e.getMessage());
            throw new AppException(AppErrorCode.GET_USER_INFO_FAILED, Status.UNAUTHENTICATED, e.getLocalizedMessage());
        }
    }

    public List<String> getUserIds() {
        try {
            GetUserIdsResponse response = identityServiceClient
                    .getUserIds(Empty.getDefaultInstance());

            return response.getUserIdsList();
        } catch (Exception e) {
            log.info("[{}]: Error occurred while getting user ids: {}", "COMMON-SERVICE", e.getMessage());
            throw new AppException(AppErrorCode.CONNECTION_REFUSED, HttpStatus.BAD_REQUEST,"gRPC request failed", e);
        }
    }

}
