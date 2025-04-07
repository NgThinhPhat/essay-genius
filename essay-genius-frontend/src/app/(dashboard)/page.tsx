"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"


export default function Home() {
  const [taskType, setTaskType] = useState<string>("task2")
  const [prompt, setPrompt] = useState<string>("")
  const [essay, setEssay] = useState<string>("")
  const [saveType, setSaveType] = useState<string>("private")

  const handleSubmit = () => {
    // Validation or API call can be added here
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-4 mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">IELTS Writing AI Examiner</h1>
        <p className="text-muted-foreground">Enter your prompt and essay to get your estimated band score</p>
      </div>

      {/* Submit Essay Form */}
      <Card>
        <CardHeader>
          <CardTitle>Submit Your Essay</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="task-type">Task Type</Label>
            <Select value={taskType} onValueChange={setTaskType}>
              <SelectTrigger id="task-type">
                <SelectValue placeholder="Select task type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="task1">Task 1</SelectItem>
                <SelectItem value="task2">Task 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Essay Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Enter the essay prompt here..."
              className="min-h-[100px]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="essay">Your Essay</Label>
            <Textarea
              id="essay"
              placeholder="Write your essay here..."
              className="min-h-[200px]"
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
            />
          </div>

          <Button className="w-full" size="lg" onClick={handleSubmit} disabled={!prompt.trim() || !essay.trim()}>
            Evaluate Essay
          </Button>
        </CardContent>
      </Card>

      {/* Response/Result Section */}
      <div className="space-y-8 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Your IELTS Writing Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <ScoreCard title="Task Response" score={7.5} />
              <ScoreCard title="Coherence & Cohesion" score={7.0} />
              <ScoreCard title="Lexical Resource" score={8.0} />
              <ScoreCard title="Grammatical Range & Accuracy" score={7.5} />
            </div>

            <div className="text-center mb-6">
              <h3 className="text-lg font-medium mb-2">Overall Band Score</h3>
              <div className="text-5xl font-bold">7.5</div>
            </div>

            <div className="bg-muted p-4 rounded-lg mb-6">
              <h3 className="font-medium mb-2">Feedback</h3>
              <p className="text-sm">
                Your essay demonstrates a good understanding of the topic with clear arguments. The organization is
                logical, though some transitions could be improved. You use a wide range of vocabulary with occasional
                inaccuracies. Your grammar is generally well-controlled with some complex structures. To improve,
                focus on developing your ideas more fully and using more sophisticated connecting phrases.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="font-medium">Save Your Essay</h3>
              <RadioGroup
                defaultValue="private"
                value={saveType}
                onValueChange={setSaveType}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private">Private</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public">Public</Label>
                </div>
              </RadioGroup>
              <Button className="w-full">Save Essay</Button>
            </div>

            <Button variant="outline" className="w-full">
              Edit Essay
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

interface ScoreCardProps {
  title: string
  score: number
}

function ScoreCard({ title, score }: ScoreCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-center">
          <h3 className="font-medium mb-1">{title}</h3>
          <div className="text-3xl font-bold">{score.toFixed(1)}</div>
        </div>
      </CardContent>
    </Card>
  )
}

