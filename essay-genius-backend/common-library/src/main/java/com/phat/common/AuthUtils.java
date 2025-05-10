package com.phat.common;

import com.phat.common.components.CustomJwtDecoder;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

import static com.phat.common.Constants.GRPC_AUTHORIZATION_CONTEXT;

@RequiredArgsConstructor
public class AuthUtils {
    @Value("${jwt.accessSignerKey}")
    private String ACCESS_SIGNER_KEY;

    private NimbusJwtDecoder nimbusJwtDecoder = null;
    @Qualifier("customJwtDecoder")
    private final static CustomJwtDecoder jwtDecoder = null;
    public static String getCurrentUserGrpc() {
        String token = GRPC_AUTHORIZATION_CONTEXT.get();
        if (token != null) {
            try {
                Jwt jwt = jwtDecoder.decode(token);
                return jwt.getSubject();
            } catch (JwtException e) {
                return "anonymous";
            }
        }
        return "anonymous";
    }
}
