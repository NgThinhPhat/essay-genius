"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { Slider } from "@/components/ui/slider"
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
import Link from "next/link"
import { useCurrentUser } from "@/hooks/use-current-user"
import { queryOptions, useQuery } from "@tanstack/react-query"
import { listEssayResponseSchema } from "@/constracts/essay.constract"
import { api } from "@/lib/api"
import { EssayTabContent } from "@/components/layout/essay-tab-content"
import { useComments } from "@/hooks/mutations/interaction.mutation"

const getEssaysQueryOptions = ({
  searchTerm,
  bandRange,
  currentPage,
  visibility,
}: {
  searchTerm: string;
  bandRange: [number, number];
  currentPage: number;
  visibility: string;
}) =>
  queryOptions({
    queryKey: ["essays", searchTerm, bandRange, currentPage, visibility],
    queryFn: async () => {
      const { status, body } = await api.essay.getEssays({
        query: {
          promptText: searchTerm || undefined,
          bandFrom: bandRange[0],
          bandTo: bandRange[1],
          page: currentPage - 1,
          size: 6,
          ownByCurrentUser: true,
          visibility:
            visibility === "all"
              ? undefined
              : (visibility.toUpperCase() as "PUBLIC" | "PRIVATE"),
        },
      });

      switch (status) {
        case 200:
          return listEssayResponseSchema.parse(body);
        default:
          throw new Error(body?.message || "Failed to fetch essays");
      }
    },
    enabled: true,
    retry: false,
    refetchOnWindowFocus: false,
  });

export default function Profile() {
  const [selectedEssay, setSelectedEssay] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [bandRange, setBandRange] = useState<[number, number]>([5.0, 9.0]);
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("all")
  const [newComment, setNewComment] = useState("")
  const [showComments, setShowComments] = useState(true)

  const { data: currentUser, isLoading, isError } = useCurrentUser();

  const { data: essayData, isLoading: essayLoading, error } = useQuery(
    getEssaysQueryOptions({ searchTerm, bandRange, currentPage, visibility: activeTab }),
  );

  const userEssays = essayData?.content || [];
  const totalPages = essayData?.totalPages || 1;
  const totalElements = essayData?.totalElements || 0;

  if (isLoading) {
    return <div className="p-8">Loading profile...</div>;
  }

  if (isError) {
    return <div className="p-8 text-red-500">Failed to load user data.</div>;
  }

  const deleteEssay = (id: string) => {

  }

  const handleAddComment = (essayId: string) => {
    if (!newComment.trim()) return
    setNewComment("")
  }

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
            <div className="grid grid-cols- gap-2 text-center text-sm">
              <div className="bg-muted p-2 rounded-md">
                <div className="font-medium">{totalElements}</div>
                <div className="text-xs text-muted-foreground">Essays</div>
              </div>
              <div className="bg-muted p-2 rounded-md">
                <div className="font-medium">
                  {
                    userEssays.length > 0
                      ? (userEssays.reduce((sum, essay) => sum + essay.band, 0) / userEssays.length).toFixed(1)
                      : "-"
                  }
                </div>
                <div className="text-xs text-muted-foreground">Avg. Score</div>
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
            <Tabs defaultValue="all" className="space-y-4" onValueChange={(tab) => {
              setSelectedEssay(null)
              setActiveTab(tab);
              setCurrentPage(1);
            }}>
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
                              onValueChange={(val: number[]) => setBandRange([val[0], val[1]])}
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

              {["all", "private", "public"].map((tab) => (
                <TabsContent key={tab} value={tab} className="space-y-4">
                  <EssayTabContent
                    selectedEssay={selectedEssay}
                    setSelectedEssay={setSelectedEssay}
                    userEssays={userEssays}
                    tab={tab}
                    deleteEssay={deleteEssay}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    handleAddComment={handleAddComment}
                    showComments={showComments}
                    setShowComments={setShowComments}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
