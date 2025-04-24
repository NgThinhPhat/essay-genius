import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { AlertCircle, Clock, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner";
import { FormProvider, useForm } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { EssayResponseWrapperObject, EssayTaskTwoScoringRequest, essayTaskTwoScoringRequestSchema } from "@/constracts/essay.constract"
import { api } from "@/lib/api"
import { Label } from "@radix-ui/react-dropdown-menu"

export default function EssayScoringForm() {
  const [taskType, setTaskType] = useState<string>("task2")
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [saveType, setSaveType] = useState<string>("private")
  // Timer related states
  const [useTimer, setUseTimer] = useState<boolean>(false)
  const [timerDuration, setTimerDuration] = useState<number>(40) // in minutes
  const [timeRemaining, setTimeRemaining] = useState<number>(40 * 60) // in seconds
  const [timerActive, setTimerActive] = useState<boolean>(false)
  const [timerExpired, setTimerExpired] = useState<boolean>(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter();
  const [prompt, setPrompt] = useState<string>("")
  const [essay, setEssay] = useState<string>("")

  const [scoreData, setScoreData] = useState<EssayResponseWrapperObject | null>(null);
  const form = useForm<EssayTaskTwoScoringRequest>({
    resolver: zodResolver(essayTaskTwoScoringRequestSchema),
  });

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = form;

  const mutation = useMutation({
    mutationFn: (data: EssayTaskTwoScoringRequest) => api.essay.scoring({ body: data }),
    onSuccess: async (response, variables) => {
      switch (response.status) {
        case 200:
          setSubmitted(true)
          stopTimer()
          if (!response.body.valid) {
            toast(response.body.result + "")
          }
          else {
            toast("Scoring successful");
            setScoreData(response.body);
            setEssay(variables.essayText)
            setPrompt(variables.essayPrompt)
          }
          break;
        default:
          form.setError("root", {
            type: String(response.status),
            message: "Login failed",
          });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleScoring = (data: EssayTaskTwoScoringRequest) => {
    mutation.mutate(data)
  }

  const generatePrompt = () => {
    // const prompts = taskType === "task1" ? samplePrompts.task1 : samplePrompts.task2
    // const randomIndex = Math.floor(Math.random() * prompts.length)
    // setPrompt(prompts[randomIndex])
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
    !submitted ? (
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
                disabled={timerExpired}
              >
                Evaluate Essay
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
                <div className="text-sm bg-muted p-3 rounded-md">{prompt}</div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Your Response:</h3>
                <div className="text-sm whitespace-pre-line border p-3 rounded-md">{essay}</div>
              </div>
            </CardContent>
          </Card>

          {scoreData && scoreData.valid && typeof scoreData.result !== 'string' && (
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
                          <span className="font-semibold">Original:</span> {correction.mistake}
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
    )
  )
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
