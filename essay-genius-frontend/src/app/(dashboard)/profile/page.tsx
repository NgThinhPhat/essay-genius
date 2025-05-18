"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search, Filter, ThumbsUp, MessageSquare, Send, Trash2 } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { useCurrentUser } from "@/hooks/use-current-user"

export default function Profile() {
  // Mock data for user essays
  const [userEssays, setUserEssays] = useState([
    {
      id: 1,
      title: "Task 2: Education Systems",
      prompt:
        "Some people believe that students should be allowed to evaluate and criticize their teachers to improve education quality. Others think this would lead to loss of respect and discipline in the classroom. Discuss both views and give your opinion.",
      essay:
        "The question of whether students should be permitted to evaluate their teachers has become increasingly relevant in modern educational discourse. While some argue that student feedback is essential for improving teaching quality, others contend that it undermines teacher authority. This essay will examine both perspectives before presenting my own view.\n\nProponents of student evaluations argue that they provide valuable insights into teaching effectiveness that might otherwise remain hidden. Students, as the direct recipients of education, can offer unique perspectives on a teacher's clarity, engagement techniques, and accessibility. This feedback loop allows educators to identify their strengths and weaknesses, potentially leading to improved teaching methods. Furthermore, involving students in the evaluation process may increase their engagement and investment in their education, fostering a more collaborative learning environment.\n\nConversely, critics worry that empowering students to critique teachers could erode classroom discipline and respect. They argue that the traditional teacher-student hierarchy exists for good reason: teachers possess the expertise and experience necessary to guide learning effectively. Allowing students—who lack pedagogical training—to judge teaching methods might undermine teacher confidence and authority. Additionally, student evaluations may be influenced by popularity rather than teaching quality, potentially rewarding lenient grading or entertaining teaching over rigorous education.\n\nIn my assessment, a balanced approach is most beneficial. I believe that student feedback can significantly enhance educational quality when implemented thoughtfully. However, evaluations should be structured to focus on specific aspects of teaching rather than general popularity. Anonymous feedback systems can encourage honest responses while protecting both students and teachers. Most importantly, student evaluations should be just one component of a comprehensive teacher assessment system that also includes peer review, self-reflection, and administrative observation.\n\nIn conclusion, while student evaluations carry potential risks to classroom dynamics, their benefits to educational improvement outweigh these concerns when properly implemented. The key lies in creating evaluation systems that respect teacher expertise while genuinely valuing student perspectives, ultimately serving the shared goal of educational excellence.",
      score: 7.5,
      date: "April 6, 2025",
      isPublic: false,
      likes: 0,
      comments: [],
    },
    {
      id: 2,
      title: "Task 1: Line Graph Analysis",
      prompt:
        "The line graph below shows changes in the amount and type of fast food consumed by Australian teenagers from 1975 to 2000. Summarize the information by selecting and reporting the main features and make comparisons where relevant.",
      essay:
        "The line graph illustrates the consumption patterns of three categories of fast food—pizza, hamburgers, and fish and chips—among Australian adolescents over a 25-year period from 1975 to 2000.\n\nIn 1975, fish and chips was clearly the dominant fast food choice, consumed approximately 100 times per year. Hamburgers ranked second with about 60 annual servings, while pizza consumption was minimal at just 5 times yearly.\n\nOver the subsequent decade, fish and chips consumption declined dramatically to roughly 40 servings per year by 1985. Conversely, hamburger consumption rose steadily, surpassing fish and chips around 1978 and reaching about 80 annual servings by 1985. Pizza consumption increased gradually but remained the least popular option at approximately 20 servings per year.\n\nThe period from 1985 to 2000 saw significant shifts in preference. Fish and chips consumption continued its downward trend, falling to just 30 annual servings by 2000. Hamburger consumption plateaued around 1985 before declining slightly to 70 servings per year by 2000. Most notably, pizza consumption rose sharply, overtaking fish and chips around 1990 and nearly equaling hamburgers by 2000 with approximately 65 annual servings.\n\nOverall, the data reveals a substantial transformation in Australian teenagers' fast food preferences. While fish and chips experienced a continuous decline throughout the period, hamburgers rose to prominence in the early years before stabilizing. Pizza showed the most dramatic change, evolving from the least consumed option to nearly the most popular by the end of the period. These trends likely reflect changing tastes, cultural influences, and the increasing availability of diverse fast food options in Australia.",
      score: 8.0,
      date: "April 4, 2025",
      isPublic: true,
      likes: 12,
      comments: [
        {
          id: 201,
          user: {
            name: "David Park",
            avatar: "/placeholder.svg?height=32&width=32",
            initials: "DP",
          },
          text: "Your analysis of the trends is very clear. I'm preparing for my IELTS and this is really helpful!",
          likes: 4,
          time: "5 hours ago",
        },
        {
          id: 202,
          user: {
            name: "Sarah Chen",
            avatar: "/placeholder.svg?height=32&width=32",
            initials: "SC",
          },
          text: "I like how you've organized the information chronologically. Makes it easy to follow the changes over time.",
          likes: 2,
          time: "3 hours ago",
        },
      ],
    },
    {
      id: 3,
      title: "Task 2: Work-Life Balance",
      prompt:
        "Some people think that it is important to have a single career for life, while others think that it is better to have a series of jobs in a lifetime. Discuss both views and give your opinion.",
      essay:
        "The debate between pursuing a single lifelong career versus experiencing multiple jobs throughout one's working life reflects fundamental differences in perspectives on professional fulfillment and security. This essay will examine both viewpoints before offering my own position.\n\nAdvocates for a single career path emphasize the benefits of specialization and depth of expertise. By dedicating decades to one field, individuals can achieve mastery, building comprehensive knowledge and refined skills that might be unattainable through more varied employment. This specialization often translates to greater professional recognition, higher compensation, and increased job security. Additionally, long-term commitment to one organization can yield substantial benefits, including pension plans, accumulated seniority, and established professional networks that provide stability throughout one's working life and into retirement.\n\nConversely, proponents of diverse career experiences highlight the advantages of adaptability and breadth of skills. In today's rapidly evolving economy, industries can transform or become obsolete within years rather than decades. Those with varied professional backgrounds may better navigate these changes, having developed transferable skills and the resilience to transition between roles. Furthermore, exploring different careers can lead to greater personal satisfaction as individuals discover new interests and abilities throughout their lives. This approach may also mitigate mid-life career dissatisfaction, as people can pursue fresh challenges rather than feeling trapped in an unsuitable profession.\n\nIn my assessment, the optimal approach depends largely on individual circumstances and preferences, though I believe that moderate flexibility generally offers the best balance. While complete career changes every few years might prevent the development of valuable expertise, remaining rigidly committed to a single path despite changing personal interests or market conditions seems equally problematic. I favor a middle path: developing deep expertise within a broader field while remaining open to related opportunities that allow for growth and adaptation.\n\nIn conclusion, both career approaches offer distinct advantages, and the ideal choice varies based on personal values, economic conditions, and individual industries. Rather than viewing career planning as a binary choice between absolute stability and constant change, we might better conceptualize it as finding the appropriate balance between depth and breadth that aligns with both our professional goals and personal fulfillment.",
      score: 7.0,
      date: "April 2, 2025",
      isPublic: false,
      likes: 0,
      comments: [],
    },
  ])

  const [selectedEssay, setSelectedEssay] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [bandRange, setBandRange] = useState([5.0, 9.0])
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("all")
  const [newComment, setNewComment] = useState("")
  const [showComments, setShowComments] = useState(true)

  const { data: currentUser, isLoading, isError } = useCurrentUser();

  if (isLoading) {
    return <div className="p-8">Loading profile...</div>;
  }

  if (isError) {
    return <div className="p-8 text-red-500">Failed to load user data.</div>;
  }
  const deleteEssay = (id: number) => {
    setUserEssays(userEssays.filter((essay) => essay.id !== id))
    if (selectedEssay === id) {
      setSelectedEssay(null)
    }
  }

  const handleAddComment = (essayId: number) => {
    if (!newComment.trim()) return

    const updatedEssays = userEssays.map((essay) => {
      if (essay.id === essayId) {
        return {
          ...essay,
          comments: [
            ...essay.comments,
            {
              id: Date.now(),
              user: {
                name: "You",
                avatar: "/placeholder.svg?height=32&width=32",
                initials: "ME",
              },
              text: newComment,
              likes: 0,
              time: "Just now",
            },
          ],
        }
      }
      return essay
    })

    setUserEssays(updatedEssays)
    setNewComment("")
  }

  const filteredEssays = userEssays.filter((essay) => {
    // Filter by tab
    if (activeTab === "private" && essay.isPublic) return false
    if (activeTab === "public" && !essay.isPublic) return false

    // Filter by search term
    if (searchTerm && !essay.prompt.toLowerCase().includes(searchTerm.toLowerCase())) return false

    // Filter by band score
    if (essay.score < bandRange[0] || essay.score > bandRange[1]) return false

    return true
  })

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground">Manage your account and view your essays</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1 h-fit">
          <CardContent className="p-4 space-y-4">
            {/* Avatar & Info */}
            <div className="flex flex-col items-center space-y-2">
              <Avatar style={{ width: "150px", height: "200px" }}>
                <AvatarImage
                  src={currentUser?.avatar ?? "/placeholder.svg"}
                  alt={currentUser?.firstName ?? "User Avatar"}
                  className="rounded-md"
                />
                <AvatarFallback>
                  {currentUser?.firstName?.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>

              <div className="text-center">
                <h2 className="text-xl font-semibold">{currentUser?.firstName ?? "Anonymous"} {currentUser?.lastName}</h2>
                <p className="text-muted-foreground text-sm">{currentUser?.email}</p>
              </div>
            </div>

            {/* Bio section */}
            {currentUser?.bio && (
              <div className="bg-muted p-3 rounded-md text-sm text-muted-foreground whitespace-pre-line">
                {currentUser.bio}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="bg-muted p-2 rounded-md">
                <div className="font-medium">{userEssays.length}</div>
                <div className="text-xs text-muted-foreground">Essays</div>
              </div>
              <div className="bg-muted p-2 rounded-md">
                <div className="font-medium">
                  {(userEssays.reduce((sum, essay) => sum + essay.score, 0) / userEssays.length).toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Avg. Score</div>
              </div>
              <div className="bg-muted p-2 rounded-md">
                <div className="font-medium">{userEssays.filter((e) => e.isPublic).length}</div>
                <div className="text-xs text-muted-foreground">Public</div>
              </div>
            </div>

            {/* Edit Button */}
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/profile/edit">Edit Profile & Setting</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Your Essays</CardTitle>
            <CardDescription>View and manage your submitted essays</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="all">All Essays</TabsTrigger>
                  <TabsTrigger value="private">Private</TabsTrigger>
                  <TabsTrigger value="public">Public</TabsTrigger>
                </TabsList>

                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search prompts..."
                      className="pl-8 w-[200px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Filter className="h-4 w-4" />
                        Filter
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Filter Essays</SheetTitle>
                        <SheetDescription>Adjust filters to find specific essays</SheetDescription>
                      </SheetHeader>
                      <div className="py-6 space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">Band Score Range</h3>
                          <div className="px-1">
                            <Slider
                              defaultValue={[5.0, 9.0]}
                              max={9.0}
                              min={5.0}
                              step={0.5}
                              value={bandRange}
                              onValueChange={setBandRange}
                            />
                            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                              <span>Band {bandRange[0].toFixed(1)}</span>
                              <span>Band {bandRange[1].toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">Task Type</h3>
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm">
                              Task 1
                            </Button>
                            <Button variant="outline" size="sm">
                              Task 2
                            </Button>
                          </div>
                        </div>
                      </div>
                      <SheetFooter>
                        <SheetClose asChild>
                          <Button>Apply Filters</Button>
                        </SheetClose>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              <TabsContent value="all" className="space-y-4">
                {selectedEssay !== null ? (
                  <EssayDetail
                    essay={userEssays.find((e) => e.id === selectedEssay)!}
                    onBack={() => setSelectedEssay(null)}
                    onDelete={deleteEssay}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    handleAddComment={handleAddComment}
                    showComments={showComments}
                    setShowComments={setShowComments}
                  />
                ) : (
                  <>
                    {filteredEssays.map((essay) => (
                      <EssayItem
                        key={essay.id}
                        essay={essay}
                        onView={() => setSelectedEssay(essay.id)}
                        onDelete={deleteEssay}
                      />
                    ))}

                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationLink href="#" className="gap-1">
                            <span className="sr-only">First</span>
                            <span aria-hidden="true">{"<<"}</span>
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#" isActive>
                            1
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext href="#" />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#" className="gap-1">
                            <span className="sr-only">Last</span>
                            <span aria-hidden="true">{">>"}</span>
                          </PaginationLink>
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </>
                )}
              </TabsContent>

              <TabsContent value="private" className="space-y-4">
                {selectedEssay !== null ? (
                  <EssayDetail
                    essay={userEssays.find((e) => e.id === selectedEssay)!}
                    onBack={() => setSelectedEssay(null)}
                    onDelete={deleteEssay}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    handleAddComment={handleAddComment}
                    showComments={showComments}
                    setShowComments={setShowComments}
                  />
                ) : (
                  <>
                    {filteredEssays.map((essay) => (
                      <EssayItem
                        key={essay.id}
                        essay={essay}
                        onView={() => setSelectedEssay(essay.id)}
                        onDelete={deleteEssay}
                      />
                    ))}

                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationLink href="#" className="gap-1">
                            <span className="sr-only">First</span>
                            <span aria-hidden="true">{"<<"}</span>
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#" isActive>
                            1
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext href="#" />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#" className="gap-1">
                            <span className="sr-only">Last</span>
                            <span aria-hidden="true">{">>"}</span>
                          </PaginationLink>
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </>
                )}
              </TabsContent>

              <TabsContent value="public" className="space-y-4">
                {selectedEssay !== null ? (
                  <EssayDetail
                    essay={userEssays.find((e) => e.id === selectedEssay)!}
                    onBack={() => setSelectedEssay(null)}
                    onDelete={deleteEssay}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    handleAddComment={handleAddComment}
                    showComments={showComments}
                    setShowComments={setShowComments}
                  />
                ) : (
                  <>
                    {filteredEssays.map((essay) => (
                      <EssayItem
                        key={essay.id}
                        essay={essay}
                        onView={() => setSelectedEssay(essay.id)}
                        onDelete={deleteEssay}
                      />
                    ))}

                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationLink href="#" className="gap-1">
                            <span className="sr-only">First</span>
                            <span aria-hidden="true">{"<<"}</span>
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#" isActive>
                            1
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext href="#" />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#" className="gap-1">
                            <span className="sr-only">Last</span>
                            <span aria-hidden="true">{">>"}</span>
                          </PaginationLink>
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

interface EssayItemProps {
  essay: {
    id: number
    title: string
    prompt: string
    essay: string
    score: number
    date: string
    isPublic: boolean
    likes: number
    comments: any[]
  }
  onView: () => void
  onDelete: (id: number) => void
}

function EssayItem({ essay, onView, onDelete }: EssayItemProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">{essay.title}</div>
            <div className="text-sm text-muted-foreground">{essay.date}</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {essay.score.toFixed(1)}
            </div>
            <div className="text-xs px-2 py-1 rounded-full bg-muted">{essay.isPublic ? "Public" : "Private"}</div>
            <div className="flex items-center space-x-2 text-muted-foreground text-sm">
              <div className="flex items-center">
                <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                {essay.likes}
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                {essay.comments.length}
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
          <div className="text-sm line-clamp-2">{essay.prompt}</div>
        </div>
      </CardContent>
    </Card>
  )
}

interface EssayDetailProps {
  essay: {
    id: number
    title: string
    prompt: string
    essay: string
    score: number
    date: string
    isPublic: boolean
    comments: {
      id: number
      user: {
        name: string
        avatar: string
        initials: string
      }
      text: string
      likes: number
      time: string
    }[]
  }
  onBack: () => void
  onDelete: (id: number) => void
  newComment: string
  setNewComment: (comment: string) => void
  handleAddComment: (essayId: number) => void
  showComments: boolean
  setShowComments: (show: boolean) => void
}

function EssayDetail({
  essay,
  onBack,
  onDelete,
  newComment,
  setNewComment,
  handleAddComment,
  showComments,
  setShowComments,
}: EssayDetailProps) {
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
            <CardTitle>{essay.title}</CardTitle>
            <CardDescription>{essay.date}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Prompt:</h3>
              <div className="text-sm bg-muted p-3 rounded-md">{essay.prompt}</div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Your Essay:</h3>
              <div className="text-sm whitespace-pre-line border p-3 rounded-md">{essay.essay}</div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => setShowComments(!showComments)}>
              {showComments ? "Hide Comments" : "Show Comments"}
            </Button>
            <Button variant="outline" size="sm">
              {essay.isPublic ? "Make Private" : "Make Public"}
            </Button>
          </CardFooter>
        </Card>

        {showComments && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Comments ({essay.comments.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {essay.comments.length > 0 ? (
                <div className="space-y-4">
                  {essay.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                        <AvatarFallback>{comment.user.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-muted rounded-lg p-3">
                          <div className="font-medium text-sm">{comment.user.name}</div>
                          <div className="text-sm">{comment.text}</div>
                        </div>
                        <div className="flex items-center space-x-3 mt-1 text-xs">
                          <button className="text-muted-foreground hover:text-foreground">Like</button>
                          <button className="text-muted-foreground hover:text-foreground">Reply</button>
                          <span className="text-muted-foreground">{comment.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-sm text-muted-foreground py-2">
                  No comments yet. Be the first to comment!
                </div>
              )}

              <div className="flex items-center space-x-2 pt-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex items-center space-x-2">
                  <Input
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="rounded-full bg-muted border-0"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleAddComment(essay.id)}
                    disabled={!newComment.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
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
              <div className="text-5xl font-bold">{essay.score.toFixed(1)}</div>
              <p className="text-sm text-muted-foreground mt-1">Overall Band Score</p>
            </div>

            <div className="space-y-4">
              <ScoreDetail title="Task Response" score={7.5} />
              <ScoreDetail title="Coherence & Cohesion" score={7.0} />
              <ScoreDetail title="Lexical Resource" score={8.0} />
              <ScoreDetail title="Grammatical Range & Accuracy" score={7.5} />
            </div>

            <div className="bg-muted p-3 rounded-md">
              <h3 className="font-medium mb-2">Feedback</h3>
              <p className="text-sm">
                Your essay demonstrates a good understanding of the topic with clear arguments. The organization is
                logical, though some transitions could be improved. You use a wide range of vocabulary with occasional
                inaccuracies. Your grammar is generally well-controlled with some complex structures. To improve, focus
                on developing your ideas more fully and using more sophisticated connecting phrases.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Improvement Tips</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li className="text-sm text-muted-foreground">
                  Provide more specific examples to support your main points.
                </li>
                <li className="text-sm text-muted-foreground">
                  Use a wider range of cohesive devices to improve the flow between paragraphs.
                </li>
                <li className="text-sm text-muted-foreground">
                  Incorporate more sophisticated vocabulary to demonstrate a broader lexical range.
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <Button variant="outline" className="w-full" disabled={essay.score < 5 && !essay.isPublic}>
                {essay.isPublic ? "Make Private" : "Make Public"}
              </Button>
              {essay.score < 5 && !essay.isPublic && (
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

function ScoreDetail({ title, score }: ScoreDetailProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium">{title}</span>
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
          <span className="font-bold">{score.toFixed(1)}</span>
        </div>
        <div className="w-24 h-2 bg-muted rounded-full mr-2 overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${(score / 9) * 100}%` }} />
        </div>
      </div>
    </div>
  )
}

interface ScoreDetailProps {
  title: string
  score: number
}

