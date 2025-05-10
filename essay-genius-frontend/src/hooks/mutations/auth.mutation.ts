import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  RefreshBodySchema,
  SignInBodySchema,
  SignInResponseSchema,
  SignInErrorResponseSchema,
  SignUpBodySchema,
  SignUpResponseSchema,
  SignUpErrorResponseSchema,
  RefreshErrorResponseSchema,
  TokensResponseSchema,
  SendEmailVerificationResponseSchema,
  SendEmailVerificationErrorResponseSchema,
  SendEmailVerificationBodySchema,
  VerifyEmailByCodeBodySchema,
  VerifyEmailByCodeErrorResponseSchema,
  VerifyEmailByCodeResponseSchema,
  SendEmailForgotPasswordBodySchema,
  ForgotPasswordErrorResponseSchema,
  ForgotPasswordResponseSchema,
  ResetPasswordResponseSchema,
  ResetPasswordErrorResponseSchema,
  ResetPasswordBodySchema
} from "@/lib/schemas/auth.schema"
import {
  signUp,
  signIn,
  refresh,
  sendEmailVerification,
  verifyEmail,
  sendMailForgotPassword,
  forgotPassword,
  resetPassword
} from "@/lib/apis/auth.api";
import { isAxiosError } from "axios";
import { useCurrentUserActions } from "../current-user-store";
import { useTokenActions } from "../token-store";

export function useSignUpMutation() {
  return useMutation<
    SignUpResponseSchema,
    SignUpErrorResponseSchema,
    SignUpBodySchema
  >({
    mutationKey: ["auth", "sign-up"],
    mutationFn: (body) => signUp(body),
    throwOnError: (error) => isAxiosError(error),
  });
}

export function useSignInMutation() {
  const client = useQueryClient();
  const { setAccessToken, setRefreshToken } = useTokenActions();
  const { setCurrentUser } = useCurrentUserActions();

  return useMutation<
    SignInResponseSchema,
    SignInErrorResponseSchema,
    SignInBodySchema
  >({
    mutationKey: ["auth", "sign-in"],
    mutationFn: (body) => signIn(body),
    onSuccess(data) {
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setCurrentUser(data.user);
      client.invalidateQueries({
        queryKey: ["current-user"],
      });
    },
    throwOnError: (error) => isAxiosError(error),
  });
}

export function useRefreshMutation() {
  const { setAccessToken, setRefreshToken } = useTokenActions();

  return useMutation<
    TokensResponseSchema,
    RefreshErrorResponseSchema,
    RefreshBodySchema
  >({
    mutationKey: ["auth", "refresh"],
    mutationFn: (body) => refresh(body),
    onSuccess(data) {
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
    },
    throwOnError: (error) => isAxiosError(error),
  });
}

export function useSendEmailVerificationMutation() {
  return useMutation<
    SendEmailVerificationResponseSchema,
    SendEmailVerificationErrorResponseSchema,
    SendEmailVerificationBodySchema
  >({
    mutationKey: ["auth", "send-email-verification"],
    mutationFn: (body) => sendEmailVerification(body),
    throwOnError: (error) => isAxiosError(error),
  });
}

export function useSendEmailForgotPasswordMutation() {
  return useMutation<
    SendEmailVerificationResponseSchema,
    SendEmailVerificationErrorResponseSchema,
    SendEmailForgotPasswordBodySchema
  >({
    mutationKey: ["auth", "send-forgot-password"],
    mutationFn: (body) => sendMailForgotPassword(body),
    throwOnError: (error) => isAxiosError(error),
  });
}

export function useVerifyEmailMutation() {
  return useMutation<
    VerifyEmailByCodeResponseSchema,
    VerifyEmailByCodeErrorResponseSchema,
    VerifyEmailByCodeBodySchema
  >({
    mutationKey: ["auth", "verify-email-by-code"],
    mutationFn: (body) => verifyEmail(body),
    throwOnError: (error) => isAxiosError(error),
  });
}

export function useForgotPasswordMutation() {
  return useMutation<
    ForgotPasswordResponseSchema,
    ForgotPasswordErrorResponseSchema,
    VerifyEmailByCodeBodySchema
  >({
    mutationKey: ["auth", "forgot-password"],
    mutationFn: (body) => forgotPassword(body),
    throwOnError: (error) => isAxiosError(error),
  });
}
export function useResetPasswordMutation() {
  return useMutation<
    ResetPasswordResponseSchema,
    ResetPasswordErrorResponseSchema,
    ResetPasswordBodySchema
  >({
    mutationKey: ["auth", "reset-password"],
    mutationFn: (body) => resetPassword(body),
    throwOnError: (error) => isAxiosError(error),
  });
}
