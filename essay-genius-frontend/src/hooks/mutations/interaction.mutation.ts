import { commentSchema, CreateCommentRequest } from "@/constracts/interaction.contrast";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export function useCommentMutation() {
  return useMutation({
    mutationFn: async (data: CreateCommentRequest) => {
      const response = await api.interaction.createComment(data);
      return commentSchema.parse(response);
    },
  });

}
