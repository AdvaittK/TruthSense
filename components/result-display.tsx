"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle2, BarChart3, AudioWaveformIcon as Waveform, Fingerprint, Info } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

type ResultProps = {
  result: {
    prediction: "Truth" | "Fake"
    confidence: number
    features: {
      facialExpressions: number
      voiceAnalysis: number
      microGestures: number
    }
    is_dummy_model?: boolean  // Flag to indicate if this is a dummy model result
  }
  onReset: () => void
}

export function ResultDisplay({ result, onReset }: ResultProps) {
  const [activeTab, setActiveTab] = useState("summary")

  const isTruth = result.prediction === "Truth"

  return (
    <Card className="overflow-hidden">
      <CardHeader
        className={`${
          isTruth
            ? "bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-900/30"
            : "bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/30"
        }`}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center gap-2">
            {isTruth ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                <span className="text-green-700 dark:text-green-400">Truth Detected</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400 cursor-help ml-2" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Model accuracy: 67%</p>
                      <p className="text-xs text-gray-500">Results should be interpreted with caution</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            ) : (
              <>
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                <span className="text-red-700 dark:text-red-400">Deception Detected</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400 cursor-help ml-2" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Model accuracy: 67%</p>
                      <p className="text-xs text-gray-500">Results should be interpreted with caution</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}
          </CardTitle>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Confidence</div>
            <div
              className={`text-xl font-bold ${
                isTruth ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
              }`}
            >
              {result.confidence.toFixed(1)}%
            </div>
          </div>
        </div>
        
        {/* Show demo mode disclaimer only when using dummy model */}
        {result.is_dummy_model && (
          <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 px-1 py-0.5 bg-amber-50 dark:bg-amber-900/20 rounded-md inline-flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" /> Demo mode: Results are simulated for demonstration purposes
          </div>
        )}
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6 pt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="features">Feature Analysis</TabsTrigger>
            <TabsTrigger value="explanation">Explanation</TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="p-6">
          <TabsContent value="summary" className="mt-0 space-y-4">
            <div className="flex items-center justify-center py-8">
              <div
                className={`w-48 h-48 rounded-full flex items-center justify-center ${
                  isTruth ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
                }`}
              >
                <div
                  className={`text-4xl font-bold ${
                    isTruth ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                  }`}
                >
                  {isTruth ? "TRUTH" : "FAKE"}
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {isTruth
                  ? "Our analysis indicates that the subject is likely telling the truth."
                  : "Our analysis indicates that the subject is likely being deceptive."}
              </p>

              <Button onClick={onReset} className="w-full sm:w-auto">
                Analyze Another Video
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="features" className="mt-0 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Facial Expressions</span>
                    <span className="text-sm text-gray-500">{result.features.facialExpressions.toFixed(1)}%</span>
                  </div>
                  <Progress value={result.features.facialExpressions} className="h-2" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Waveform className="h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Voice Analysis</span>
                    <span className="text-sm text-gray-500">{result.features.voiceAnalysis.toFixed(1)}%</span>
                  </div>
                  <Progress value={result.features.voiceAnalysis} className="h-2" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Fingerprint className="h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Micro Gestures</span>
                    <span className="text-sm text-gray-500">{result.features.microGestures.toFixed(1)}%</span>
                  </div>
                  <Progress value={result.features.microGestures} className="h-2" />
                </div>
              </div>
            </div>

            <div className="pt-4 text-center">
              <Button onClick={onReset} variant="outline">
                Analyze Another Video
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="explanation" className="mt-0">
            <div className="space-y-4 py-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">How Our System Works</h3>

              <div className="bg-blue-50 p-3 rounded-md mb-4">
                <p className="text-blue-800 text-sm flex items-center gap-1">
                  <Info className="h-4 w-4" /> 
                  <strong>Current Model Accuracy: 67%</strong> - Results should be interpreted alongside other evidence.
                </p>
              </div>

              <p className="text-gray-700 dark:text-gray-300">
                Our lie detection system uses advanced AI to analyze multiple aspects of the subject's behavior:
              </p>

              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex gap-2">
                  <BarChart3 className="h-5 w-5 flex-shrink-0 text-gray-500" />
                  <span>
                    <strong>Facial Expressions:</strong> We analyze micro-expressions that may indicate deception.
                  </span>
                </li>
                <li className="flex gap-2">
                  <Waveform className="h-5 w-5 flex-shrink-0 text-gray-500" />
                  <span>
                    <strong>Voice Analysis:</strong> Changes in pitch, tone, and speech patterns can reveal stress
                    associated with lying.
                  </span>
                </li>
                <li className="flex gap-2">
                  <Fingerprint className="h-5 w-5 flex-shrink-0 text-gray-500" />
                  <span>
                    <strong>Micro Gestures:</strong> Subtle body language cues that humans might miss but our AI can
                    detect.
                  </span>
                </li>
              </ul>

              <div className="pt-4 text-center">
                <Button onClick={onReset}>Analyze Another Video</Button>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}
