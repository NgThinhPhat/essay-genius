import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { api } from "@/lib/api";
import { CommentSchema, CreateCommentRequest, createCommentRequestSchema, pageCommentResponseSchema, CommonReactionSchema, ReactionType } from "@/constracts/interaction.contrast";
import { Send } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { useCommentMutation, useDeleteReactionMutation, useReactionMutation } from "@/hooks/mutations/interaction.mutation";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ReactionButton } from "./reaction-button";

interface CommentItemProps {
  comment: CommentSchema;
  depth?: number;
}

export function CommentItem({ comment, depth = 0 }: CommentItemProps) {
  const [reactionId, setReactionId] = useState<string | null>(comment.reactedInfo?.reactionId ?? null);
  const [currentReaction, setCurrentReaction] = useState<ReactionType | null>(comment.reactedInfo?.reactionType ?? null);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replies, setReplies] = useState<CommentSchema[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<CreateCommentRequest>({
    resolver: zodResolver(createCommentRequestSchema),
    defaultValues: {
      essayId: comment.essayId,
      parentId: comment.id ?? null,
      content: "",
    },
  });

  const { handleSubmit } = form;

  const commentMutation = useCommentMutation();
  const createReactionMutation = useReactionMutation();

  const deleteReactionMutation = useDeleteReactionMutation();
  const handleReact = (type: ReactionType) => {
    createReactionMutation.mutate({
      targetId: comment.id,
      targetType: "COMMENT",
      type,
    }, {
      onSuccess: (response: CommonReactionSchema) => {
        setReactionId(response.id);
        comment.reactionCount++;
        setCurrentReaction(type);
        toast.success("Reacted successfully");
      },
    });
  };

  const handleUnreact = () => {
    if (!reactionId) return;
    console.log("reactionId1234", reactionId);
    deleteReactionMutation.mutate(reactionId, {
      onSuccess: () => {
        setReactionId(null);
        setCurrentReaction(null);
      },
    });
  };

  const handleShowReplies = async () => {
    if (showReplies) {
      setShowReplies(false);
      return;
    }

    if (replies.length > 0) {
      setShowReplies(true);
      return;
    }

    setLoadingReplies(true);
    try {
      const { status, body } = await api.interaction.getComments({
        query: {
          essayId: comment.essayId,
          parentId: comment.id,
          page: 0,
          size: 5,
        },
      });

      if (status === 200) {
        const parsed = pageCommentResponseSchema.parse(body);
        setReplies(parsed.content);
      }
    } catch (error) {
      console.error("Failed to load replies", error);
    } finally {
      setLoadingReplies(false);
      setShowReplies(true);
    }
  };

  const handleComment = (data: CreateCommentRequest) => {
    if (!data.content.trim()) return;

    commentMutation.mutate(data, {
      onSuccess: (response) => {
        form.reset({ ...data, content: "" });
        setShowReplies(true);
        setShowReplyInput(false);

        if (response.valid) {
          toast.success("Your toxic level is " + response.message);
        } else {
          toast.error("Your toxic level is " + response.message);
        }

        queryClient.invalidateQueries({
          queryKey: ["comments", comment.essayId, comment.id, null],
        });

        handleShowReplies();
      },
      onError: () => {
        toast("Failed to post comment");
      },
    });
  };

  return (
    <div className="space-y-2" style={{ marginLeft: depth * 16 }}>
      <div className="flex space-x-2">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={comment.user.avatar || "/placeholder.svg"}
            alt={`${comment.user.firstName} ${comment.user.lastName}`}
            className="object-cover"
          />
          <AvatarFallback>{comment.user.firstName.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="bg-muted rounded-lg p-3">
            <div className="font-medium text-sm">{`${comment.user.firstName} ${comment.user.lastName}`}</div>
            <div className="text-sm">{comment.content}</div>
          </div>

          <div className="flex items-center space-x-3 mt-1 text-xs">
            <ReactionButton
              currentReaction={currentReaction}
              onReact={handleReact}
              onUnreact={handleUnreact}
              disabled={createReactionMutation.isLoading || deleteReactionMutation.isLoading}
              count={comment.reactionCount}
            />
            <button
              className="hover:text-foreground"
              onClick={() => setShowReplyInput((prev) => !prev)}
            >
              Reply
            </button>
            {comment.replyCount > 0 && (
              <button
                className="hover:text-foreground"
                onClick={handleShowReplies}
              >
                {showReplies ? "Hide Replies" : `Show ${comment.replyCount} Replies`}
              </button>
            )}
            <span className="text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt))} ago
            </span>
          </div>

          {showReplyInput && (
            <div className="flex items-center space-x-2 mt-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
              <FormProvider {...form}>
                <form
                  onSubmit={handleSubmit(handleComment)}
                  className="flex-1 flex items-center space-x-2"
                >
                  <FormField
                    name="content"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            className="rounded-full bg-muted border-0 h-7 text-xs"
                            placeholder="Write a comment..."
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button size="icon" variant="ghost" type="submit" className="h-7 w-7">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </FormProvider>
            </div>
          )}
        </div>
      </div>

      {showReplies && (
        <div className="space-y-2">
          {loadingReplies ? (
            <>
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </>
          ) : (
            replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
