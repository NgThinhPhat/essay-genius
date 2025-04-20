"use client"

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
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { EssayTaskTwoScoringRequest, essayTaskTwoScoringRequestSchema } from "@/constracts/essay.constract"
import { api } from "@/lib/api"
import { Label } from "@radix-ui/react-dropdown-menu"

export default function FormEssayRequest() {
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
  // const { data: scoreData } = useQuery()

  const router = useRouter();

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
    onSuccess: async (response) => {
      switch (response.status) {
        case 200:
          setSubmitted(true)
          stopTimer()
          if (!response.body.valid) {
            toast(response.body.result + "")
          }
          toast("Login successful");
          router.push("/");
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

  const handleEdit = () => {
    setSubmitted(false)
    resetTimer()
    // setScoreData({ valid: false, result: null })
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // useEffect(() => {
  //   if (timerExpired) {
  //     handleScoring()
  //   }
  // }, [timerExpired])
  //

  // const toggleValidation = () => {
  //   if (scoreData.valid) {
  //     setScoreData({
  //       valid: false,
  //       result: "Essay does not address the question. The essay consists of only gibberish.",
  //     })
  //   } else {
  //     setScoreData({
  //       valid: true,
  //       result: {
  //         scores: {
  //           taskResponse: {
  //             band: 7,
  //             explanation: "The essay clearly addresses the prompt and presents a well-defined position...",
  //           },
  //           coherenceAndCohesion: {
  //             band: 7,
  //             explanation: "The essay demonstrates a clear and logical structure...",
  //           },
  //           lexicalResource: {
  //             band: 7,
  //             explanation: "The essay demonstrates a good range of vocabulary...",
  //           },
  //           grammaticalRangeAndAccuracy: {
  //             band: 7,
  //             explanation: "The essay exhibits a good range of grammatical structures...",
  //           },
  //         },
  //         overallBand: 7,
  //         overallFeedback: "This is a well-written essay that effectively addresses the prompt...",
  //         corrections: [
  //           {
  //             mistake: "Industrial activities have been devastating...",
  //             suggestion: "Industrial activities have been devastating...",
  //             explanation: "While 'causing' isn't strictly incorrect...",
  //           },
  //         ],
  //         improvementTips: ["Provide More Specific Examples: While the essay mentions 'rhinos' and 'cows,'..."],
  //         rewrittenParagraph: "The significant role wild animals play in maintaining...",
  //       },
  //     })
  //   }
  // }
  return (
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
  )
};
