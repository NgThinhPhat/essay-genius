import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { AlertCircle, Clock, Loader2, RefreshCw, Sparkles } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner";
import { FormProvider, useForm } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useMutation } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { EssayResponseWrapperObject, EssaySaveRequestSchema, EssayTaskTwoScoringRequest, essayTaskTwoScoringRequestSchema, GenerateEssayPromptRequest } from "@/constracts/essay.constract"
import { api } from "@/lib/api"
import SaveEssay from "./save-essay"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "../ui/input"
import { Label } from "@radix-ui/react-label"

export default function EssayScoringForm() {
  const [taskType, setTaskType] = useState<string>("task2")
  const [submitted, setSubmitted] = useState<boolean>(false)
  // Timer related states
  const [useTimer, setUseTimer] = useState<boolean>(false)
  const [timerDuration, setTimerDuration] = useState<number>(40) // in minutes
  const [timeRemaining, setTimeRemaining] = useState<number>(40 * 60) // in seconds
  const [timerActive, setTimerActive] = useState<boolean>(false)
  const [timerExpired, setTimerExpired] = useState<boolean>(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [saveData, setSaveData] = useState<EssaySaveRequestSchema>(null)
  const [selectedTopic, setSelectedTopic] = useState<string>("any")
  const [topicDialogOpen, setTopicDialogOpen] = useState(false)
  const [customTopic, setCustomTopic] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [scoreData, setScoreData] = useState<EssayResponseWrapperObject | null>(null);
  const form = useForm<EssayTaskTwoScoringRequest>({
    resolver: zodResolver(essayTaskTwoScoringRequestSchema),
  });
  const topicCategories = {
    task1: [
      { id: "line-graphs", name: "Line Graphs" },
      { id: "bar-charts", name: "Bar Charts" },
      { id: "pie-charts", name: "Pie Charts" },
      { id: "tables", name: "Tables" },
      { id: "maps", name: "Maps" },
      { id: "process-diagrams", name: "Process Diagrams" },
      { id: "mixed-charts", name: "Mixed Charts" },
    ],
    task2: [
      { id: "education", name: "Education" },
      { id: "technology", name: "Technology" },
      { id: "environment", name: "Environment" },
      { id: "health", name: "Health" },
      { id: "work", name: "Work & Careers" },
      { id: "society", name: "Society" },
      { id: "government", name: "Government & Law" },
      { id: "crime", name: "Crime & Punishment" },
      { id: "media", name: "Media & Advertising" },
      { id: "arts", name: "Arts & Culture" },
      { id: "sports", name: "Sports & Leisure" },
      { id: "family", name: "Family & Children" },
      { id: "housing", name: "Housing & Architecture" },
      { id: "transport", name: "Transport & Travel" },
      { id: "language", name: "Language & Communication" },
    ],
  }
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    setValue
  } = form;

  const mutation = useMutation({
    mutationFn: (data: EssayTaskTwoScoringRequest) => {
      setIsScoring(true);
      return api.essay.scoring({ body: data });
    },
    onSuccess: async (response, variables) => {
      setIsScoring(false);
      switch (response.status) {
        case 200:
          setSubmitted(true);
          stopTimer();
          if (!response.body.valid) {
            toast(response.body.result + "");
            setScoreData(response.body)
          } else {
            toast("Scoring successful");
            setScoreData(response.body);
            setSaveData({
              promptText: variables.essayPrompt,
              essayText: variables.essayText,
              essayTaskTwoScoreResponse: typeof response.body.result === "string" ? null : response.body,
              visibility: "private",
            });
          }
          break;
        default:
          form.setError("root", {
            type: String(response.status),
            message: "Scoring failed",
          });
      }
    },
    onError: (error) => {
      setIsScoring(false);
      toast.error(error.message);
    },
  });
  const handleScoring = (data: EssayTaskTwoScoringRequest) => {
    mutation.mutate(data)
  }

  const generatePromptMutation = useMutation({
    mutationFn: (data: GenerateEssayPromptRequest) => {
      setIsGenerating(true);
      return api.essay.generateEssayPrompt({ body: data });
    },
    onSuccess: async (response) => {
      setIsGenerating(false);
      switch (response.status) {
        case 200:
          if (!response.body.valid) {
            toast(response.body.result + "");
          } else {
            toast("Generate successful");
            setValue("essayPrompt", response.body.result)
          }
          break;
        default:
          form.setError("root", {
            type: String(response.status),
            message: "Generate failed",
          });
      }
    },
    onError: (error) => {
      setIsGenerating(false);
      toast.error(error.message);
    },
  });

  const generatePrompt = () => {
    if (selectedTopic === "custom" && customTopic.trim()) {
      generatePromptMutation.mutate({ topics: [customTopic] })
      return
    }
    if (selectedTopic === "any") {
      generatePromptMutation.mutate({ topics: [""] })
      return
    }
    else {
      generatePromptMutation.mutate({ topics: [selectedTopic] })
    }
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

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (timerExpired) {
    }
  }, [timerExpired])

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      {!submitted || !saveData ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Submit Your Essay</CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="use-timer" className="text-sm">
                Use Timer
              </Label>
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
                        setTimerDuration(Number.parseInt(value))
                        setTimeRemaining(Number.parseInt(value) * 60)
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
                      <Button size="sm" onClick={startTimer} disabled={timerExpired}>
                        Start
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={stopTimer}>
                        Pause
                      </Button>
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
                <div className="flex space-x-2">
                  <Select value={selectedTopic} onValueChange={(value) => {
                    setSelectedTopic(value);
                    if (value === "custom") {
                      setTopicDialogOpen(true);
                    } else {
                      setCustomTopic("");
                    }
                  }}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Topic</SelectItem>
                      <SelectItem value="custom">Custom: {customTopic}</SelectItem>
                      {taskType === "task1"
                        ? topicCategories.task1.map((topic) => (
                          <SelectItem key={topic.id} value={topic.id}>
                            {topic.name}
                          </SelectItem>
                        ))
                        : topicCategories.task2.map((topic) => (
                          <SelectItem key={topic.id} value={topic.id}>
                            {topic.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={generatePrompt} className="gap-1">
                    <Sparkles className="h-4 w-4" />
                    {isGenerating ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Generating...
                      </>
                    ) : (
                      "Generate Prompt"
                    )}
                  </Button>
                </div>
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

            <FormProvider {...form}>
              <form onSubmit={handleSubmit(handleScoring)} className="space-y-4">
                <FormField
                  control={control}
                  name="essayPrompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="prompt">Essay Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          id="prompt"
                          placeholder="Enter the essay prompt here..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="essayText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="essay">Your Essay</FormLabel>
                      <FormControl>
                        <Textarea
                          id="essay"
                          placeholder="Write your essay here..."
                          className="min-h-[200px]"
                          disabled={timerExpired}
                          {...field}
                        />
                      </FormControl>
                      {timerExpired && (
                        <p className="text-sm text-destructive">Time has expired. You can no longer edit your essay.</p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={timerExpired || isScoring}
                >
                  {isScoring ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Scoring...
                    </>
                  ) : (
                    "Evaluate Essay"
                  )}
                </Button>
              </form>
            </FormProvider>
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
                  <div className="text-sm bg-muted p-3 rounded-md">{saveData.promptText}</div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Your Response:</h3>
                  <div className="text-sm whitespace-pre-line border p-3 rounded-md">{saveData.essayText}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Topic Selection Dialog */}
      <Dialog open={topicDialogOpen} onOpenChange={setTopicDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Choose a Topic</DialogTitle>
            <DialogDescription>
              Select a topic category or enter your own for a relevant IELTS{" "}
              {taskType === "task1" ? "Task 1" : "Task 2"} prompt.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {/* Custom Topic Input */}
            <div className="space-y-2">
              <Label htmlFor="custom-topic">Custom Topic (Optional)</Label>
              <div className="flex space-x-2">
                <Input
                  id="custom-topic"
                  placeholder="Enter your own topic..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                />
                <Button
                  onClick={() => {
                    if (customTopic.trim()) {
                      setSelectedTopic("custom")
                      setTopicDialogOpen(false)
                    }
                  }}
                  disabled={!customTopic.trim()}
                >
                  Use
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTopicDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {submitted && (
        <div className="md:col-span-3 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your IELTS Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {scoreData && scoreData.valid && typeof scoreData.result !== "string" ? (
                <>
                  <div className="flex items-center justify-center mb-4">
                    <div className="text-center">
                      <div className="text-5xl font-bold">{scoreData.result.overallBand}</div>
                      <p className="text-sm text-muted-foreground mt-1">Overall Band Score</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">Task Response</h3>
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                            <span className="font-bold">{scoreData.result.scores.taskResponse.band}</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(scoreData.result.scores.taskResponse.band / 9) * 100}%` }}
                            />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {scoreData.result.scores.taskResponse.explanation}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium">Coherence & Cohesion</h3>
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                            <span className="font-bold">{scoreData.result.scores.coherenceAndCohesion.band}</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(scoreData.result.scores.coherenceAndCohesion.band / 9) * 100}%` }}
                            />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {scoreData.result.scores.coherenceAndCohesion.explanation}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">Lexical Resource</h3>
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                            <span className="font-bold">{scoreData.result.scores.lexicalResource.band}</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(scoreData.result.scores.lexicalResource.band / 9) * 100}%` }}
                            />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {scoreData.result.scores.lexicalResource.explanation}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium">Grammatical Range & Accuracy</h3>
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                            <span className="font-bold">
                              {scoreData.result.scores.grammaticalRangeAndAccuracy.band}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{
                                width: `${(scoreData.result.scores.grammaticalRangeAndAccuracy.band / 9) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {scoreData.result.scores.grammaticalRangeAndAccuracy.explanation}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Overall Feedback</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm">{scoreData.result.overallFeedback}</p>
                    </div>
                  </div>

                  {scoreData.result.corrections && scoreData.result.corrections.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-medium">Corrections</h3>
                      <div className="space-y-4">
                        {scoreData.result.corrections.map((correction, index) => (
                          <div key={index} className="bg-muted p-4 rounded-lg">
                            <div className="text-sm text-destructive mb-1">
                              <span className="font-medium">Mistake: </span>
                              {correction.mistake}
                            </div>
                            <div className="text-sm text-green-600 mb-1">
                              <span className="font-medium">Suggestion: </span>
                              {correction.suggestion}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium">Explanation: </span>
                              {correction.explanation}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {scoreData.result.improvementTips && scoreData.result.improvementTips.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-medium">Improvement Tips</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {scoreData.result.improvementTips.map((tip, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {scoreData.result.rewrittenParagraph && (
                    <div className="space-y-2">
                      <h3 className="font-medium">Example Rewritten Paragraph</h3>
                      <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                        <p className="text-sm italic">{scoreData.result.rewrittenParagraph}</p>
                      </div>
                    </div>
                  )}
                  <SaveEssay saveData={saveData} />
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="text-destructive text-lg font-medium mb-2">Invalid Essay Submission</div>
                  {scoreData ? (
                    typeof scoreData.result === "string" ? (
                      <p className="text-muted-foreground">{scoreData.result}</p>
                    ) : scoreData.result === null ? (
                      <p className="text-muted-foreground">No result returned from the server.</p>
                    ) : (
                      <p className="text-muted-foreground">Unexpected error occurred.</p>
                    )
                  ) : (
                    <p className="text-muted-foreground">No score data available.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
};

