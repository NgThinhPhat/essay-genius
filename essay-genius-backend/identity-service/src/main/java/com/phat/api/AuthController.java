package com.phat.api;

import com.phat.api.icontroller.IAuthController;
import com.phat.api.mapper.UserMapper;
import com.phat.api.model.request.*;
import com.phat.api.model.response.*;
import com.phat.app.exception.AppException;
import com.phat.app.service.AuthService;
import com.phat.app.service.UserService;
import com.phat.domain.model.User;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import static com.phat.app.exception.AppErrorCode.INVALID_SIGNATURE;
import static com.phat.common.components.Translator.getLocalizedMessage;
import static javax.security.auth.callback.ConfirmationCallback.OK;
import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController implements IAuthController {
    AuthService authService;
    UserMapper userMapper;
    UserService userService;

    @Override
    public String hello() {
        return "Hello";
    }

    @Override
    public ResponseEntity<SignUpResponse> signUp(SignUpRequest signUpRequest) {
        User user = userMapper.toUser(signUpRequest);
        authService.signUp(user, signUpRequest.passwordConfirmation(), signUpRequest.firstName(), signUpRequest.lastName());

        return ResponseEntity.status(HttpStatus.CREATED).body(new SignUpResponse("Sign up successful"));
    }

    @Override
    public ResponseEntity<SignInResponse> signIn(SignInRequest signInRequest) {
        User signInUser = authService.signIn(signInRequest.email(), signInRequest.password());

        String accessToken = authService.generateToken(signInUser, false);

        String refreshToken = authService.generateToken(signInUser, true);

        return ResponseEntity.status(HttpStatus.OK).body(
                SignInResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .user(userMapper.toUserInfo(signInUser)).build()
        );
    }

    @Override
    public void signOut(SignOutRequest signOutRequest) {
        try {
            authService.signOut(signOutRequest.accessToken(), signOutRequest.refreshToken());
        } catch (ParseException | JOSEException e) {
            throw new AppException(INVALID_SIGNATURE, UNPROCESSABLE_ENTITY, "Invalid signature");
        }
    }

    @Override
    public ResponseEntity<SendEmailVerificationResponse> sendEmailVerification(SendEmailVerificationRequest sendEmailVerificationRequest) {
        authService.sendEmailVerification(sendEmailVerificationRequest.email(), sendEmailVerificationRequest.type());

        return ResponseEntity.status(OK).body(
                new SendEmailVerificationResponse(getLocalizedMessage("resend_verification_email_success")));
    }

    @Override
    public ResponseEntity<VerifyEmailResponse> verifyEmailByCode(VerifyEmailRequest verifyEmailRequest) {
        return null;
    }

    @Override
    public ResponseEntity<VerifyEmailResponse> verifyEmailByToken(String token) {
        return null;
    }

    @Override
    public ResponseEntity<SendEmailFogotPasswordResponse> sendForgotPassword(SendForgotPasswordRequest sendForgotPasswordRequest) {
        authService.sendEmailForgotPassword(sendForgotPasswordRequest.email());

        return ResponseEntity.status(OK).body(new SendEmailFogotPasswordResponse(
                getLocalizedMessage("send_forgot_password_email_success"),
                Date.from(Instant.now().plus(1, ChronoUnit.MINUTES))
        ));
    }

    @Override
    public ResponseEntity<RefreshTokenResponse> refreshToken(RefreshTokenRequest refreshTokenRequest, HttpServletRequest httpServletRequest) {

        String newAccessToken;
        try {
            newAccessToken = authService.refresh(refreshTokenRequest.refreshToken(), httpServletRequest);

        } catch (ParseException | JOSEException e) {
            throw new AppException(INVALID_SIGNATURE, UNPROCESSABLE_ENTITY, "Invalid signature");
        }

        return ResponseEntity.status(OK).body(new RefreshTokenResponse(
                getLocalizedMessage("refresh_token_success"),
                newAccessToken
        ));

    }

    @Override
    public ResponseEntity<ForgotPasswordResponse> forgotPassword(ForgotPasswordRequest forgotPasswordRequest) {
        User user = userService.findByEmail(forgotPasswordRequest.email());
        String forgotPasswordToken = authService.forgotPassword(user, forgotPasswordRequest.code());

        return ResponseEntity.status(OK).body(new ForgotPasswordResponse(
                getLocalizedMessage("verify_forgot_password_code_success"),
                forgotPasswordToken
        ));
    }

    @Override
    public ResponseEntity<ResetPasswordResponse> resetPassword(ResetPasswordRequest resetPasswordRequest) {
        authService.resetPassword(resetPasswordRequest.token(), resetPasswordRequest.password(), resetPasswordRequest.passwordConfirmation());

        return ResponseEntity.status(OK).body(
                new ResetPasswordResponse(getLocalizedMessage("reset_password_success")));

    }

    @Override
    public ResponseEntity<IntrospectResponse> introspect(IntrospectRequest introspectRequest) throws ParseException, JOSEException {
        boolean isValid = authService.introspect(introspectRequest.token());

        return ResponseEntity.status(OK).body(new IntrospectResponse(isValid));
    }
}
