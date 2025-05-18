import { useComments } from "@/hooks/mutations/interaction.mutation";
import { CommentItem } from "./comment-item";

export function CommentList({
  essayId,
  showComments,
}: {
  essayId: string;
  showComments: boolean;
}) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useComments({ essayId, size: 5 }, showComments);

  const comments = data?.pages.flatMap((page) => page.content) ?? [];

  return (
    <div>
      {isLoading ? (
        <p>Loading comments...</p>
      ) : isError ? (
        <p>Failed to load comments</p>
      ) : (
        <>
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
          {hasNextPage && (
            <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
              {isFetchingNextPage ? "Loading more..." : "Load more"}
            </button>
          )}
        </>
      )}
    </div>
  );
}

