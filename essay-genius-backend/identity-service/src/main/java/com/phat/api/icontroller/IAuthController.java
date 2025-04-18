package com.phat.api.icontroller;

import com.phat.api.model.request.*;
import com.phat.api.model.response.*;
import com.nimbusds.jose.JOSEException;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RequestMapping("/auth")
public interface IAuthController {

    @GetMapping
    public String hello();
    @Operation(
            summary = "Sign up",
            description = "Sign up",
            hidden = false,
            deprecated = false
    )
    @PostMapping("/sign-up")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<SignUpResponse> signUp(@RequestBody @Valid SignUpRequest SignupRequest);

    @Operation(
            summary = "Sign in",
            description = "Sign in",
            hidden = false,
            deprecated = false
    )
    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/sign-in")
    public ResponseEntity<SignInResponse> signIn(@RequestBody @Valid SignInRequest signInRequest);

    @Operation(
            summary = "Sign out",
            description = "Sign out",
            hidden = false,
            deprecated = false
    )
    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/sign-out")
    public void signOut(@RequestBody @Valid SignOutRequest signOutRequest);

    @Operation(
            summary = "Send email verification",
            description = "Send email verification",
            hidden = false,
            deprecated = false
    )
    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/send-email-verification")
    public ResponseEntity<SendEmailVerificationResponse> sendEmailVerification(SendEmailVerificationRequest sendEmailVerificationRequest);

    @Operation(
            summary = "Verify email by code",
            description = "Verify email by code",
            hidden = false,
            deprecated = false
    )
    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/verify-email-by-code")
    public ResponseEntity<VerifyEmailResponse> verifyEmailByCode(VerifyEmailRequest verifyEmailRequest);

    @Operation(
            summary = "Verify email by token",
            description = "Verify email by token",
            hidden = false,
            deprecated = false
    )
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/verify-email-by-token")
    public ResponseEntity<VerifyEmailResponse> verifyEmailByToken(@RequestParam(name = "sign-up-token") String token);

    @Operation(
            summary = "Send forgot password",
            description = "Send forgot password",
            hidden = false,
            deprecated = false
    )
    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/send-forgot-password")
    public ResponseEntity<SendEmailFogotPasswordResponse> sendForgotPassword(@RequestBody @Valid SendForgotPasswordRequest sendForgotPasswordRequest);

    @Operation(
            summary = "Refresh token",
            description = "Refresh token",
            hidden = false,
            deprecated = false
    )
    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/refresh-token")
    public ResponseEntity<RefreshTokenResponse> refreshToken(@RequestBody @Valid RefreshTokenRequest refreshTokenRequest, HttpServletRequest request);

    @Operation(
            summary = "Forgot password",
            description = "Forgot password",
            hidden = false,
            deprecated = false
    )
    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/forgot-password")
    public ResponseEntity<ForgotPasswordResponse> forgotPassword(@RequestBody @Valid ForgotPasswordRequest forgotPasswordRequest);

    @Operation(
            summary = "Reset password",
            description = "Reset password",
            hidden = false,
            deprecated = false
    )
    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/reset-password")
    public ResponseEntity<ResetPasswordResponse> resetPassword(@RequestBody @Valid ResetPasswordRequest resetPasswordRequest);

    @Operation(
            summary = "Introspect",
            description = "Introspect",
            hidden = false,
            deprecated = false
    )
    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/introspect")
    public ResponseEntity<IntrospectResponse> introspect(@RequestBody @Valid IntrospectRequest introspectRequest) throws ParseException, JOSEException;

}
