import { MessageSquare, ThumbsUp, Trash2 } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@radix-ui/react-alert-dialog"
import { AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog"
import { EssayScoredResponse } from "@/constracts/essay.constract"
interface EssayItemProps {
  essay: EssayScoredResponse
  onView: () => void
  onDelete: (id: string) => void
}

export function EssayItem({ essay, onView, onDelete }: EssayItemProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Task2</div>
            <div className="text-sm text-muted-foreground">{essay.createdAt}</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {essay.band.toFixed(1)}
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground text-sm">
              <div className="flex items-center">
                <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                {essay.stars}
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                {essay.comments}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onView}>
              View
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
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
        </div>
        <div className="mt-3">
          <div className="text-sm line-clamp-2">{essay.promptText}</div>
        </div>
      </CardContent>
    </Card>
  )
}
