package com.phat.common.components;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.phat.common.exception.AppErrorCode;
import com.phat.common.response.CommonResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;

import static com.phat.common.components.Translator.getLocalizedMessage;

@Slf4j
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(
            HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException {
        AppErrorCode appErrorCode = AppErrorCode.TOKEN_MISSING;

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        CommonResponse<?, ?> commonResponse = CommonResponse.builder()
                .errorCode(appErrorCode.getCode())
                .message(getLocalizedMessage(appErrorCode.getMessage()))
                .build();

        ObjectMapper objectMapper = new ObjectMapper();

        log.error("Blocked at JwtAuthenticationEntryPoint: {}", authException.getMessage());
        response.getWriter().write(objectMapper.writeValueAsString(commonResponse));
        response.flushBuffer();
    }

}
