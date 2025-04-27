"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { Loader2, UploadIcon, AlertTriangle, CheckCircle2, Info, Calendar, Award, FileCode } from "lucide-react"
import { ResultDisplay } from "./result-display"
import { uploadVideo, LieDetectionResult, checkApiAvailability, getModelStatus } from "@/lib/api"
import { Alert, AlertDescription } from "./ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { Badge } from "./ui/badge"

export function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<null | {
    prediction: "Truth" | "Fake"
    confidence: number
    features: {
      facialExpressions: number
      voiceAnalysis: number
      microGestures: number
    }
    is_dummy_model?: boolean
  }>(null)
  const [error, setError] = useState<string | null>(null)
  const [isApiAvailable, setIsApiAvailable] = useState<boolean | null>(null)
  const [modelInfo, setModelInfo] = useState<{
    model_loaded: boolean;
    last_trained?: string;
    accuracy?: number;
    version?: string;
  } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Check API availability and model status on component mount
  useEffect(() => {
    async function checkStatus() {
      try {
        const available = await checkApiAvailability()
        setIsApiAvailable(available)
        
        if (available) {
          try {
            const modelStatus = await getModelStatus()
            setModelInfo(modelStatus)
          } catch (modelError) {
            console.error("Error fetching model status:", modelError)
          }
        }
      } catch (error) {
        setIsApiAvailable(false)
      }
    }
    
    checkStatus()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Reset states
      setError(null)
      setResult(null)
      setFile(selectedFile)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0]

    if (droppedFile) {
      if (!droppedFile.type.startsWith("video/")) {
        setError("Please upload a video file")
        return
      }

      // Reset states
      setError(null)
      setResult(null)
      setFile(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first")
      return
    }

    try {
      setUploading(true)
      setUploadProgress(0)

      // Set up upload progress tracking
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            return 95
          }
          return prev + 5
        })
      }, 200)

      try {
        // Upload the video to our backend API
        const apiResult = await uploadVideo(file)
        
        clearInterval(interval)
        setUploadProgress(100)
        
        // Processing completed
        setUploading(false)
        setProcessing(false)
        
        // Update the result with data from API
        setResult(apiResult)
      } catch (apiError) {
        clearInterval(interval)
        throw apiError
      }
    } catch (err) {
      // If API failed, use fallback mode with simulated results
      console.error("API error, using fallback mode:", err)
      setUploading(false)
      setProcessing(false)
      
      // Check if it's a connection error
      const isConnectionError = (err instanceof Error && 
        (err.message.includes('fetch') || err.message.includes('network') || err.message.includes('connect')));
        
      if (isConnectionError) {
        // API server not available, use fallback simulation mode
        const fallbackResult: LieDetectionResult = {
          prediction: Math.random() > 0.5 ? "Truth" : "Fake",
          confidence: 70 + Math.random() * 25,
          features: {
            facialExpressions: 60 + Math.random() * 30,
            voiceAnalysis: 60 + Math.random() * 30,
            microGestures: 60 + Math.random() * 30,
          },
        }
        
        setResult(fallbackResult)
        setError("Could not connect to analysis server, using simulation mode")
      } else {
        // Other error occurred
        setError(`An error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const resetForm = () => {
    setFile(null)
    setResult(null)
    setError(null)
    setUploading(false)
    setProcessing(false)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-8">
      {!result && (
        <Card className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              error ? "border-red-400 bg-red-50 dark:bg-red-900/20" : "border-gray-300 dark:border-gray-700"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />

            {!file && !error && (
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <UploadIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">Drag and drop your video here</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">or</p>
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="mt-2">
                    Select Video
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Supported formats: MP4, MOV, AVI (max 100MB)</p>
              </div>
            )}

            {file && !error && (
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{file.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            )}

            {error && (
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-lg font-medium text-red-600 dark:text-red-400">{error}</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setError(null)
                    fileInputRef.current?.click()
                  }}
                >
                  Try Again
                </Button>
              </div>
            )}
          </div>

          {file && !error && (
            <div className="mt-6 space-y-4">
              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Uploading...</span>
                    <span className="text-gray-700 dark:text-gray-300">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {isApiAvailable === false && (
                <div className="mb-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span>Analysis server not connected - Results will be simulated for demonstration</span>
                </div>
              )}
              
              {modelInfo && modelInfo.version === "dummy_model" && (
                <div className="mb-4 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm flex items-center gap-2">
                  <Info className="h-4 w-4 flex-shrink-0" />
                  <span>Using demo model with {modelInfo.accuracy?.toFixed(1)}% accuracy</span>
                </div>
              )}

              <div className="flex gap-4 justify-end">
                <Button variant="outline" onClick={resetForm} disabled={uploading || processing}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={uploading || processing}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {uploading || processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {uploading ? "Uploading..." : "Processing..."}
                    </>
                  ) : (
                    "Analyze Video"
                  )}
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {result && <ResultDisplay result={result} onReset={resetForm} />}

      <Card className="p-4 mt-4 border-t-4 border-t-blue-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {modelInfo ? (
              modelInfo.version === "dummy_model" ? (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 mr-3">Demo Mode</Badge>
              ) : (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mr-3">Active Model</Badge>
              )
            ) : isApiAvailable === false ? (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 mr-3">Offline</Badge>
            ) : (
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 mr-3">Checking...</Badge>
            )}
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Analysis Engine Status</h2>
          </div>
          {modelInfo && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="rounded-full bg-blue-50 p-2 cursor-help">
                    <Info className="h-5 w-5 text-blue-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="w-80 p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Model Details</h3>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FileCode className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">Version:</span> 
                        <span>{modelInfo.version || 'Unknown'}</span>
                      </div>
                      {modelInfo.last_trained && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">Trained:</span> 
                          <span>{new Date(modelInfo.last_trained).toLocaleDateString()}</span>
                        </div>
                      )}
                      {modelInfo.accuracy && (
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">Accuracy:</span> 
                          <span>{modelInfo.accuracy.toFixed(1)}%</span>
                        </div>
                      )}
                      <div className="mt-2 pt-2 border-t text-sm text-gray-500">
                        {modelInfo.version === "dummy_model" ? 
                          "This is running in demo mode with simulated results." : 
                          "This is using the trained CNN-LSTM model for predictions."}
                      </div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        <div className="mt-3 text-sm">
          {!modelInfo && isApiAvailable === false && (
            <div className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Analysis server offline - using simulation mode</span>
            </div>
          )}
          
          {modelInfo && modelInfo.version === "dummy_model" && (
            <div className="text-amber-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Demo mode active - results are simulated</span>
            </div>
          )}
          
          {modelInfo && modelInfo.version !== "dummy_model" && (
            <div className="text-green-600 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Using trained model with {modelInfo.accuracy?.toFixed(1)}% accuracy</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
