import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@radix-ui/react-alert-dialog"
import { Button } from "../ui/button"
import { Trash2 } from "lucide-react"
import { AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { ScoreDetail } from "./score-detail"
import { EssayScoredResponse } from "@/constracts/essay.constract"
import { formatDistanceToNow } from "date-fns"
import { CommentList } from "./comment-list"
import { ReplyInput } from "./reply-input"
import { useGetEssay } from "@/hooks/mutations/essay.mutation"

interface EssayDetailProps {
  key: string
  essay: EssayScoredResponse
  onBack: () => void
  onDelete: (id: string) => void
  newComment: string
  setNewComment: (comment: string) => void
  handleAddComment: (essayId: string) => void
  showComments: boolean
  setShowComments: (show: boolean) => void
}
export function EssayDetail({
  key,
  essay,
  onBack,
  onDelete,
  showComments,
  setShowComments,
}: EssayDetailProps) {

  const { data, isLoading, error } = useGetEssay(essay.id);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load essay.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            ← Back to Essays
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Essay
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Essay</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this essay? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(essay.id)}
                  className="bg-destructive text-destructive-foreground"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Task 2</CardTitle>
            <CardDescription>
              <span className="text-muted-foreground">
                {formatDistanceToNow(new Date(essay.createdAt))} ago
              </span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Prompt:</h3>
              <div className="text-sm bg-muted p-3 rounded-md">{essay.promptText}</div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Your Essay:</h3>
              <div className="text-sm whitespace-pre-line border p-3 rounded-md">{essay.essayText}</div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => setShowComments(!showComments)}>
              {showComments ? "Hide Comments" : "Show Comments"}
            </Button>
          </CardFooter>
        </Card>

        {showComments && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Comments ({essay.comments})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {essay.comments > 0 ? (
                <CommentList essayId={essay.id} showComments={showComments} />
              ) : (
                <div className="text-center text-sm text-muted-foreground py-2">
                  No comments yet. Be the first to comment!
                </div>
              )}

              <ReplyInput
                essayId={essay.id}
                parentId={key}
              />
            </CardContent>
          </Card>
        )}
      </div>

      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Your IELTS Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center mb-4">
              <div className="text-5xl font-bold">{essay.band.toFixed(1)}</div>
              <p className="text-sm text-muted-foreground mt-1">Overall Band Score</p>
            </div>

            <div className="space-y-4">
              <ScoreDetail title="Task Response"
                score={data?.essayTaskTwoScoreResponse.result.scores.taskResponse.band ?? 0} />
              <ScoreDetail title="Coherence & Cohesion" score={data?.essayTaskTwoScoreResponse.result.scores.coherenceAndCohesion.band ?? 0} />
              <ScoreDetail title="Lexical Resource" score={data?.essayTaskTwoScoreResponse.result.scores.lexicalResource.band ?? 0} />
              <ScoreDetail title="Grammatical Range & Accuracy" score={data?.essayTaskTwoScoreResponse.result.scores.grammaticalRangeAndAccuracy.band ?? 0} />
            </div>

            <div className="bg-muted p-3 rounded-md">
              <h3 className="font-medium mb-2">Feedback</h3>
              <p className="text-sm">
                {data?.essayTaskTwoScoreResponse.result.overallFeedback || "No feedback available."}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Improvement Tips</h3>
              <ul className="list-disc pl-5 space-y-2">
                {data?.essayTaskTwoScoreResponse.result.improvementTips.map((tip, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <Button variant="outline" className="w-full" disabled={essay.band < 5 && !essay.visibility}>
                {essay.visibility === 'PUBLIC' ? "Make Private" : "Make Public"}
              </Button>
              {essay.band < 5 && essay.visibility === 'PRIVATE' && (
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  Essays with a band score below 5 cannot be shared publicly.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

