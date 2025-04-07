import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Profile() {
  // Mock data for user essays
  const userEssays = [
    {
      id: 1,
      title: "Task 2: Education Systems",
      score: 7.5,
      date: "April 6, 2025",
      isPublic: false,
    },
    {
      id: 2,
      title: "Task 1: Line Graph Analysis",
      score: 8.0,
      date: "April 4, 2025",
      isPublic: true,
    },
    {
      id: 3,
      title: "Task 2: Work-Life Balance",
      score: 7.0,
      date: "April 2, 2025",
      isPublic: false,
    },
  ]

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground">Manage your account and view your essays</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p>John Doe</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>john.doe@example.com</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Member Since</p>
              <p>April 1, 2025</p>
            </div>
            <Button variant="outline" className="w-full">
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Essays</CardTitle>
            <CardDescription>View and manage your submitted essays</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Essays</TabsTrigger>
                <TabsTrigger value="private">Private</TabsTrigger>
                <TabsTrigger value="public">Public</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                {userEssays.map((essay) => (
                  <EssayItem key={essay.id} essay={essay} />
                ))}
              </TabsContent>
              <TabsContent value="private" className="space-y-4">
                {userEssays
                  .filter((essay) => !essay.isPublic)
                  .map((essay) => (
                    <EssayItem key={essay.id} essay={essay} />
                  ))}
              </TabsContent>
              <TabsContent value="public" className="space-y-4">
                {userEssays
                  .filter((essay) => essay.isPublic)
                  .map((essay) => (
                    <EssayItem key={essay.id} essay={essay} />
                  ))}
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
    score: number
    date: string
    isPublic: boolean
  }
}

function EssayItem({ essay }: EssayItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <div className="font-medium">{essay.title}</div>
        <div className="text-sm text-muted-foreground">{essay.date}</div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          {essay.score.toFixed(1)}
        </div>
        <div className="text-xs px-2 py-1 rounded-full bg-muted">{essay.isPublic ? "Public" : "Private"}</div>
        <Button variant="ghost" size="sm">
          View
        </Button>
      </div>
    </div>
  )
}

