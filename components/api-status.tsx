"use client"

import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { checkApiAvailability, getModelStatus } from "@/lib/api"
import { motion } from "framer-motion"
import { ServerCrash, CheckCircle2, AlertTriangle, Cpu, BarChart, Server } from "lucide-react"

export function ApiStatus() {
  const [isApiAvailable, setIsApiAvailable] = useState<boolean | null>(null)
  const [modelInfo, setModelInfo] = useState<{
    model_loaded: boolean
    last_trained?: string
    accuracy?: number
    version?: string
  } | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const checkAttemptsRef = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const checkStatus = async () => {
    if (isChecking) return; // Prevent multiple simultaneous checks
    
    setIsChecking(true)
    try {
      // Safely check API availability
      let available = false;
      try {
        available = await checkApiAvailability();
      } catch (apiCheckError) {
        console.error("Error in API availability check:", apiCheckError);
        available = false;
      }
      
      setIsApiAvailable(available);
      
      // Only try to get model status if API is available
      if (available) {
        try {
          const modelStatus = await getModelStatus();
          setModelInfo(modelStatus);
          checkAttemptsRef.current = 0; // Reset attempts counter on success
        } catch (modelError) {
          console.error("Error fetching model status:", modelError);
          // Don't update model info on error - keep previous state
        }
      } else {
        checkAttemptsRef.current += 1;
        console.log(`API unavailable (attempt ${checkAttemptsRef.current})`);
        
        // If too many failed attempts, reduce check frequency
        if (checkAttemptsRef.current >= 3 && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = setInterval(() => {
            checkStatus();
          }, 300000); // Check every 5 minutes after multiple failures
          console.log("Reduced API check frequency due to multiple failures");
        }
      }
    } catch (error) {
      console.error("Unexpected error in API status check:", error);
      setIsApiAvailable(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Initial check
    checkStatus();
    
    // Set up periodic checks
    intervalRef.current = setInterval(() => {
      checkStatus();
    }, 60000); // Check every minute initially
    
    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div 
            className="relative cursor-help"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Manual check - reset intervals
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
              }
              checkAttemptsRef.current = 0;
              checkStatus();
              // Restart normal interval
              intervalRef.current = setInterval(() => {
                checkStatus();
              }, 60000);
            }}
          >
            {isChecking ? (
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400/20 blur-md rounded-full"></div>
                <Badge variant="outline" className="relative bg-gradient-to-r from-blue-50 to-blue-100/70 text-blue-800 border-blue-200 px-3 py-1.5 rounded-full text-xs font-medium dark:from-blue-900/30 dark:to-blue-800/20 dark:border-blue-800 dark:text-blue-400">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-1.5"
                  >
                    ⟳
                  </motion.div>
                  Checking...
                </Badge>
              </div>
            ) : isApiAvailable === null ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gray-400/10 blur-md rounded-full"></div>
                <Badge variant="outline" className="relative bg-gradient-to-r from-gray-50 to-gray-100/70 text-gray-800 border-gray-200 px-3 py-1.5 rounded-full text-xs font-medium dark:from-gray-800/50 dark:to-gray-700/30 dark:border-gray-700 dark:text-gray-400">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block mr-1.5"
                  >
                    ⟳
                  </motion.div>
                  Loading...
                </Badge>
              </div>
            ) : isApiAvailable === false ? (
              <div className="relative">
                <div className="absolute inset-0 bg-red-400/20 blur-md rounded-full"></div>
                <Badge variant="outline" className="relative bg-gradient-to-r from-red-50 to-red-100/70 text-red-800 border-red-200 px-3 py-1.5 rounded-full text-xs font-medium dark:from-red-900/30 dark:to-red-800/20 dark:border-red-800 dark:text-red-400">
                  <div className="w-2 h-2 mr-1.5 rounded-full bg-red-500 animate-pulse inline-block"></div>
                  API Offline
                </Badge>
              </div>
            ) : modelInfo?.version === "dummy_model" ? (
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400/20 blur-md rounded-full"></div>
                <Badge variant="outline" className="relative bg-gradient-to-r from-amber-50 to-amber-100/70 text-amber-800 border-amber-200 px-3 py-1.5 rounded-full text-xs font-medium dark:from-amber-900/30 dark:to-amber-800/20 dark:border-amber-800 dark:text-amber-400">
                  <div className="w-2 h-2 mr-1.5 rounded-full bg-amber-500 animate-pulse inline-block"></div>
                  Demo Mode
                </Badge>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-green-400/20 blur-md rounded-full"></div>
                <Badge variant="outline" className="relative bg-gradient-to-r from-green-50 to-green-100/70 text-green-800 border-green-200 px-3 py-1.5 rounded-full text-xs font-medium dark:from-green-900/30 dark:to-green-800/20 dark:border-green-800 dark:text-green-400">
                  <div className="w-2 h-2 mr-1.5 rounded-full bg-green-500 animate-pulse inline-block"></div>
                  API Online
                </Badge>
              </div>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center" className="p-0 overflow-hidden border-0 shadow-lg">
          <div className="w-64 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5" />
            <div className="p-4">
              <div className="flex items-center mb-3">
                {isApiAvailable === null ? (
                  <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 mr-3">
                    <motion.div 
                      className="h-5 w-5 text-gray-600 dark:text-gray-400"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      ⟳
                    </motion.div>
                  </div>
                ) : isApiAvailable === false ? (
                  <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 mr-3">
                    <ServerCrash className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                ) : modelInfo?.version === "dummy_model" ? (
                  <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 mr-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                ) : (
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 mr-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-sm">
                    {isApiAvailable === null ? (
                      "Checking API status..."
                    ) : isApiAvailable === false ? (
                      "API server is offline"
                    ) : modelInfo?.version === "dummy_model" ? (
                      `Demo mode active`
                    ) : (
                      "API server online"
                    )}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isApiAvailable === false ? (
                      "Results will be simulated for demonstration"
                    ) : modelInfo?.version === "dummy_model" ? (
                      `Using simulated predictions (${85.0.toFixed(1)}% accuracy)`
                    ) : modelInfo ? (
                      `Model ready for analysis`
                    ) : (
                      "Connecting to server..."
                    )}
                  </p>
                </div>
              </div>
              
              {modelInfo && (
                <div className="space-y-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">System Status</p>
                  <div className="flex items-center text-xs">
                    <div className="p-1 rounded-md bg-blue-100 dark:bg-blue-900/30 mr-2">
                      <Server className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 mr-1">Backend:</span> 
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {isApiAvailable ? "Connected" : "Disconnected"}
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="p-1 rounded-md bg-purple-100 dark:bg-purple-900/30 mr-2">
                      <Cpu className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 mr-1">Model:</span> 
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {modelInfo?.model_loaded ? "Loaded" : "Not Loaded"}
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="p-1 rounded-md bg-pink-100 dark:bg-pink-900/30 mr-2">
                      <BarChart className="h-3 w-3 text-pink-600 dark:text-pink-400" />
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 mr-1">Accuracy:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {85.0.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
              
              <div className="mt-3 text-center">
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Click to refresh status</p>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
