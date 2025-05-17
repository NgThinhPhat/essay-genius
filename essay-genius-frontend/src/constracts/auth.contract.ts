import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { userInfoSchema } from './essay.constract';

const c = initContract();

export const authContract = c.router({
  hello: {
    method: 'GET',
    path: '',
    responses: {
      200: z.string()
    }
  },
  getCurrentUser: {
    method: 'GET',
    path: '/identity/current-user',
    responses: {
      200: userInfoSchema
    }
  },
  signIn: {
    method: 'POST',
    path: '/identity/sign-in',
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
    path: '/sign-up',
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
    path: '/identity/sign-out',
    body: z.object({
      accessToken: z.string(),
      refreshToken: z.string()
    }),
    responses: {
      200: z.null()
    }
  },
  refreshToken: {
    method: 'POST',
    path: '/identity/refresh-token',
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
    path: '/verify-email-by-code',
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
    path: '/verify-email-by-token',
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
    path: '/send-forgot-password',
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
    path: '/forgot-password',
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
    path: '/reset-password',
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
    path: '/send-email-verification',
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
    path: '/introspect',
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
