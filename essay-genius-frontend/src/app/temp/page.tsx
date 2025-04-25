"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AlertCircle, Clock, RefreshCw, Sparkles } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ToastAction } from "@/components/ui/toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"

export default function Home() {
  const [taskType, setTaskType] = useState<string>("task2")
  const [prompt, setPrompt] = useState<string>("")
  const [essay, setEssay] = useState<string>("")
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [saveType, setSaveType] = useState<string>("private")
  const [selectedTopic, setSelectedTopic] = useState<string>("")
  const [topicDialogOpen, setTopicDialogOpen] = useState(false)
  const [customTopic, setCustomTopic] = useState<string>("")

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

  // Topic categories for Task 1 and Task 2
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

  // Sample prompts for generation
  const samplePrompts = {
    task1: {
      "line-graphs": [
        "The line graph below shows changes in the amount and type of fast food consumed by Australian teenagers from 1975 to 2000. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
        "The graph below shows the proportion of the population aged 65 and over between 1940 and 2040 in three different countries. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
        "The line graph illustrates the number of cases of X disease in Someland between 1960 and 1995. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
      ],
      "bar-charts": [
        "The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
        "The bar chart shows the top ten countries for the production and consumption of electricity in 2014. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
        "The bar chart below gives information about the percentage of the population living in urban areas in different parts of the world. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
      ],
      "pie-charts": [
        "The pie charts below show the comparison of different kinds of energy production of France in 1995 and 2005. Summarize the information by selecting and reporting the main features and make comparisons where relevant.",
        "The pie charts below show the average household expenditures in Japan and Malaysia in the year 2010. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
        "The pie charts below show the online shopping market share of retail e-commerce in China from 2012 to 2017. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
      ],
      tables: [
        "The table below gives information about the underground railway systems in six cities. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
        "The table below shows the figures for imprisonment in five countries between 1930 and 1980. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
        "The table below shows the consumer durables (telephone, refrigerator, etc.) owned in Britain from 1972 to 1983. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
      ],
      maps: [
        "The maps below show the village of Stokeford in 1930 and 2010. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
        "The two maps below show an island, before and after the construction of some tourist facilities. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
        "The diagrams below show the existing ground floor plan of a house and a proposed plan for some building work. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
      ],
      "process-diagrams": [
        "The diagrams below show the life cycle of the silkworm and the stages in the production of silk cloth. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
        "The diagram below shows the process of making cement, and how cement is used to produce concrete for building purposes. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
        "The diagram below shows the water cycle, which is the continuous movement of water on, above, and below the surface of the Earth. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
      ],
      "mixed-charts": [
        "The graph and table below give information about water use worldwide and water consumption in two different countries. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
        "The charts below show the results of a survey of adult education. The first chart shows the reasons why adults decide to study. The pie chart shows how people think the costs of adult education should be shared. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
        "The bar chart below shows the top ten countries for the production and consumption of electricity in 2014. The pie chart shows the different sources of electricity in one of these countries. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
      ],
    },
    task2: {
      education: [
        "Some people believe that unpaid community service should be a compulsory part of high school education. To what extent do you agree or disagree?",
        "Some people think that all university students should study whatever they like. Others believe that they should only be allowed to study subjects that will be useful in the future, such as those related to science and technology. Discuss both these views and give your own opinion.",
        "Some people believe that students should be allowed to evaluate and criticize their teachers to improve education quality. Others think this would lead to loss of respect and discipline in the classroom. Discuss both views and give your opinion.",
      ],
      technology: [
        "In some countries, many more people are choosing to live alone nowadays than in the past. Do you think this is a positive or negative development?",
        "Some people think that technology is making education less personal and interactive. Others believe that technology is creating new ways for people to connect and learn from each other. Discuss both views and give your opinion.",
        "The development of artificial intelligence (AI) might lead to the end of many jobs currently done by humans. What problems might this cause? What solutions can you suggest?",
      ],
      environment: [
        "Many environmental problems are too big for individual countries and individual people to address. In other words, we have reached the stage where the only way to protect the environment is at an international level. To what extent do you agree or disagree with this statement?",
        "Some people think that the best way to solve global environmental problems is to increase the cost of fuel. To what extent do you agree or disagree?",
        "Many people believe that global environmental problems are too big for individuals to solve. Others think that individuals cannot solve these environmental problems unless they take action. Discuss both views and give your own opinion.",
      ],
      health: [
        "Some people believe that there should be fixed punishments for each type of crime. Others, however, argue that the circumstances of an individual crime, and the motivation for committing it, should always be taken into account when deciding on the punishment. Discuss both these views and give your own opinion.",
        "In many countries, the government spends a large amount of money on improving sporting facilities. Some people think that the government should spend more money on children's sports facilities than on professional sports. To what extent do you agree or disagree?",
        "Some people think that the government should provide free healthcare for all citizens, while others believe that individuals should pay for their own healthcare. Discuss both views and give your opinion.",
      ],
      work: [
        "Some people think that it is important to have a single career for life, while others think that it is better to have a series of jobs in a lifetime. Discuss both views and give your own opinion.",
        "Some people think that employers should provide their employees with exercise facilities and time to use them. Others think that this is not an employer's responsibility. Discuss both views and give your opinion.",
        "Some people think that the government should provide financial assistance to creative artists such as painters and musicians. Others believe that creative artists should be funded by alternative sources. Discuss both views and give your opinion.",
      ],
      society: [
        "Some people think that the teenage years are the happiest times of most people's lives. Others think that adult life brings more happiness, in spite of greater responsibilities. Discuss both these views and give your own opinion.",
        "Some people think that in the modern world we are more dependent on each other, while others think that people have become more independent. Discuss both views and give your own opinion.",
        "Some people think that cultural traditions may be destroyed when they are used as money-making attractions aimed at tourists. Others believe it is the only way to save these traditions. Discuss both sides and give your opinion.",
      ],
      government: [
        "Some people think that governments should spend money on measures to save languages with few speakers from dying out completely. Others think this is a waste of financial resources. Discuss both views and give your opinion.",
        "Some people think that a sense of competition in children should be encouraged. Others believe that children who are taught to co-operate rather than compete become more useful adults. Discuss both these views and give your own opinion.",
        "Some people think that the government should ban dangerous sports, while others think people should have freedom to do any sports or activity. Discuss both views and give your opinion.",
      ],
      crime: [
        "Some people think certain prisoners should be made to do unpaid community work instead of being put behind bars. To what extent do you agree?",
        "Some people think that the increasing use of computers and mobile phones in communication has had a negative effect on young people's reading and writing skills. To what extent do you agree or disagree?",
        "Some people think that the best way to reduce crime is to give longer prison sentences. Others, however, believe there are better alternative ways of reducing crime. Discuss both views and give your opinion.",
      ],
      media: [
        "News editors decide what to broadcast on television and what to print in newspapers. What factors do you think influence these decisions? Do we become used to bad news? Would it be better if more good news was reported?",
        "The mass media, including TV, radio and newspapers, have great influence in shaping people's ideas. To what extent do you agree or disagree with this statement?",
        "Some people think that newspapers are the best way to get news, while others believe that they can get news better through other media. Discuss both views and give your opinion.",
      ],
      arts: [
        "Some people think that governments should spend money on measures to save languages with few speakers from dying out completely. Others think this is a waste of financial resources. Discuss both views and give your opinion.",
        "Some people think that museums should be enjoyable places to entertain people, while others believe that the purpose of museums is to educate. Discuss both views and give your own opinion.",
        "Some people think that the government should provide financial assistance to creative artists such as painters and musicians. Others believe that creative artists should be funded by alternative sources. Discuss both views and give your opinion.",
      ],
      sports: [
        "Some people think that the government should spend more money on children's sports facilities than on professional sports. To what extent do you agree or disagree?",
        "Some people think that dangerous sports should be banned, while others think people should have the freedom to choose. Discuss both views and give your opinion.",
        "Some people think that hosting international sports events is good for the country, while others think it is a waste of money. Discuss both views and give your opinion.",
      ],
      family: [
        "In some countries, many more people are choosing to live alone nowadays than in the past. Do you think this is a positive or negative development?",
        "In many countries today, parents are able to choose to send their children to single-sex schools or co-educational schools. What are the advantages and disadvantages of single-sex schools?",
        "Some people believe that children should be allowed to stay at home and play until they are six or seven years old. Others believe that it is important for young children to go to school as soon as possible. Discuss both these views and give your own opinion.",
      ],
      housing: [
        "In many cities, the high cost of housing forces people to travel long distances to work. What problems does this cause? What solutions can you suggest?",
        "In many countries, the government has encouraged the growth of cities and the movement of people from rural to urban areas. Do you think the advantages of this development outweigh the disadvantages?",
        "Some people prefer to live in a house, while others feel that there are more advantages to living in an apartment. Are there more advantages than disadvantages of living in a house compared with living in an apartment?",
      ],
      transport: [
        "Some people believe that there should be fixed punishments for each type of crime. Others, however, argue that the circumstances of an individual crime, and the motivation for committing it, should always be taken into account when deciding on the punishment. Discuss both these views and give your own opinion.",
        "Some people think that the best way to reduce traffic congestion is to increase the price of fuel. To what extent do you agree or disagree?",
        "Some people think that the government should spend more money on improving roads and highways, while others think that more money should be spent on improving public transportation. Discuss both views and give your opinion.",
      ],
      language: [
        "Some people think that it is better to educate boys and girls in separate schools. Others, however, believe that boys and girls benefit more from attending mixed schools. Discuss both these views and give your own opinion.",
        "Some people think that children should begin their formal education at a very early age and should spend most of their time on school studies. Others believe that young children should spend most of their time playing. Discuss both these views and give your own opinion.",
        "Some people think that the government should ensure that healthy food is cheaper than less healthy food, while others believe that people should be free to choose what they eat. Discuss both views and give your opinion.",
      ],
    },
  }

  const generatePrompt = () => {
    if (!selectedTopic) {
      setTopicDialogOpen(true)
      return
    }

    if (selectedTopic === "custom" && customTopic.trim()) {
      // Generate a prompt based on the custom topic
      const taskTypeText = taskType === "task1" ? "Task 1" : "Task 2"
      if (taskType === "task1") {
        setPrompt(
          `The ${customTopic} below shows information about ${customTopic.toLowerCase()}. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.`,
        )
      } else {
        setPrompt(
          `Some people believe that ${customTopic.toLowerCase()} is important in modern society. Others think that ${customTopic.toLowerCase()} has more negative effects. Discuss both views and give your opinion.`,
        )
      }
      return
    }

    const topicPrompts =
      taskType === "task1"
        ? samplePrompts.task1[selectedTopic as keyof typeof samplePrompts.task1]
        : samplePrompts.task2[selectedTopic as keyof typeof samplePrompts.task2]

    if (topicPrompts) {
      const randomIndex = Math.floor(Math.random() * topicPrompts.length)
      setPrompt(topicPrompts[randomIndex])
    } else {
      // If no specific topic is selected, use a random topic
      const allTopics = Object.keys(samplePrompts[taskType as keyof typeof samplePrompts])
      const randomTopic = allTopics[Math.floor(Math.random() * allTopics.length)]
      const topicPrompts = samplePrompts[taskType as keyof typeof samplePrompts][randomTopic as any]
      const randomIndex = Math.floor(Math.random() * topicPrompts.length)
      setPrompt(topicPrompts[randomIndex])
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

  // Modify the handleSubmit function to show a toast for invalid essays
  const handleSubmit = () => {
    if (prompt.trim() && essay.trim()) {
      setSubmitted(true)
      stopTimer()

      // Simulate validation - in a real app this would come from the API
      if (!scoreData.valid) {
        toast("asdfasdflk")
      }
    }
  }

  const handleEdit = () => {
    setSubmitted(false)
    resetTimer()
    setScoreData({ valid: false, result: null })
  }

  // Reset selected topic when task type changes
  useEffect(() => {
    setSelectedTopic("")
    setCustomTopic("")
  }, [taskType])

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
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Topic</SelectItem>
                      {selectedTopic === "custom" && <SelectItem value="custom">Custom: {customTopic}</SelectItem>}
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
                    Generate Prompt
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

            <div className="space-y-2">
              <Label htmlFor="prompt">Essay Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Enter the essay prompt here or click 'Generate Prompt'..."
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
          <div className="md:col-span-2 space-y-6">
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
                <Button variant="outline" className="w-full" onClick={handleEdit}>
                  Edit Essay
                </Button>
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
                      // Generate a prompt based on the custom topic
                      const taskTypeText = taskType === "task1" ? "Task 1" : "Task 2"
                      if (taskType === "task1") {
                        setPrompt(
                          `The ${customTopic} below shows information about ${customTopic.toLowerCase()}. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.`,
                        )
                      } else {
                        setPrompt(
                          `Some people believe that ${customTopic.toLowerCase()} is important in modern society. Others think that ${customTopic.toLowerCase()} has more negative effects. Discuss both views and give your opinion.`,
                        )
                      }
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
            <Button
              onClick={() => {
                const randomTopic =
                  taskType === "task1"
                    ? topicCategories.task1[Math.floor(Math.random() * topicCategories.task1.length)].id
                    : topicCategories.task2[Math.floor(Math.random() * topicCategories.task2.length)].id
                setSelectedTopic(randomTopic)
                generatePrompt()
                setTopicDialogOpen(false)
              }}
            >
              Random Topic
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Score Card at the bottom */}
      {submitted && (
        <div className="md:col-span-3 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your IELTS Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {scoreData.valid ? (
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

                  <div className="pt-4 border-t">
                    <div className="space-y-4">
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
                          <RadioGroupItem value="public" id="public" disabled={scoreData.result.overallBand < 5} />
                          <Label
                            htmlFor="public"
                            className={scoreData.result.overallBand < 5 ? "text-muted-foreground" : ""}
                          >
                            Public
                          </Label>
                        </div>
                      </RadioGroup>
                      {scoreData.result.overallBand < 5 && (
                        <p className="text-xs text-muted-foreground">
                          Essays with a band score below 5 cannot be shared publicly.
                        </p>
                      )}
                      <Button className="w-full">Save Essay</Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="text-destructive text-lg font-medium mb-2">Invalid Essay Submission</div>
                  <p className="text-muted-foreground">{scoreData.result}</p>
                  <Button variant="outline" className="mt-4" onClick={handleEdit}>
                    Edit Essay
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
}

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
