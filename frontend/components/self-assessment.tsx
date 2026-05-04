"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Brain, Heart } from "lucide-react"

const questions = [
  {
    id: 1,
    question: "How often do you feel overwhelmed by daily tasks?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
  },
  {
    id: 2,
    question: "How would you rate your current stress level?",
    options: ["Very Low", "Low", "Moderate", "High", "Very High"],
  },
  {
    id: 3,
    question: "How satisfied are you with your relationships?",
    options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
  },
  {
    id: 4,
    question: "How often do you have trouble sleeping?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
  },
]

export default function SelfAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value })
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const getRecommendation = () => {
    const scores = Object.values(answers).map((answer, index) => {
      const options = questions[index].options
      return options.indexOf(answer)
    })
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length

    if (averageScore <= 1) {
      return {
        level: "Low Stress",
        color: "text-success-dark",
        icon: <CheckCircle className="h-6 w-6 text-success-dark" />,
        recommendation: "You're managing well! Consider our mindfulness sessions to maintain your mental wellness.",
        suggestedService: "Mindfulness & Wellness Sessions",
      }
    } else if (averageScore <= 2.5) {
      return {
        level: "Moderate Stress",
        color: "text-warning-dark",
        icon: <Brain className="h-6 w-6 text-warning-dark" />,
        recommendation:
          "Some areas could benefit from support. Individual therapy might help you develop better coping strategies.",
        suggestedService: "Individual Therapy",
      }
    } else {
      return {
        level: "High Stress",
        color: "text-error",
        icon: <Heart className="h-6 w-6 text-error" />,
        recommendation:
          "We recommend scheduling a consultation soon. Our therapists can provide immediate support and coping strategies.",
        suggestedService: "Urgent Consultation",
      }
    }
  }

  const resetAssessment = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
  }

  if (showResults) {
    const result = getRecommendation()
    return (
      <section className="py-16 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-background/80 backdrop-blur-sm border-none shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">{result.icon}</div>
              <CardTitle className="text-2xl">Assessment Results</CardTitle>
              <CardDescription>Based on your responses, here's what we recommend</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <h3 className={`text-xl font-semibold ${result.color}`}>{result.level}</h3>
                <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">{result.recommendation}</p>
              </div>
              <div className="bg-secondary/50 p-6 rounded-lg">
                <h4 className="font-medium mb-2">Suggested Service:</h4>
                <p className="text-primary font-medium">{result.suggestedService}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="rounded-full">
                  <a href="/booking">Book a Session</a>
                </Button>
                <Button variant="outline" onClick={resetAssessment} className="rounded-full">
                  Retake Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-secondary/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Mental Health Self-Assessment</h2>
          <p className="text-lg text-muted-foreground">
            Take our quick assessment to understand your current mental health needs
          </p>
        </div>

        <Card className="bg-background/80 backdrop-blur-sm border-none shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                Question {currentQuestion + 1} of {questions.length}
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
              </span>
            </div>
            <Progress value={((currentQuestion + 1) / questions.length) * 100} className="mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <h3 className="text-xl font-medium">{questions[currentQuestion].question}</h3>
            <RadioGroup value={answers[currentQuestion] || ""} onValueChange={handleAnswer} className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <div className="flex justify-end">
              <Button onClick={nextQuestion} disabled={!answers[currentQuestion]} className="rounded-full">
                {currentQuestion === questions.length - 1 ? "Get Results" : "Next Question"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
