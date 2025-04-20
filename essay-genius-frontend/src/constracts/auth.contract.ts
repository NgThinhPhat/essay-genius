import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

export const authContract = c.router({
  hello: {
    method: 'GET',
    path: '/auth',
    responses: {
      200: z.string()
    }
  },
  signIn: {
    method: 'POST',
    path: '/identity/auth/sign-in',
    body: z.object({
      email: z.string(),
      password: z.string()
    }),
    responses: {
      200: z.object({
        accessToken: z.string(),
        refreshToken: z.string()
      })
    }
  },
  signUp: {
    method: 'POST',
    path: '/auth/sign-up',
    body: z.object({
      email: z.string(),
      firstName: z.string().min(2).max(20),
      lastName: z.string().min(2).max(20),
      password: z.string().min(6).max(20),
      passwordConfirmation: z.string().min(6).max(20)
    }),
    responses: {
      201: z.object({
        message: z.string()
      })
    }
  },
  signOut: {
    method: 'POST',
    path: '/auth/sign-out',
    body: z.object({
      refreshToken: z.string()
    }),
    responses: {
      200: z.null()
    }
  },
  refreshToken: {
    method: 'POST',
    path: '/identity/auth/refresh-token',
    body: z.object({
      refreshToken: z.string()
    }),
    responses: {
      200: z.object({
        accessToken: z.string(),
        refreshToken: z.string()
      })
    }
  },
  verifyEmailByCode: {
    method: 'POST',
    path: '/auth/verify-email-by-code',
    body: z.object({
      email: z.string(),
      code: z.string().length(6)
    }),
    responses: {
      200: z.object({
        message: z.string()
      })
    }
  },
  verifyEmailByToken: {
    method: 'GET',
    path: '/auth/verify-email-by-token',
    query: z.object({
      token: z.string()
    }),
    responses: {
      200: z.object({
        message: z.string()
      })
    }
  },
  sendForgotPassword: {
    method: 'POST',
    path: '/auth/send-forgot-password',
    body: z.object({
      email: z.string()
    }),
    responses: {
      200: z.object({
        message: z.string()
      })
    }
  },
  forgotPassword: {
    method: 'POST',
    path: '/auth/forgot-password',
    body: z.object({
      email: z.string(),
      code: z.string(),
      newPassword: z.string(),
      passwordConfirmation: z.string()
    }),
    responses: {
      200: z.object({
        message: z.string()
      })
    }
  },
  resetPassword: {
    method: 'POST',
    path: '/auth/reset-password',
    body: z.object({
      newPassword: z.string(),
      oldPassword: z.string()
    }),
    responses: {
      200: z.object({
        message: z.string()
      })
    }
  },
  sendEmailVerification: {
    method: 'POST',
    path: '/auth/send-email-verification',
    body: z.object({
      email: z.string()
    }),
    responses: {
      200: z.object({
        message: z.string()
      })
    }
  },
  introspect: {
    method: 'POST',
    path: '/auth/introspect',
    body: z.object({
      token: z.string()
    }),
    responses: {
      200: z.object({
        isActive: z.boolean(),
        email: z.string()
      })
    }
  }
});
