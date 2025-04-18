import { z } from "zod";
import {
  validationErrorResponseSchema,
  unauthorizedErrorResponseSchema
} from "./errors.schema";

export const jwtPayloadSchema = z.object({
  sub: z.string(),
  exp: z.number(),
  iat: z.number(),
});
export type JwtPayloadSchema = z.infer<typeof jwtPayloadSchema>;

export const accessTokenPayloadSchema = jwtPayloadSchema;
export type AccessTokenPayloadSchema = z.infer<typeof accessTokenPayloadSchema>;

export const accessTokenSchema = z.string();
export type AccessTokenSchema = z.infer<typeof accessTokenSchema>;

export const refreshTokenPayloadSchema = jwtPayloadSchema;
export type RefreshTokenPayloadSchema = z.infer<typeof refreshTokenPayloadSchema>;

export const refreshTokenSchema = z.string();
export type RefreshTokenSchema = z.infer<typeof refreshTokenSchema>;

export const refreshBodySchema = z.object({
  refreshToken: refreshTokenSchema,
});
export type RefreshBodySchema = z.infer<typeof refreshBodySchema>;

export const tokensResponseSchema = z.object({
  accessToken: accessTokenSchema,
  refreshToken: refreshTokenSchema,
});
export type TokensResponseSchema = z.infer<typeof tokensResponseSchema>;

export const previewUserResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string(),
  name: z.string(),
  avatar: z.string().optional(),
});
export type PreviewUserResponseSchema = z.infer<typeof previewUserResponseSchema>;

//SIGN IN
export const signInBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(20),
});
export type SignInBodySchema = z.infer<typeof signInBodySchema>;

export const signInResponseSchema = z.object({
  accessToken: accessTokenSchema,
  refreshToken: refreshTokenSchema,
  user: previewUserResponseSchema,
});
export type SignInResponseSchema = z.infer<typeof signInResponseSchema>;

export const signInErrorResponseSchema = z.discriminatedUnion("errorCode", [
  validationErrorResponseSchema,
  unauthorizedErrorResponseSchema,
]);
export type SignInErrorResponseSchema = z.infer<typeof signInErrorResponseSchema>;

//SIGN UP
export const signUpBodySchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(20),
  passwordConfirmation: z.string().min(6).max(20),
});
export type SignUpBodySchema = z.infer<typeof signUpBodySchema>;

export const signUpResponseSchema = z.object({
  message: z.string(),
});
export type SignUpResponseSchema = z.infer<typeof signUpResponseSchema>;

export const signUpErrorResponseSchema = z.discriminatedUnion("errorCode", [
  validationErrorResponseSchema,
  unauthorizedErrorResponseSchema,
]);
export type SignUpErrorResponseSchema = z.infer<typeof signUpErrorResponseSchema>;

export const refreshErrorResponseSchema = z.discriminatedUnion("errorCode", [
  validationErrorResponseSchema,
  unauthorizedErrorResponseSchema,
]);
export type RefreshErrorResponseSchema = z.infer<typeof refreshErrorResponseSchema>;

// SEND EMAIL VERIFICATION
export const sendEmailVerificationBodySchema = z.object({
  email: z.string().email(),
  type: z.enum(["VERIFY_EMAIL_WITH_BOTH", "VERIFY_EMAIL_BY_CODE", "VERIFY_EMAIL_BY_TOKEN"]),
});
export type SendEmailVerificationBodySchema = z.infer<typeof sendEmailVerificationBodySchema>;

export const sendEmailVerificationResponseSchema = z.object({
  message: z.string(),
});
export type SendEmailVerificationResponseSchema = z.infer<typeof sendEmailVerificationResponseSchema>;

export const sendEmailVerificationErrorResponseSchema = z.discriminatedUnion("errorCode", [
  validationErrorResponseSchema,
  unauthorizedErrorResponseSchema,
]);
export type SendEmailVerificationErrorResponseSchema = z.infer<typeof sendEmailVerificationErrorResponseSchema>;

// VERIFY EMAIL
export const verifyEmailByCodeBodySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});
export type VerifyEmailByCodeBodySchema = z.infer<typeof verifyEmailByCodeBodySchema>;

export const verifyEmailByCodeResponseSchema = z.object({
  message: z.string(),
});
export type VerifyEmailByCodeResponseSchema = z.infer<typeof verifyEmailByCodeResponseSchema>;

export const verifyEmailByCodeErrorResponseSchema = z.discriminatedUnion("errorCode", [
  validationErrorResponseSchema,
  unauthorizedErrorResponseSchema,
]);
export type VerifyEmailByCodeErrorResponseSchema = z.infer<typeof verifyEmailByCodeErrorResponseSchema>;



