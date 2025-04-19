import { z } from "zod";
export const commonResponse = z.object({
  message: z.string().optional(),
  errorCode: z.string().optional(),
});

export const commonDeleteSchema = z.object({
  id: z.string().uuid()
});
export type CommonDeleteSchema = z.infer<typeof commonDeleteSchema>;

export const commonGetSchema = z.object({
  id: z.string().uuid()
});
export type CommonGetSchema = z.infer<typeof commonGetSchema>;
