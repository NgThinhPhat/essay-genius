import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ScoredEssays() {
  // Mock data for public essays
  const publicEssays = [
    {
      id: 1,
      title: "Task 2: Environmental Protection",
      score: 8.0,
      date: "April 5, 2025",
      excerpt: "Many people believe that global environmental problems are too big for individuals to solve...",
    },
    {
      id: 2,
      title: "Task 1: Bar Chart Analysis",
      score: 7.5,
      date: "April 3, 2025",
      excerpt: "The bar chart illustrates the percentage of people using different types of transportation...",
    },
    {
      id: 3,
      title: "Task 2: Technology in Education",
      score: 7.0,
      date: "April 1, 2025",
      excerpt: "Some people think that technology is making education less personal and interactive...",
    },
  ]

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-4 mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Public Scored Essays</h1>
        <p className="text-muted-foreground">Browse essays shared by other users</p>
      </div>

      <div className="space-y-6">
        {publicEssays.map((essay) => (
          <Card key={essay.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">{essay.title}</CardTitle>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  Score: {essay.score.toFixed(1)}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{essay.date}</p>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3">{essay.excerpt}</p>
              <div className="mt-4">
                <a href={`/scored-essays/${essay.id}`} className="text-primary text-sm font-medium hover:underline">
                  Read full essay →
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}

