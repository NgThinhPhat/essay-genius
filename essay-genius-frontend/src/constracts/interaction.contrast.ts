import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { pageableRequestSchema, pageableResponseSchema } from '@/lib/schemas/page.schema';
import { commonResponseSchema, userInfoSchema } from './essay.constract';

const c = initContract();

// =================== SCHEMAS ===================

// ---------- Comment ----------
export const commentSchema = z.object({
  id: z.string(),
  essayId: z.string(),
  content: z.string(),
  parentId: z.string().nullable().optional(),
  user: userInfoSchema,
  createdAt: z.string(),
  reactionCount: z.number(),
  replyCount: z.number(),
});
export type Comment = z.infer<typeof commentSchema>;

export const createCommentRequestSchema = z.object({
  essayId: z.string(),
  parentId: z.string().nullable().optional(),
  content: z.string(),
});
export type CreateCommentRequest = z.infer<typeof createCommentRequestSchema>;

export const pageCommentResponseSchema = pageableResponseSchema(commentSchema);
export type PageComment = z.infer<typeof pageCommentResponseSchema>;

export const pageCommentRequestSchema = pageableRequestSchema.extend({
  essayId: z.string(),
  parentId: z.string().nullable().optional(),
  createdBy: z.string().optional(),
})
export type PageCommentRequest = z.infer<typeof pageCommentRequestSchema>;

// ---------- Reaction ----------
//
export const reactionSchema = z.object({
  id: z.string(),
  targetId: z.string(),
  type: z.enum(['STAR', 'LOVE', 'HAHA', 'WOW', 'FIRE', 'SAD']), // ví dụ một số loại reaction
  user: userInfoSchema,
  createdAt: z.string(),
  targetType: z.enum(['ESSAY', 'COMMENT']), // loại đối tượng mà reaction hướng tới
});
export type Reaction = z.infer<typeof reactionSchema>;

export const commonReactionSchema = reactionSchema.omit({ user: true, createdAt: true });

export const createReactionRequestSchema = z.object({
  targetId: z.string(),
  type: reactionSchema.shape.type,
  targetType: z.enum(['ESSAY', 'COMMENT']),
});
export type CreateReactionRequest = z.infer<typeof createReactionRequestSchema>;

export const pageReactionResponseSchema = pageableResponseSchema(reactionSchema);
export type PageReactionResponse = z.infer<typeof pageReactionResponseSchema>;

export const pageReactionRequestSchema = pageableRequestSchema.extend({
  targetId: z.string(),
  reactionType: z.enum(['STAR', 'LOVE', 'HAHA', 'WOW', 'FIRE', 'SAD']).optional(),
});
export type PageReactionRequest = z.infer<typeof pageReactionRequestSchema>;


// ========== ROUTER CONTRACT ==========

export const interactionContract = c.router({
  createComment: {
    method: 'POST',
    path: '/interaction/comments',
    body: createCommentRequestSchema,
    responses: {
      201: commonResponseSchema,
    },
  },
  getComments: {
    method: 'GET',
    path: '/interaction/comments',
    query: pageCommentRequestSchema,
    responses: {
      200: pageCommentResponseSchema,
    },
  },
  createReaction: {
    method: 'POST',
    path: '/interaction/reactions',
    body: createReactionRequestSchema,
    responses: {
      201: commonReactionSchema,
    },
  },
  getReactions: {
    method: 'GET',
    path: '/interaction/reactions',
    query: pageReactionRequestSchema,
    responses: {
      200: pageReactionResponseSchema,
    },
  },
  deleteReaction: {
    method: 'DELETE',
    path: '/interaction/reactions/:id',
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      200: commonResponseSchema,
    },
  },
});
