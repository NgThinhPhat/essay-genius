import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

// =================== SCHEMAS ===================

export const correctionSchema = z.object({
  mistake: z.string(),
  suggestion: z.string(),
  explanation: z.string(),
});
export type Correction = z.infer<typeof correctionSchema>;

export const scoreDetailSchema = z.object({
  band: z.number().int(),
  explanation: z.string(),
});
export type ScoreDetail = z.infer<typeof scoreDetailSchema>;

export const scoresSchema = z.object({
  taskResponse: scoreDetailSchema,
  coherenceAndCohesion: scoreDetailSchema,
  lexicalResource: scoreDetailSchema,
  grammaticalRangeAndAccuracy: scoreDetailSchema,
});
export type Scores = z.infer<typeof scoresSchema>;

export const essayTaskTwoScoreResponseSchema = z.object({
  scores: scoresSchema,
  overallBand: z.number(),
  overallFeedback: z.string(),
  corrections: z.array(correctionSchema),
  improvementTips: z.array(z.string()),
  rewrittenParagraph: z.string(),
});
export type EssayTaskTwoScoreResponse = z.infer<typeof essayTaskTwoScoreResponseSchema>;

export const essayTaskTwoScoringRequestSchema = z.object({
  essayPrompt: z.string(),
  essayText: z.string(),
});
export type EssayTaskTwoScoringRequest = z.infer<typeof essayTaskTwoScoringRequestSchema>;

export const essayResponseWrapperObjectSchema = z.object({
  valid: z.boolean(),
  result: z.any(),
});
export type EssayResponseWrapperObject = z.infer<typeof essayResponseWrapperObjectSchema>;

export const essayResponseWrapperScoreSchema = z.object({
  valid: z.boolean(),
  result: essayTaskTwoScoreResponseSchema,
});
export type EssayResponseWrapperScore = z.infer<typeof essayResponseWrapperScoreSchema>;

export const essayaveRequestSchema = z.object({
  essayText: z.string(),
  promptText: z.string(),
  essayTaskTwoScoreResponse: essayResponseWrapperScoreSchema,
  visibility: z.string(),
});
export type essayaveRequest = z.infer<typeof essaySaveRequestSchema>;

export const essayResponseWrapperStringSchema = z.object({
  valid: z.boolean(),
  result: z.string(),
});
export type EssayResponseWrapperString = z.infer<typeof essayResponseWrapperStringSchema>;

export const commonResponseSchema = z.object({
  errorCode: z.string(),
  message: z.string(),
  results: z.any(),
  errors: z.any(),
});
export type CommonResponse = z.infer<typeof commonResponseSchema>;

// Replace z.any() with real schema if available
export const essayaveResponseSchema = z.any();
export type essayaveResponse = z.infer<typeof essaySaveResponseSchema>;

export const pageessayaveResponseSchema = z.any();
export type PageessayaveResponse = z.infer<typeof pageEssaySaveResponseSchema>;

export const listEssayRequestSchema = z.object({
  page: z.number().int(),
  size: z.number().int(),
  sortFields: z.array(z.string()),
  desc: z.array(z.boolean()),
});
export type ListEssayRequest = z.infer<typeof listEssayRequestSchema>;

// =================== ROUTER CONTRACT ===================

export const essayContract = c.router({
  scoring: {
    method: 'POST',
    path: '/essay/scoring-essay',
    body: essayTaskTwoScoringRequestSchema,
    responses: {
      200: essayResponseWrapperObjectSchema,
    },
  },
  saveEssay: {
    method: 'POST',
    path: '/essay/save-essay',
    body: essayaveRequestSchema,
    responses: {
      201: commonResponseSchema,
    },
  },
  generateEssayPrompt: {
    method: 'POST',
    path: '/essay/generate-essay-prompt',
    body: z.array(z.string()),
    responses: {
      200: essayResponseWrapperStringSchema,
    },
  },
  getAllessay: {
    method: 'GET',
    path: '/essay',
    query: listEssayRequestSchema,
    responses: {
      200: pageessayaveResponseSchema,
    },
  },
  hello: {
    method: 'GET',
    path: '/essay/hello',
    responses: {
      200: z.string(),
    },
  },
  getEssay: {
    method: 'GET',
    path: '/essay/get-essay/:id',
    pathParams: z.object({ id: z.string() }),
    responses: {
      200: essayaveResponseSchema,
    },
  },
  deleteEssay: {
    method: 'DELETE',
    path: '/essay/delete-essay/:id',
    pathParams: z.object({ id: z.string() }),
    responses: {
      200: commonResponseSchema,
    },
  },
});

