package com.phat.infrastructure.component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.phat.api.model.response.CommonResponse;
import com.phat.app.exception.AppErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import org.springframework.http.MediaType;
import java.io.IOException;

import static com.phat.app.exception.AppErrorCode.TOKEN_MISSING;
import static com.phat.common.components.Translator.getLocalizedMessage;

@Slf4j
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        AppErrorCode appErrorCode = TOKEN_MISSING;

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
