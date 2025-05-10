package com.phat.common.interceptors;

import com.phat.common.components.CustomJwtDecoder;
import com.phat.common.configs.GrpcSecurityProperties;
import com.phat.common.configs.ServiceProperties;
import io.grpc.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.interceptor.GrpcGlobalServerInterceptor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import javax.crypto.spec.SecretKeySpec;

import static com.phat.common.Constants.*;

@Slf4j
@RequiredArgsConstructor
public class AuthGrpcServerInterceptor implements ServerInterceptor {

    private final GrpcSecurityProperties grpcSecurityProperties;
    private final ServiceProperties serviceProperties;

    @Qualifier("customJwtDecoder")
    private final CustomJwtDecoder customJwtDecoder;

    @Override
    public <ReqT, RespT> ServerCall.Listener<ReqT> interceptCall(
            ServerCall<ReqT, RespT> call, Metadata headers, ServerCallHandler<ReqT, RespT> next) {

        String methodName = call.getMethodDescriptor().getFullMethodName();

        if (grpcSecurityProperties.getPublicMethods().stream().anyMatch(methodName::contains)) {
            return next.startCall(call, headers);
        }

        String token = headers.get(AUTHORIZATION_KEY);
        if (token == null) {
            log.error("[{}]: Token missing", serviceProperties.getName());
            call.close(Status.UNAUTHENTICATED.withDescription("Token missing"), headers);
            return new ServerCall.Listener<>() {};
        }

        Context ctx = Context.current().withValue(GRPC_AUTHORIZATION_CONTEXT, token);

        return Contexts.interceptCall(ctx, call, headers, next);
    }
}

