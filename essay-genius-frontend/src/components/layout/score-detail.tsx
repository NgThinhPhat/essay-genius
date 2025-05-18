export function ScoreDetail({ title, score }: ScoreDetailProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium">{title}</span>
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
          <span className="font-bold">{score.toFixed(1)}</span>
        </div>
        <div className="w-24 h-2 bg-muted rounded-full mr-2 overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${(score / 9) * 100}%` }} />
        </div>
      </div>
    </div>
  )
}

interface ScoreDetailProps {
  title: string
  score: number
}

