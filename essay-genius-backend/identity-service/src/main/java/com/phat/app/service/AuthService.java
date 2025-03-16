package com.phat.app.service;

import com.phat.domain.enums.VerificationType;
import com.phat.domain.model.User;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.HttpServletRequest;

import java.text.ParseException;
public interface AuthService {

    boolean introspect(String token) throws JOSEException, ParseException;

    void signUp(User user, String confirmationPassword, String firstName, String lastName);

    void sendEmailVerification(String email, VerificationType verificationType);

    void verifyEmail(User user, String code, String token);

    User signIn(String email, String password);

    String generateToken(User user, boolean isRefresh);

    String refresh(String refreshToken, HttpServletRequest servletRequest) throws ParseException, JOSEException;

    void sendEmailForgotPassword(String email);

    String forgotPassword(User user, String code);

    void resetPassword(String token, String password, String confirmationPassword);

    void signOut(String accessToken, String refreshToken) throws ParseException, JOSEException;
}