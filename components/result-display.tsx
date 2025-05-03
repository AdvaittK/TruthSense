"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle2, BarChart3, AudioWaveformIcon as Waveform, Fingerprint, Info, ArrowRight } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

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
  
  // Use the actual confidence value from the model without manipulation
  const displayedConfidence = result.confidence.toFixed(1)

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    const tabMessages = {
      summary: "Viewing result summary",
      features: "Analyzing individual features",
      explanation: "Examining how our system works"
    };
    
    toast.info(tabMessages[value as keyof typeof tabMessages]);
  };
  
  const handleReset = () => {
    toast.info("Resetting analysis...");
    onReset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-2 shadow-xl">
        <CardHeader
          className={`${
            isTruth
              ? "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-900/10 border-b border-green-200 dark:border-green-900/30"
              : "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-900/10 border-b border-red-200 dark:border-red-900/30"
          }`}
        >
          <motion.div 
            className="flex items-center justify-between"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <CardTitle className="text-2xl flex items-center gap-2">
              {isTruth ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 15,
                      delay: 0.2
                    }}
                  >
                    <CheckCircle2 className="h-7 w-7 text-green-600 dark:text-green-400" />
                  </motion.div>
                  <motion.span 
                    className="text-green-700 dark:text-green-400 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-700 dark:from-green-400 dark:to-green-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Truth Detected
                  </motion.span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400 cursor-help ml-2" />
                      </TooltipTrigger>
                      <TooltipContent className="p-3 max-w-xs">
                        <p className="font-medium">Model accuracy: {result.is_dummy_model ? "Simulated" : "85%"}</p>
                        <p className="text-xs text-gray-500 mt-1">Results should be interpreted with caution and alongside other evidence</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 15,
                      delay: 0.2
                    }}
                  >
                    <AlertTriangle className="h-7 w-7 text-red-600 dark:text-red-400" />
                  </motion.div>
                  <motion.span 
                    className="text-red-700 dark:text-red-400 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700 dark:from-red-400 dark:to-red-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Deception Detected
                  </motion.span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400 cursor-help ml-2" />
                      </TooltipTrigger>
                      <TooltipContent className="p-3 max-w-xs">
                        <p className="font-medium">Model accuracy: {result.is_dummy_model ? "Simulated" : "85%"}</p>
                        <p className="text-xs text-gray-500 mt-1">Results should be interpreted with caution and alongside other evidence</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}
            </CardTitle>
            
            {/* Replace confidence percentage with a larger tick/cross mark */}
            <motion.div 
              className="text-right"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <div
                className={`flex items-center justify-center w-14 h-14 rounded-full ${
                  isTruth
                    ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700"
                    : "bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700"
                }`}
              >
                {isTruth ? (
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                )}
              </div>
            </motion.div>
          </motion.div>
          
          {/* Show demo mode disclaimer only when using dummy model */}
          {result.is_dummy_model && (
            <motion.div 
              className="mt-2 text-xs text-amber-600 dark:text-amber-400 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-md inline-flex items-center border border-amber-200 dark:border-amber-800"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <AlertTriangle className="h-3 w-3 mr-1" /> Demo mode: Results are simulated for demonstration purposes
            </motion.div>
          )}
        </CardHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="px-6 pt-6">
            <TabsList className="grid w-full grid-cols-3 h-12">
              <TabsTrigger value="summary" className="data-[state=active]:bg-primary/10 dark:data-[state=active]:bg-primary/20">Summary</TabsTrigger>
              <TabsTrigger value="features" className="data-[state=active]:bg-primary/10 dark:data-[state=active]:bg-primary/20">Feature Analysis</TabsTrigger>
              <TabsTrigger value="explanation" className="data-[state=active]:bg-primary/10 dark:data-[state=active]:bg-primary/20">Explanation</TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === "summary" && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mt-0 space-y-4"
                >
                  <div className="flex items-center justify-center py-8">
                    <motion.div
                      className={`w-48 h-48 rounded-full flex items-center justify-center 
                        ${isTruth 
                          ? "bg-green-100 dark:bg-green-900/30 border-4 border-green-200 dark:border-green-800" 
                          : "bg-red-100 dark:bg-red-900/30 border-4 border-red-200 dark:border-red-800"
                        }`}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 20,
                        delay: 0.1
                      }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.div
                        className={`text-5xl font-bold bg-clip-text text-transparent
                          ${isTruth 
                            ? "bg-truth-gradient" 
                            : "bg-lie-gradient"
                          }`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        {isTruth ? "TRUTH" : "FAKE"}
                      </motion.div>
                    </motion.div>
                  </div>

                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
                      {isTruth
                        ? "Our analysis indicates that the subject is likely telling the truth."
                        : "Our analysis indicates that the subject is likely being deceptive."}
                    </p>

                    <Button 
                      onClick={handleReset} 
                      className={`w-full sm:w-auto text-white ${isTruth 
                        ? "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800" 
                        : "bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800"
                      }`}
                      variant="default"
                    >
                      Analyze Another Video
                    </Button>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === "features" && (
                <motion.div
                  key="features"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mt-0 space-y-6"
                >
                  <div className="space-y-5">
                    <motion.div 
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                        <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Facial Expressions</span>
                          <span className="text-sm text-gray-500">{result.features.facialExpressions.toFixed(1)}%</span>
                        </div>
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
                        >
                          <Progress 
                            value={result.features.facialExpressions} 
                            className={`h-2 [&>div]:${
                              result.features.facialExpressions > 70 
                                ? (isTruth ? "bg-green-500" : "bg-red-500")
                                : "bg-amber-500"
                            }`}
                          />
                        </motion.div>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                        <Waveform className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Voice Analysis</span>
                          <span className="text-sm text-gray-500">{result.features.voiceAnalysis.toFixed(1)}%</span>
                        </div>
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
                        >
                          <Progress 
                            value={result.features.voiceAnalysis} 
                            className={`h-2 [&>div]:${
                              result.features.voiceAnalysis > 70 
                                ? (isTruth ? "bg-green-500" : "bg-red-500")
                                : "bg-amber-500"
                            }`}
                          />
                        </motion.div>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                        <Fingerprint className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Micro Gestures</span>
                          <span className="text-sm text-gray-500">{result.features.microGestures.toFixed(1)}%</span>
                        </div>
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
                        >
                          <Progress 
                            value={result.features.microGestures} 
                            className={`h-2 [&>div]:${
                              result.features.microGestures > 70 
                                ? (isTruth ? "bg-green-500" : "bg-red-500")
                                : "bg-amber-500"
                            }`}
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Analysis Summary</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {isTruth
                          ? "The subject's facial expressions, voice patterns, and gestures are consistent with truth-telling behavior."
                          : "The subject's facial expressions, voice patterns, and gestures show signs of deceptive behavior."}
                      </p>
                    </motion.div>
                  </div>

                  <motion.div 
                    className="pt-4 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Button 
                      onClick={handleReset} 
                      variant="outline"
                      className="group"
                    >
                      Analyze Another Video
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === "explanation" && (
                <motion.div
                  key="explanation"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mt-0"
                >
                  <div className="space-y-4 py-2">
                    <motion.h3 
                      className="text-lg font-medium text-gray-900 dark:text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      How Our System Works
                    </motion.h3>

                    <motion.div 
                      className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p className="text-blue-800 dark:text-blue-300 text-sm flex items-center gap-2">
                        <Info className="h-4 w-4 flex-shrink-0" /> 
                        <strong>Current Model Accuracy: {result.is_dummy_model ? "Simulated" : "85%"}</strong> - Results should be interpreted alongside other evidence.
                      </p>
                    </motion.div>

                    <motion.p 
                      className="text-gray-700 dark:text-gray-300"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Our lie detection system uses advanced AI to analyze multiple aspects of the subject's behavior:
                    </motion.p>

                    <motion.ul 
                      className="space-y-4 text-gray-700 dark:text-gray-300"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <motion.li 
                        className="flex gap-3 items-start bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ x: 5 }}
                      >
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full flex-shrink-0">
                          <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <span className="font-medium block mb-1">Facial Expressions</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            We analyze micro-expressions that may indicate deception, including eye movements, blink rate, and subtle facial muscle activity.
                          </span>
                        </div>
                      </motion.li>
                      
                      <motion.li 
                        className="flex gap-3 items-start bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        whileHover={{ x: 5 }}
                      >
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full flex-shrink-0">
                          <Waveform className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <span className="font-medium block mb-1">Voice Analysis</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Changes in pitch, tone, and speech patterns can reveal stress associated with lying. Our system detects voice tremors and hesitations.
                          </span>
                        </div>
                      </motion.li>
                      
                      <motion.li 
                        className="flex gap-3 items-start bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        whileHover={{ x: 5 }}
                      >
                        <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full flex-shrink-0">
                          <Fingerprint className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <span className="font-medium block mb-1">Micro Gestures</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Subtle body language cues that humans might miss but our AI can detect, such as micro hand movements, posture shifts, and breathing patterns.
                          </span>
                        </div>
                      </motion.li>
                    </motion.ul>

                    <motion.div 
                      className="pt-6 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <Button 
                        onClick={handleReset}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      >
                        Analyze Another Video
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Tabs>
      </Card>
    </motion.div>
  )
}
