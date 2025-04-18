"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThumbsUp, MessageSquare, Send, MoreHorizontal, Search, Filter } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

export default function ScoredEssays() {
  // Mock data for public essays
  const publicEssays = [
    {
      id: 1,
      user: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "AJ",
      },
      date: "April 5, 2025",
      prompt:
        "Many people believe that global environmental problems are too big for individuals to solve. Others think that individuals cannot solve these environmental problems unless they take action. Discuss both views and give your own opinion.",
      essay:
        "In recent decades, environmental issues have become increasingly prominent on the global agenda. While some argue that these challenges are too vast for individuals to address effectively, others maintain that individual action is essential for meaningful change. This essay will examine both perspectives before presenting my own view.\n\nOn one hand, those who believe environmental problems exceed individual capacity point to the scale of issues like climate change, deforestation, and ocean pollution. These problems span continents and require coordinated international efforts and policy changes at governmental levels. For instance, reducing carbon emissions necessitates industry-wide regulations and international agreements like the Paris Climate Accord. Individual actions, such as using public transportation or reducing plastic consumption, may seem insignificant against the backdrop of industrial pollution and corporate environmental damage.\n\nConversely, proponents of individual action argue that collective change begins with personal responsibility. They contend that when millions of people modify their behavior—by recycling, conserving energy, or adopting plant-based diets—the cumulative impact becomes substantial. Furthermore, individual choices influence market demands, potentially shifting corporate practices toward sustainability. The growing consumer preference for eco-friendly products has already prompted many companies to adopt greener manufacturing processes and packaging.\n\nIn my opinion, addressing environmental challenges requires a multi-faceted approach incorporating both individual and institutional action. While I acknowledge that the scale of global environmental problems necessitates governmental and corporate involvement, I believe individual actions remain crucial. Personal choices not only contribute directly to environmental protection but also demonstrate public support for broader policy changes. When citizens prioritize environmental concerns in their daily lives, they are more likely to vote for environmentally conscious politicians and support organizations advocating for systemic change.\n\nIn conclusion, although global environmental problems are indeed massive in scale, the solution lies in coordinated efforts at all levels—from individual households to international governing bodies. By recognizing the complementary nature of personal and institutional responsibility, we can work toward more effective environmental stewardship.",
      score: 8.0,
      likes: 24,
      comments: [
        {
          id: 101,
          user: {
            name: "Maria Chen",
            avatar: "/placeholder.svg?height=32&width=32",
            initials: "MC",
          },
          text: "This is an excellent essay! I particularly liked your balanced approach to discussing both viewpoints before presenting your own opinion.",
          likes: 5,
          time: "2 hours ago",
        },
        {
          id: 102,
          user: {
            name: "James Wilson",
            avatar: "/placeholder.svg?height=32&width=32",
            initials: "JW",
          },
          text: "Your vocabulary usage is impressive. Could you share some tips on how you developed such a wide range of lexical resources?",
          likes: 3,
          time: "1 hour ago",
        },
      ],
    },
    {
      id: 2,
      user: {
        name: "Sarah Miller",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "SM",
      },
      date: "April 3, 2025",
      prompt:
        "The bar chart below shows the percentage of people using different types of transportation to travel to work in a European city in 1990, 2000 and 2010. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
      essay:
        "The bar chart illustrates changes in the preferred modes of transportation for commuting to work in a European city across three decades: 1990, 2000, and 2010.\n\nIn 1990, private cars were the dominant form of transport, used by approximately 35% of commuters. Public buses ranked second at around 27%, followed by trains at 20%. Cycling was less popular, chosen by only 10% of people, while walking was the least common method at 8%.\n\nBy 2000, a significant shift had occurred. Car usage decreased to 29%, while train travel increased substantially to 28%. Bus ridership declined slightly to 25%. Notably, cycling gained popularity, rising to 13%, and walking remained relatively stable at 5%.\n\nThe most dramatic changes appeared in 2010. Train usage surged to become the primary mode of transportation at 35%, surpassing cars which fell further to 23%. Bus usage continued its downward trend to 20%. Both cycling and walking saw increases, reaching 15% and 7% respectively.\n\nOverall, the data reveals a clear trend away from private vehicles toward public transportation, particularly trains, over the twenty-year period. This shift likely reflects growing environmental awareness and improvements in public transport infrastructure. Additionally, the gradual increase in cycling suggests a growing preference for healthier and more environmentally friendly commuting options.",
      score: 7.5,
      likes: 18,
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
      ],
    },
    {
      id: 3,
      user: {
        name: "Priya Sharma",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "PS",
      },
      date: "April 1, 2025",
      prompt:
        "Some people think that technology is making education less personal and interactive. Others believe that technology is creating new ways for people to connect and learn from each other. Discuss both views and give your opinion.",
      essay:
        "The integration of technology in education has sparked debate regarding its impact on personal interaction and learning experiences. While some argue that digital tools diminish the human element of education, others contend that they create novel opportunities for connection and collaborative learning. This essay will examine both perspectives before offering my viewpoint.\n\nCritics of educational technology argue that digital interfaces create barriers between students and teachers. Traditional classroom settings facilitate immediate face-to-face interactions, allowing teachers to observe non-verbal cues and adjust their approach accordingly. In contrast, online learning platforms may limit these spontaneous exchanges and reduce education to content consumption rather than dynamic discussion. Additionally, excessive screen time can lead to social isolation and diminished interpersonal skills, particularly among younger students who are still developing these abilities.\n\nConversely, proponents highlight how technology enables unprecedented connectivity in education. Digital platforms allow students from diverse geographical locations to collaborate on projects, sharing perspectives that would be impossible in traditional settings. Features like video conferencing, interactive whiteboards, and real-time document editing create engaging virtual classrooms. Furthermore, shy students often find their voice in digital discussions, participating more actively than they might in person. Educational technology also facilitates personalized learning experiences tailored to individual needs and pace.\n\nIn my assessment, technology's impact on educational interaction depends largely on implementation rather than the tools themselves. When used thoughtfully as a complement to human instruction rather than a replacement, technology can enhance educational experiences. I believe the most effective approach combines digital innovation with meaningful human connection. For instance, a blended learning model might utilize online resources for content delivery while preserving in-person sessions for discussion and collaborative activities.\n\nIn conclusion, while concerns about technology reducing personal interaction in education are valid, the potential for creating new forms of meaningful connection is equally significant. The key lies in balancing technological efficiency with human engagement, ensuring that digital tools serve to enhance rather than replace the essential interpersonal elements of learning.",
      score: 7.0,
      likes: 15,
      comments: [],
    },
  ]

  const [searchTerm, setSearchTerm] = useState("")
  const [bandRange, setBandRange] = useState([5.0, 9.0])
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="space-y-4 mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Public Scored Essays</h1>
        <p className="text-muted-foreground">Browse essays shared by other users</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by keywords in prompt..."
            className="pl-8"
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

      <div className="space-y-8">
        {publicEssays.map((essay) => (
          <EssayPost key={essay.id} essay={essay} />
        ))}
      </div>

      <Pagination className="mt-8">
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
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">4</PaginationLink>
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
    </main>
  )
}

interface EssayPostProps {
  essay: {
    id: number
    user: {
      name: string
      avatar: string
      initials: string
    }
    date: string
    prompt: string
    essay: string
    score: number
    likes: number
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
}

function EssayPost({ essay }: EssayPostProps) {
  const [showFullEssay, setShowFullEssay] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [liked, setLiked] = useState(false)

  const toggleLike = () => {
    setLiked(!liked)
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
    essay.essay.length > 300 && !showFullEssay ? `${essay.essay.substring(0, 300)}...` : essay.essay

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={essay.user.avatar || "/placeholder.svg"} alt={essay.user.name} />
              <AvatarFallback>{essay.user.initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{essay.user.name}</div>
              <div className="text-xs text-muted-foreground">{essay.date}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              Score: {essay.score.toFixed(1)}
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
          <div className="text-sm bg-muted p-3 rounded-md">{essay.prompt}</div>
        </div>

        <div className="mb-4">
          <div className="font-medium mb-2">Essay:</div>
          <div className="text-sm whitespace-pre-line">{truncatedEssay}</div>
          {essay.essay.length > 300 && (
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
              className={`flex items-center space-x-1 ${liked ? "text-primary" : ""}`}
              onClick={toggleLike}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{liked ? essay.likes + 1 : essay.likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageSquare className="h-4 w-4" />
              <span>{essay.comments.length}</span>
            </Button>
          </div>
        </div>

        {showComments && (
          <div className="mt-4 space-y-4">
            <div className="border-t pt-4">
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
            </div>

            <div className="flex items-center space-x-2">
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
                <Button size="icon" variant="ghost" onClick={handleComment} disabled={!newComment.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

