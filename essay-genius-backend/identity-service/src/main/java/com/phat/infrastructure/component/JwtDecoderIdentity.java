package com.phat.infrastructure.component;

import com.phat.app.exception.AppException;
import com.phat.app.service.AuthService;
import com.nimbusds.jose.JOSEException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.text.ParseException;
import java.util.Objects;

import static com.phat.app.exception.AppErrorCode.INVALID_TOKEN;
import static com.phat.app.helper.Constants.ACCESS_TOKEN_SIGNATURE_ALGORITHM;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Component("jwtDecoderIdentity")
@RequiredArgsConstructor
@Slf4j
@Primary
public class JwtDecoderIdentity implements org.springframework.security.oauth2.jwt.JwtDecoder {

    @Value("${jwt.accessSignerKey}")
    private String ACCESS_SIGNER_KEY;

    private final AuthService authService;

    private NimbusJwtDecoder nimbusJwtDecoder = null;

    @Override
    public Jwt decode(String token) {
        try {
            if (!authService.introspect(token)) throw new AppException(INVALID_TOKEN, UNAUTHORIZED, "Introspection failed");

        } catch (JOSEException | ParseException e) {
            throw new JwtException(e.getMessage());
        }

        if (Objects.isNull(nimbusJwtDecoder)) {
            SecretKeySpec secretKeySpec = new SecretKeySpec(
                    ACCESS_SIGNER_KEY.getBytes(),
                    ACCESS_TOKEN_SIGNATURE_ALGORITHM.getName());

            nimbusJwtDecoder = NimbusJwtDecoder.withSecretKey(secretKeySpec)
                    .macAlgorithm(MacAlgorithm.from(ACCESS_TOKEN_SIGNATURE_ALGORITHM.getName()))
                    .build();
        }
        return nimbusJwtDecoder.decode(token);
    }

}
