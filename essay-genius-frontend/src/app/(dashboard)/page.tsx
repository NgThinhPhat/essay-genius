"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner";
import { FormProvider, useForm } from "react-hook-form"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { EssayTaskTwoScoringRequest, essayTaskTwoScoringRequestSchema } from "@/constracts/essay.constract"
import { api } from "@/lib/api"
import FormEssayRequest from "@/components/layout/form-essay-request"
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
  // const { data: scoreData } = useQuery()

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
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-4 mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">IELTS Writing AI Examiner</h1>
        <p className="text-muted-foreground">Enter your prompt and essay to get your estimated band score</p>
      </div>

      {!submitted ? (
        <FormEssayRequest />
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

            {/* {scoreData && scoreData.valid && ( */}
            {/*   <Card> */}
            {/*     <CardHeader> */}
            {/*       <CardTitle>Score and Feedback</CardTitle> */}
            {/*     </CardHeader> */}
            {/*     <CardContent> */}
            {/*       <div className="space-y-2"> */}
            {/*         <h3 className="font-semibold">Overall Band Score: {scoreData.result.overallBand}</h3> */}
            {/*         <p>{scoreData.result.overallFeedback}</p> */}
            {/*       </div> */}
            {/**/}
            {/*       <div className="space-y-4"> */}
            {/*         {Object.entries(scoreData.result.scores).map(([criteria, score], index) => ( */}
            {/*           <div key={index}> */}
            {/*             <h4 className="font-medium">{criteria.replace(/([A-Z])/g, ' $1')}</h4> */}
            {/*             <p>Band: {score.band} ({score.explanation})</p> */}
            {/*           </div> */}
            {/*         ))} */}
            {/*       </div> */}
            {/**/}
            {/*       <div className="space-y-2"> */}
            {/*         <h4 className="font-medium">Improvement Tips</h4> */}
            {/*         <ul className="space-y-1"> */}
            {/*           {scoreData.result.improvementTips.map((tip, index) => ( */}
            {/*             <li key={index} className="text-sm">{tip}</li> */}
            {/*           ))} */}
            {/*         </ul> */}
            {/*       </div> */}
            {/**/}
            {/*       <div className="space-y-2"> */}
            {/*         <h4 className="font-medium">Corrections</h4> */}
            {/*         <div className="space-y-4"> */}
            {/*           {scoreData.result.corrections.map((correction, index) => ( */}
            {/*             <div key={index} className="bg-muted p-3 rounded-md space-y-1"> */}
            {/*               <p className="text-sm"> */}
            {/*                 <span className="font-semibold">Original:</span> {correction.original} */}
            {/*               </p> */}
            {/*               <p className="text-sm"> */}
            {/*                 <span className="font-semibold">Suggestion:</span> {correction.suggestion} */}
            {/*               </p> */}
            {/*               {correction.explanation && ( */}
            {/*                 <p className="text-sm text-muted-foreground"> */}
            {/*                   <span className="font-semibold">Explanation:</span> {correction.explanation} */}
            {/*                 </p> */}
            {/*               )} */}
            {/*             </div> */}
            {/*           ))} */}
            {/*         </div> */}
            {/*       </div> */}
            {/*     </CardContent> */}
            {/*   </Card> */}
            {/* )} */}
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

