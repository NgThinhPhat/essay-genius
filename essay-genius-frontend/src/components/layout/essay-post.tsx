import { EssayScoredResponse } from "@/constracts/essay.constract"
import { useState } from "react"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Button } from "../ui/button"
import { MessageSquare, MoreHorizontal, Star } from "lucide-react"

export default function EssayPost({ essayPost: essayPost }: { essayPost: EssayScoredResponse }) {
  const [showFullEssay, setShowFullEssay] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [stared, setStared] = useState(false)

  const toggleStar = () => {
    setStared(!stared)
  }

  const handleComment = () => {
    if (newComment.trim()) {
      // In a real app, this would send the comment to an API
      setNewComment("")
      // Force showing comments after posting
      setShowComments(true)
    }
  }

  const truncatedEssay =
    essayPost.essayText.length > 300 && !showFullEssay ? `${essayPost.essayText.substring(0, 300)}...` : essayPost.essayText

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={essayPost.user.avatar || "/placeholder.svg"} alt={essayPost.user.firstName + essayPost.user.lastName} />
              <AvatarFallback>{essayPost.user.firstName.substring(0, 1)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{essayPost.user.firstName}</div>
              <div className="text-xs text-muted-foreground">{essayPost.createdAt}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              Score: {essayPost.band.toFixed(1)}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Save</DropdownMenuItem>
                <DropdownMenuItem>Report</DropdownMenuItem>
                <DropdownMenuItem>Share</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4">
          <div className="font-medium mb-2">Prompt:</div>
          <div className="text-sm bg-muted p-3 rounded-md">{essayPost.promptText}</div>
        </div>

        <div className="mb-4">
          <div className="font-medium mb-2">Essay:</div>
          <div className="text-sm whitespace-pre-line">{truncatedEssay}</div>
          {essayPost.essayText.length > 300 && (
            <Button variant="link" className="p-0 h-auto text-primary" onClick={() => setShowFullEssay(!showFullEssay)}>
              {showFullEssay ? "Show less" : "Read more"}
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center space-x-1 ${stared ? "text-yellow-500" : ""}`}
              onClick={toggleStar}
            >
              <Star className={`h-4 w-4 ${stared ? "text-yellow-500" : "text-gray-400"}`} />
              <span>{stared ? essayPost.stars + 1 : essayPost.stars}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageSquare className="h-4 w-4" />
              <span>{essayPost.comments}</span>
            </Button>
          </div>
        </div>

        {/* {showComments && ( */}
        {/*   <div className="mt-4 space-y-4"> */}
        {/*     <div className="border-t pt-4"> */}
        {/*       {essayPost.comments> 0 ? ( */}
        {/*         <div className="space-y-4"> */}
        {/*           {essayPost.comments.map((comment) => ( */}
        {/*             <div key={comment.id} className="flex space-x-2"> */}
        {/*               <Avatar className="h-8 w-8"> */}
        {/*                 <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} /> */}
        {/*                 <AvatarFallback>{comment.user.initials}</AvatarFallback> */}
        {/*               </Avatar> */}
        {/*               <div className="flex-1"> */}
        {/*                 <div className="bg-muted rounded-lg p-3"> */}
        {/*                   <div className="font-medium text-sm">{comment.user.name}</div> */}
        {/*                   <div className="text-sm">{comment.text}</div> */}
        {/*                 </div> */}
        {/*                 <div className="flex items-center space-x-3 mt-1 text-xs"> */}
        {/*                   <button className="text-muted-foreground hover:text-foreground">Star</button> */}
        {/*                   <button className="text-muted-foreground hover:text-foreground">Reply</button> */}
        {/*                   <span className="text-muted-foreground">{comment.time}</span> */}
        {/*                 </div> */}
        {/*               </div> */}
        {/*             </div> */}
        {/*           ))} */}
        {/*         </div> */}
        {/*       ) : ( */}
        {/*         <div className="text-center text-sm text-muted-foreground py-2"> */}
        {/*           No comments yet. Be the first to comment! */}
        {/*         </div> */}
        {/*       )} */}
        {/*     </div> */}
        {/**/}
        {/*     <div className="flex items-center space-x-2"> */}
        {/*       <Avatar className="h-8 w-8"> */}
        {/*         <AvatarFallback>ME</AvatarFallback> */}
        {/*       </Avatar> */}
        {/*       <div className="flex-1 flex items-center space-x-2"> */}
        {/*         <Input */}
        {/*           placeholder="Write a comment..." */}
        {/*           value={newComment} */}
        {/*           onChange={(e) => setNewComment(e.target.value)} */}
        {/*           className="rounded-full bg-muted border-0" */}
        {/*         /> */}
        {/*         <Button size="icon" variant="ghost" onClick={handleComment} disabled={!newComment.trim()}> */}
        {/*           <Send className="h-4 w-4" /> */}
        {/*         </Button> */}
        {/*       </div> */}
        {/*     </div> */}
        {/*   </div> */}
        {/* )} */}
      </CardContent>
    </Card>
  )
}
