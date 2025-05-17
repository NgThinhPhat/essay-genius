import { CommonReactionSchema, CreateCommentRequest, CreateCommentResponse, CreateReactionRequest } from "@/constracts/interaction.contrast";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCommentMutation() {
  return useMutation<CreateCommentResponse, unknown, CreateCommentRequest>({
    mutationKey: ['interaction', 'comment'],
    mutationFn: async (body) => {
      const response = await api.interaction.createComment({ body });

      if (response.status === 201) {
        return response.body;
      }

      throw new Error('Failed to create comment');
    },
  });
}

export function useReactionMutation() {
  return useMutation<CommonReactionSchema, unknown, CreateReactionRequest>({
    mutationKey: ['interaction', 'reaction'],
    mutationFn: async (body) => {
      const response = await api.interaction.createReaction({ body });

      if (response.status === 201) {
        return response.body;
      }

      throw new Error('Failed to create reaction');
    },
  });
}

export function useDeleteReactionMutation(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (id: string) => {
      return api.interaction.deleteReaction({ params: { id } });
    },
    onSuccess: async (response) => {
      switch (response.status) {
        case 200:
          toast.success(response.body.message);
          onSuccess?.();
          break;
        default:
          toast.error("Delete reaction failed");
      }
    },
    onError: () => {
      toast.error("Failed to delete reaction");
    },
  });
}
