!submitted || !saveData ? (
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
              }
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Topic</SelectItem>
                <SelectItem value="custom">Custom Topic</SelectItem>
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

      <Dialog open={true} onOpenChange={setTopicDialogOpen}>
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
                      } else {
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

      {scoreData && scoreData.valid && typeof scoreData.result !== 'string' && (
        <div className="md:col-span-3 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your IELTS Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {scoreData.valid ? (
              ): (
                  <div className = "text-center py-6">
                  <div className = "text-destructive text-lg font-medium mb-2">Invalid Essay Submission</div>
            <p className="text-muted-foreground">{scoreData.valid}</p>
        </div>
      )}
    </CardContent>
  </Card>
        </div >
      )}
    </div >
  </div >
)
