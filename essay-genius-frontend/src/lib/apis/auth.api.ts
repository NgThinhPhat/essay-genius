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

export async function sendEmailVerification(
  data: SendEmailVerificationBodySchema,
  config?: AxiosRequestConfig<SendEmailVerificationBodySchema>,
): Promise<SendEmailVerificationResponseSchema> {
  const response = await restClient.post<
    { message: string },
    { email: string }
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
    { message: string },
    { code: string }
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
