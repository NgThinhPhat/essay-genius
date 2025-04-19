import { z } from "zod";
import { unauthorizedErrorResponseSchema, validationErrorResponseSchema } from "./errors.schema";

// GENERATE ESSAY PROMPT
export const generateEssayPromptSchema = z.object({
  topics: z.string()
});
export type GenerateEssayPromptSchema = z.infer<typeof generateEssayPromptSchema>;

export const generateEssayPromptResponseSchema = z.object({
  valid: z.boolean(),
  result: z.string()
});
export type GenerateEssayPromptResponseSchema = z.infer<typeof generateEssayPromptResponseSchema>;

export const generateEssayPromptErrorSchema = z.object({
  validationErrorResponseSchema,
  unauthorizedErrorResponseSchema,
});
export type GenerateEssayPromptErrorSchema = z.infer<typeof generateEssayPromptErrorSchema>;

// Scoring ESSAY
export const scoringEssaySchema = z.object({
  essayPrompt: z.string(),
  essayText: z.string()
});
export type ScoringEssaySchema = z.infer<typeof scoringEssaySchema>;

export const scoringEssayResponseSchema = z.object({
  valid: z.boolean(),
  result: z.string()
});
export type ScoringEssayResponseSchema = z.infer<typeof scoringEssayResponseSchema>;

export const scoringEssayErrorSchema = z.object({
  validationErrorResponseSchema,
  unauthorizedErrorResponseSchema
});
export type scoringEssayErrorSchema = z.infer<typeof scoringEssayErrorSchema>;

//save ESSAY
export const saveEssaySchema = z.object({
  essayPrompt: z.string(),
  essayText: z.string(),
  visibility: z.enum(["PUBLIC", "PRIVATE"])
});
export type SaveEssaySchema = z.infer<typeof saveEssaySchema>;

export const saveEssayResponseSchema = z.object({
  message: z.string()
});
export type SaveEssayResponseSchema = z.infer<typeof saveEssayResponseSchema>;

export const saveEssayErrorSchema = z.object({
  validationErrorResponseSchema,
  unauthorizedErrorResponseSchema
})
export type SaveEssayErrorSchema = z.infer<typeof saveEssayErrorSchema>;

//Delete ESSAY

