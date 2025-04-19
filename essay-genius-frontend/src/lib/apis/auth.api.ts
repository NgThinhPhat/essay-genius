import {
  SignInBodySchema,
  SignInResponseSchema,
  SignUpBodySchema,
  SignUpResponseSchema,
  RefreshBodySchema,
  TokensResponseSchema,
  SendEmailVerificationBodySchema,
  SendEmailVerificationResponseSchema,
  VerifyEmailByCodeBodySchema,
  VerifyEmailByCodeResponseSchema,
  SendEmailForgotPasswordBodySchema,
  ResetPasswordBodySchema,
  ResetPasswordResponseSchema,
  ForgotPasswordResponseSchema,
} from "../schemas/auth.schema";
import { restClient } from "../rest-client";

export async function signUp(
  data: SignUpBodySchema,
  config?: AxiosRequestConfig<SignUpBodySchema>

): Promise<SignUpResponseSchema> {
  const response = await restClient.post<
    SignUpResponseSchema,
    SignUpBodySchema
  >("/identity/auth/sign-up",
    data,
    {
      headers: {
        "No-Auth": true,
      },
      ...config,
    }
  );
  return response.data;
}

export async function signIn(
  data: SignInBodySchema,
  config?: AxiosRequestConfig<SignInBodySchema>

): Promise<SignInResponseSchema> {
  const response = await restClient.post<
    SignInResponseSchema,
    SignInBodySchema
  >("/identity/auth/sign-in",
    data,
    {
      headers: {
        "No-Auth": true,
      },
      ...config,
    }
  );
  return response.data;
}

export async function refresh(
  body: RefreshBodySchema,

): Promise<TokensResponseSchema> {
  const response = await restClient.post<TokensResponseSchema>(
    "/identity/auth/refresh",
    body,
    {
      headers: {
        "No-Auth": true,
      },
    },
  );
  return response.data;
}

export async function sendMailForgotPassword(
  data: SendEmailForgotPasswordBodySchema,
  config?: AxiosRequestConfig<SendEmailForgotPasswordBodySchema>,
): Promise<SendEmailVerificationResponseSchema> {
  const response = await restClient.post<
    SendEmailVerificationResponseSchema,
    SendEmailForgotPasswordBodySchema
  >("/identity/auth/send-forgot-password",
    data,
    {
      headers: {
        "No-Auth": true,
      },
      ...config,
    }
  );
  return response.data;
}

export async function sendEmailVerification(
  data: SendEmailVerificationBodySchema,
  config?: AxiosRequestConfig<SendEmailVerificationBodySchema>,
): Promise<SendEmailVerificationResponseSchema> {
  const response = await restClient.post<
    SendEmailVerificationResponseSchema,
    SendEmailVerificationBodySchema
  >("/identity/auth/send-email-verification",
    data,
    {
      headers: {
        "No-Auth": true,
      },
      ...config,
    }
  );
  return response.data;
}

export async function verifyEmail(
  data: VerifyEmailByCodeBodySchema,
  config?: AxiosRequestConfig<VerifyEmailByCodeBodySchema>,
): Promise<VerifyEmailByCodeResponseSchema> {
  const response = await restClient.post<
    VerifyEmailByCodeResponseSchema,
    VerifyEmailByCodeBodySchema
  >("/identity/auth/verify-email-by-code",
    data,
    {
      headers: {
        "No-Auth": true,
      },
      ...config,
    }
  );
  return response.data;
}

export async function forgotPassword(
  data: VerifyEmailByCodeBodySchema,
  config?: AxiosRequestConfig<VerifyEmailByCodeBodySchema>,
): Promise<ForgotPasswordResponseSchema> {
  const response = await restClient.post<
    ForgotPasswordResponseSchema,
    VerifyEmailByCodeBodySchema
  >("/identity/auth/forgot-password",
    data,
    {
      headers: {
        "No-Auth": true,
      },
      ...config,
    }
  );
  return response.data;
}

export async function resetPassword(
  data: ResetPasswordBodySchema,
  config?: AxiosRequestConfig<ResetPasswordBodySchema>,
): Promise<ResetPasswordResponseSchema> {
  const response = await restClient.post<
    ResetPasswordResponseSchema,
    ResetPasswordBodySchema
  >("/identity/auth/reset-password",
    data,
    {
      headers: {
        "No-Auth": true,
      },
      ...config,
    }
  );
  return response.data;
}
