
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { api } from "@/lib/api";
import { CreateCommentRequest, createCommentRequestSchema, pageCommentResponseSchema } from "@/constracts/interaction.contrast";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface CommentItemProps {
  comment: any; // bạn thay bằng đúng type
  depth?: number;
}

export function CommentItem({ comment, depth = 0 }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replies, setReplies] = useState<any[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [newReply, setNewReply] = useState("");

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

  const handleReply = async () => {
    if (!newReply.trim()) return;
    // TODO: Gửi API tạo reply
    setNewReply("");
    setShowReplyInput(false); // Ẩn ô input sau khi gửi
  };

  return (
    <div className={`space-y-2 ${depth > 0 ? `ml-${depth * 4}` : ""}`}>
      <div className="flex space-x-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.firstName + comment.user.lastName} />
          <AvatarFallback>{comment.user.firstName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-muted rounded-lg p-3">
            <div className="font-medium text-sm">{`${comment.user.firstName} ${comment.user.lastName}`}</div>
            <div className="text-sm">{comment.content}</div>
          </div>
          <div className="flex items-center space-x-3 mt-1 text-xs">
            <button className="text-muted-foreground hover:text-foreground">Star</button>
            <button
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setShowReplyInput((prev) => !prev)}
            >
              Reply
            </button>
            <button
              className="text-muted-foreground hover:text-foreground"
              onClick={handleShowReplies}
            >
              {showReplies ? "Hide Replies" : "Show Replies"}
            </button>
            <span className="text-muted-foreground">{formatDistanceToNow(new Date(comment.createdAt))}</span>
          </div>

          {/* Reply Input xuất hiện khi bấm Reply */}
          {showReplyInput && (
            <div className="flex items-center space-x-2 mt-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex items-center space-x-2">
                <Input
                  placeholder="Write a reply..."
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  className="rounded-full bg-muted border-0 h-7 text-xs"
                />
                <Button size="icon" variant="ghost" onClick={handleReply} disabled={!newReply.trim()}>
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replies section */}
      {showReplies && (
        <div className="space-y-2 ml-10">
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

