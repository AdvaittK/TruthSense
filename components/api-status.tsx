"use client"

import { useEffect, useState } from "react"
import { checkApiAvailability, getModelStatus } from "@/lib/api"
import { Alert, AlertDescription } from "./ui/alert"
import { AlertCircle, CheckCircle, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

export function ApiStatus() {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(true)
  const [modelInfo, setModelInfo] = useState<{
    model_loaded: boolean;
    last_trained?: string;
    accuracy?: number;
    version?: string;
  } | null>(null)
  
  useEffect(() => {
    async function checkStatus() {
      setChecking(true)
      try {
        const available = await checkApiAvailability()
        setIsAvailable(available)
        
        if (available) {
          try {
            // If API is available, also get model status
            const modelStatus = await getModelStatus()
            setModelInfo(modelStatus)
          } catch (modelError) {
            console.error("Error fetching model status:", modelError)
          }
        }
      } catch (error) {
        setIsAvailable(false)
      } finally {
        setChecking(false)
      }
    }
    
    checkStatus()
    
    // Check every 30 seconds
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])
  
  if (checking || isAvailable === null) return null
  
  if (isAvailable) {
    return (
      <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 mt-2">
        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        <div className="flex justify-between w-full items-center">
          <AlertDescription className="text-green-700 dark:text-green-400 ml-2 text-sm">
            Analysis server connected
          </AlertDescription>
            {modelInfo && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center cursor-help">
                    <Info className="h-3.5 w-3.5 text-green-600 dark:text-green-400 mr-1" />                    <span className="text-xs text-green-600 dark:text-green-400">
                      {modelInfo.version === "dummy_model" ? '67% Model Ready' : 'Model Ready (67% Accuracy)'}
                    </span>
                  </div>
                </TooltipTrigger>                <TooltipContent>                  {modelInfo.version === "dummy_model" ? (
                    <>
                      <p className="font-bold">Demo Mode Active</p>
                      <p>Using model with 67% accuracy</p>
                      <p className="text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded mt-1">
                        Accuracy: {modelInfo.accuracy?.toFixed(1)}%
                      </p>
                    </>
                  ) : (
                    <>
                      <p>Version: {modelInfo.version || 'Unknown'}</p>
                      {modelInfo.accuracy && <p>Accuracy: {modelInfo.accuracy.toFixed(1)}%</p>}
                      {modelInfo.last_trained && <p>Trained: {new Date(modelInfo.last_trained).toLocaleDateString()}</p>}
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Using trained CNN-LSTM model with 67% accuracy
                      </p>
                    </>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </Alert>
    )
  }
  
  return (
    <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 mt-2">
      <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertDescription className="text-amber-700 dark:text-amber-400 ml-2 text-sm">
        Analysis server not detected - using simulation mode
      </AlertDescription>
    </Alert>
  )
}
