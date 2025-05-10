package com.phat.common.interceptors;

import com.phat.common.Constants;
import com.phat.common.configs.ServiceProperties;
import io.grpc.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.client.interceptor.GrpcGlobalClientInterceptor;

import static com.phat.common.Constants.*;
import static com.phat.common.Utils.convertToUpperHyphen;
@RequiredArgsConstructor
@Slf4j
public class BearerTokenGrpcClientInterceptor implements ClientInterceptor {

    private final ServiceProperties serviceProperties;

    @Override
    public <ReqT, RespT> ClientCall<ReqT, RespT> interceptCall(
            MethodDescriptor<ReqT, RespT> method,
            CallOptions callOptions,
            Channel next) {

        String methodName = method.getFullMethodName();
        log.info("[{}] → {}", serviceProperties.getName(), methodName);

        return new ForwardingClientCall.SimpleForwardingClientCall<>(next.newCall(method, callOptions)) {
            @Override
            public void start(Listener<RespT> responseListener, Metadata headers) {
                String token = GRPC_AUTHORIZATION_CONTEXT.get();
                if (token != null) {
                    headers.put(AUTHORIZATION_KEY, token);
                }
                super.start(responseListener, headers);
            }
        };
    }
}
