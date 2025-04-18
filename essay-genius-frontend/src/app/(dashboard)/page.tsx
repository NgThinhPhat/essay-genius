"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AlertCircle, Clock, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner";
import { ToastAction } from "@radix-ui/react-toast"
export default function Home() {
  const [taskType, setTaskType] = useState<string>("task2")
  const [prompt, setPrompt] = useState<string>("")
  const [essay, setEssay] = useState<string>("")
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [saveType, setSaveType] = useState<string>("private")
  // Timer related states
  const [useTimer, setUseTimer] = useState<boolean>(false)
  const [timerDuration, setTimerDuration] = useState<number>(40) // in minutes
  const [timeRemaining, setTimeRemaining] = useState<number>(40 * 60) // in seconds
  const [timerActive, setTimerActive] = useState<boolean>(false)
  const [timerExpired, setTimerExpired] = useState<boolean>(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Add this inside the component, after the existing state variables
  const [scoreData, setScoreData] = useState({
    valid: true,
    result: {
      scores: {
        taskResponse: {
          band: 7,
          explanation:
            "The essay clearly addresses the prompt and presents a well-defined position (disagreement with the statement). It provides relevant arguments against the idea that we should not try to prevent animal extinction, focusing on the role of human activities and the importance of biodiversity and ecosystems. The essay offers reasonable development of ideas, though some points could be expanded further with more specific examples.",
        },
        coherenceAndCohesion: {
          band: 7,
          explanation:
            "The essay demonstrates a clear and logical structure, with a well-defined introduction, body paragraphs addressing specific arguments, and a concise conclusion. Cohesive devices (e.g., 'However', 'In this regard', 'Other justifications', 'For example') are used effectively to link ideas and create a smooth flow. Paragraphing is appropriate, contributing to the overall coherence of the essay. The central topic is evident within each paragraph.",
        },
        lexicalResource: {
          band: 7,
          explanation:
            "The essay demonstrates a good range of vocabulary, including relevant terms related to environmental issues (e.g., 'extinction', 'natural habitats', 'food chain', 'biodiversity', 'ecosystem', 'poaching', 'endangered animals'). There is evidence of using less common vocabulary effectively. While there are no significant errors, further precision and variety in vocabulary could enhance the essay.",
        },
        grammaticalRangeAndAccuracy: {
          band: 7,
          explanation:
            "The essay exhibits a good range of grammatical structures, including complex sentences and varied sentence types. While there are minor errors, they are infrequent and do not impede understanding. The writer demonstrates a solid command of grammar.",
        },
      },
      overallBand: 7,
      overallFeedback:
        "This is a well-written essay that effectively addresses the prompt and presents a clear position with supporting arguments. The essay demonstrates a good understanding of the topic and uses relevant vocabulary and grammatical structures. The organization is logical, and cohesive devices are used appropriately. To further improve, the writer could consider expanding on some of the arguments with more specific examples or details.",
      corrections: [
        {
          mistake:
            "Industrial activities have been devastating the natural habitats of wildlife and disturbing the food chain, causing the mass extinction of countless species.",
          suggestion:
            "Industrial activities have been devastating the natural habitats of wildlife and disturbing the food chain, leading to the mass extinction of countless species.",
          explanation:
            "While 'causing' isn't strictly incorrect, 'leading to' improves the flow and emphasizes the direct consequence.",
        },
        {
          mistake: "demand for goods made from animals' products, such as skins and horns",
          suggestion: "demand for goods made from animal products, such as skins and horns",
          explanation:
            "Animal's is a singular possessive (one animal's product). Animals' is plural possessive (more than one animal, singular product). Since many animals are used, and there is no reason to pluralize the word 'product', the correct structure is animal products, which acts as a single adjective.",
        },
        {
          mistake:
            "The disappearance of many animal species does not always occur as a natural process but as a consequence of our doings.",
          suggestion:
            "The disappearance of many animal species does not always occur as a natural process but often as a consequence of our actions.",
          explanation:
            "'Doings' is less formal and specific. 'Actions' is a more appropriate and common term in academic writing.",
        },
      ],
      improvementTips: [
        "Provide More Specific Examples: While the essay mentions 'rhinos' and 'cows,' consider elaborating with specific examples of how human activities impact ecosystems or how certain animal species contribute to specific cultures.",
        "Strengthen Argumentation: Some arguments could benefit from further development. For example, when discussing the disruption of the food chain, explain the potential consequences in more detail.",
        "Enhance Vocabulary: While a good range of vocabulary is demonstrated, try to incorporate more sophisticated or less common synonyms where appropriate to demonstrate a wider command of the English language. For instance, rather than simply stating 'important', consider alternatives such as 'crucial', 'vital', or 'indispensable'.",
      ],
      rewrittenParagraph:
        "The significant role wild animals play in maintaining the delicate balance of ecosystems and enriching our lives provides further justification for their preservation. In nature, interconnectedness reigns supreme; the extinction of one species can trigger a cascade of negative consequences for numerous other animal and plant populations through the disruption of established food webs. Beyond their ecological importance, wild animals possess immense aesthetic and socio-cultural significance. They contribute to the planet's rich tapestry of biodiversity, enhancing its beauty and wonder. Furthermore, in various cultures worldwide, specific animal species hold profound symbolic meaning. For instance, in some religions, cows are revered as sacred beings, embodying values of peace and nurturing.",
    },
  })

  // Sample prompts for generation
  const samplePrompts = {
    task1: [
      "The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
      "The graph below shows the proportion of the population aged 65 and over between 1940 and 2040 in three different countries. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
      "The diagrams below show the life cycle of the silkworm and the stages in the production of silk cloth. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
    ],
    task2: [
      "Some people believe that unpaid community service should be a compulsory part of high school education. To what extent do you agree or disagree?",
      "In some countries, many more people are choosing to live alone nowadays than in the past. Do you think this is a positive or negative development?",
      "Some people think that all university students should study whatever they like. Others believe that they should only be allowed to study subjects that will be useful in the future, such as those related to science and technology. Discuss both these views and give your own opinion.",
    ],
  }

  const generatePrompt = () => {
    const prompts = taskType === "task1" ? samplePrompts.task1 : samplePrompts.task2
    const randomIndex = Math.floor(Math.random() * prompts.length)
    setPrompt(prompts[randomIndex])
  }

  const startTimer = () => {
    if (timerActive) return

    setTimerActive(true)
    setTimeRemaining(timerDuration * 60)

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout)
          setTimerExpired(true)
          setTimerActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setTimerActive(false)
  }

  const resetTimer = () => {
    stopTimer()
    setTimeRemaining(timerDuration * 60)
    setTimerExpired(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Modify the handleSubmit function to show a toast for invalid essays
  const handleSubmit = () => {
    if (prompt.trim() && essay.trim()) {
      setSubmitted(true)
      stopTimer()

      // Simulate validation - in a real app this would come from the API
      if (!scoreData.valid) {
        toast(scoreData.result + "")
      }
    }
  }

  const handleEdit = () => {
    setSubmitted(false)
    resetTimer()
    setScoreData({ valid: false, result: null })
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (timerExpired) {
      handleSubmit()
    }
  }, [timerExpired])

  // Add a function to simulate toggling between valid and invalid for testing
  const toggleValidation = () => {
    if (scoreData.valid) {
      setScoreData({
        valid: false,
        result: "Essay does not address the question. The essay consists of only gibberish.",
      })
    } else {
      setScoreData({
        valid: true,
        result: {
          scores: {
            taskResponse: {
              band: 7,
              explanation: "The essay clearly addresses the prompt and presents a well-defined position...",
            },
            coherenceAndCohesion: {
              band: 7,
              explanation: "The essay demonstrates a clear and logical structure...",
            },
            lexicalResource: {
              band: 7,
              explanation: "The essay demonstrates a good range of vocabulary...",
            },
            grammaticalRangeAndAccuracy: {
              band: 7,
              explanation: "The essay exhibits a good range of grammatical structures...",
            },
          },
          overallBand: 7,
          overallFeedback: "This is a well-written essay that effectively addresses the prompt...",
          corrections: [
            {
              mistake: "Industrial activities have been devastating...",
              suggestion: "Industrial activities have been devastating...",
              explanation: "While 'causing' isn't strictly incorrect...",
            },
          ],
          improvementTips: ["Provide More Specific Examples: While the essay mentions 'rhinos' and 'cows,'..."],
          rewrittenParagraph: "The significant role wild animals play in maintaining...",
        },
      })
    }
  }
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-4 mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">IELTS Writing AI Examiner</h1>
        <p className="text-muted-foreground">Enter your prompt and essay to get your estimated band score</p>
      </div>

      {!submitted ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Submit Your Essay</CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="use-timer" className="text-sm">Use Timer</Label>
              <Switch id="use-timer" checked={useTimer} onCheckedChange={setUseTimer} />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {useTimer && (
              <div className="space-y-3 p-3 bg-muted rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Time Remaining: {formatTime(timeRemaining)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select
                      value={timerDuration.toString()}
                      onValueChange={(value) => {
                        setTimerDuration(Number.parseInt(value));
                        setTimeRemaining(Number.parseInt(value) * 60);
                      }}
                      disabled={timerActive}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20">20 min</SelectItem>
                        <SelectItem value="30">30 min</SelectItem>
                        <SelectItem value="40">40 min</SelectItem>
                        <SelectItem value="60">60 min</SelectItem>
                      </SelectContent>
                    </Select>
                    {!timerActive ? (
                      <Button size="sm" onClick={startTimer} disabled={timerExpired}>Start</Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={stopTimer}>Pause</Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={resetTimer} disabled={timerActive}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Progress value={(timeRemaining / (timerDuration * 60)) * 100} />
                {timeRemaining < 300 && timeRemaining > 0 && timerActive && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Less than 5 minutes remaining!</AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="task-type">Task Type</Label>
                <Button variant="outline" size="sm" onClick={generatePrompt} className="text-xs">Generate Prompt</Button>
              </div>
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
                disabled={timerExpired}
              />
              {timerExpired && (
                <p className="text-sm text-destructive">Time has expired. You can no longer edit your essay.</p>
              )}
            </div>

            <Button className="w-full" size="lg" onClick={handleSubmit} disabled={!prompt.trim() || !essay.trim()}>
              Evaluate Essay
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Essay</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Prompt:</h3>
                  <div className="text-sm bg-muted p-3 rounded-md">{prompt}</div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Your Response:</h3>
                  <div className="text-sm whitespace-pre-line border p-3 rounded-md">{essay}</div>
                </div>
                <Button variant="outline" className="w-full" onClick={handleEdit}>Edit Essay</Button>
              </CardContent>
            </Card>

            {scoreData && scoreData.valid && (
              <Card>
                <CardHeader>
                  <CardTitle>Score and Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Overall Band Score: {scoreData.result.overallBand}</h3>
                    <p>{scoreData.result.overallFeedback}</p>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(scoreData.result.scores).map(([criteria, score], index) => (
                      <div key={index}>
                        <h4 className="font-medium">{criteria.replace(/([A-Z])/g, ' $1')}</h4>
                        <p>Band: {score.band} ({score.explanation})</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Improvement Tips</h4>
                    <ul className="space-y-1">
                      {scoreData.result.improvementTips.map((tip, index) => (
                        <li key={index} className="text-sm">{tip}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Corrections</h4>
                    <div className="space-y-4">
                      {scoreData.result.corrections.map((correction, index) => (
                        <div key={index} className="bg-muted p-3 rounded-md space-y-1">
                          <p className="text-sm">
                            <span className="font-semibold">Original:</span> {correction.original}
                          </p>
                          <p className="text-sm">
                            <span className="font-semibold">Suggestion:</span> {correction.suggestion}
                          </p>
                          {correction.explanation && (
                            <p className="text-sm text-muted-foreground">
                              <span className="font-semibold">Explanation:</span> {correction.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

interface ScoreDetailProps {
  title: string
  score: number
}

function ScoreDetail({ title, score }: ScoreDetailProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium">{title}</span>
      <div className="flex items-center">
        <div className="w-24 h-2 bg-muted rounded-full mr-2 overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${(score / 9) * 100}%` }} />
        </div>
        <span className="font-medium">{score.toFixed(1)}</span>
      </div>
    </div>
  )
}

