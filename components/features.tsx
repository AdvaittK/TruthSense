"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Fingerprint, Gauge, ShieldCheck, Zap, Video } from "lucide-react"
import { motion } from "framer-motion"

export function Features() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <section id="features" className="py-20 relative">
      {/* Background decorative elements */}
      <div className="absolute top-40 right-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-40 left-20 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl -z-10"></div>
      
      {/* Section header with enhanced styling */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/60 dark:to-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg p-8 mb-16 max-w-4xl mx-auto">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-gradient-to-br from-red-500/20 to-purple-600/20 blur-2xl rounded-full"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center relative z-10"
        >
          <motion.div className="mb-4 inline-block">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
              <span className="w-1 h-1 mr-1.5 rounded-full bg-red-500 animate-pulse"></span>
              Cutting-Edge Technology
            </span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-700">
            Key Features
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto">
            Our advanced lie detection system combines multiple analysis techniques 
            for <span className="font-semibold text-red-500 dark:text-red-400">85% accuracy</span> results.
          </p>
        </motion.div>
      </div>

      {/* Enhanced feature cards grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        {/* Feature 1 */}
        <motion.div variants={item}>
          <Card className="border dark:border-gray-800 hover:border-red-200 dark:hover:border-red-900/50 transition-all hover:shadow-xl overflow-hidden group h-full relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="pb-2 relative">
              <motion.div 
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="bg-gradient-to-br from-red-400 to-red-600 dark:from-red-600 dark:to-red-800 p-3 rounded-xl w-14 h-14 flex items-center justify-center mb-3 shadow-lg group-hover:shadow-red-500/20 transition-all"
              >
                <Brain className="h-8 w-8 text-white" />
              </motion.div>
              <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-shimmer bg-300% animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardTitle className="text-xl font-bold">AI-Powered Analysis</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Deep learning models trained on thousands of examples of truthful and deceptive behavior.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Our system uses state-of-the-art neural networks to detect patterns invisible to the human eye, achieving
                85% accuracy with our current model, which continues to improve with training.
              </p>
              <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-red-400 to-red-600 mt-4 transition-all duration-300 rounded-full"></div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature 2 */}
        <motion.div variants={item}>
          <Card className="border dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-900/50 transition-all hover:shadow-xl overflow-hidden group h-full relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="pb-2 relative">
              <motion.div 
                whileHover={{ rotate: -5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="bg-gradient-to-br from-purple-400 to-purple-600 dark:from-purple-600 dark:to-purple-800 p-3 rounded-xl w-14 h-14 flex items-center justify-center mb-3 shadow-lg group-hover:shadow-purple-500/20 transition-all"
              >
                <Fingerprint className="h-8 w-8 text-white" />
              </motion.div>
              <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-shimmer bg-300% animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardTitle className="text-xl font-bold">Micro-Expression Detection</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">Identifies subtle facial expressions that last for milliseconds.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Our system can detect micro-expressions that occur involuntarily when someone is being deceptive,
                providing crucial insights into truthfulness.
              </p>
              <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-purple-400 to-purple-600 mt-4 transition-all duration-300 rounded-full"></div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature 3 */}
        <motion.div variants={item}>
          <Card className="border dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900/50 transition-all hover:shadow-xl overflow-hidden group h-full relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="pb-2 relative">
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800 p-3 rounded-xl w-14 h-14 flex items-center justify-center mb-3 shadow-lg group-hover:shadow-blue-500/20 transition-all"
              >
                <Gauge className="h-8 w-8 text-white" />
              </motion.div>
              <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-shimmer bg-300% animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardTitle className="text-xl font-bold">Confidence Metrics</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">Detailed confidence scores for each analysis component.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Get transparent confidence scores for facial analysis, voice patterns, and micro-gestures, allowing you to
                understand the strength of each prediction.
              </p>
              <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-blue-400 to-blue-600 mt-4 transition-all duration-300 rounded-full"></div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature 4 */}
        <motion.div variants={item}>
          <Card className="border dark:border-gray-800 hover:border-green-200 dark:hover:border-green-900/50 transition-all hover:shadow-xl overflow-hidden group h-full relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="pb-2 relative">
              <motion.div 
                whileHover={{ rotate: -10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="bg-gradient-to-br from-green-400 to-green-600 dark:from-green-600 dark:to-green-800 p-3 rounded-xl w-14 h-14 flex items-center justify-center mb-3 shadow-lg group-hover:shadow-green-500/20 transition-all"
              >
                <ShieldCheck className="h-8 w-8 text-white" />
              </motion.div>
              <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-shimmer bg-300% animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardTitle className="text-xl font-bold">Privacy-Focused</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">Your videos are processed securely and never stored permanently.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We prioritize your privacy. Videos are processed in a secure environment and automatically deleted after
                analysis is complete.
              </p>
              <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-green-400 to-green-600 mt-4 transition-all duration-300 rounded-full"></div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature 5 */}
        <motion.div variants={item}>
          <Card className="border dark:border-gray-800 hover:border-amber-200 dark:hover:border-amber-900/50 transition-all hover:shadow-xl overflow-hidden group h-full relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="pb-2 relative">
              <motion.div 
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="bg-gradient-to-br from-amber-400 to-amber-600 dark:from-amber-600 dark:to-amber-800 p-3 rounded-xl w-14 h-14 flex items-center justify-center mb-3 shadow-lg group-hover:shadow-amber-500/20 transition-all"
              >
                <Zap className="h-8 w-8 text-white" />
              </motion.div>
              <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-shimmer bg-300% animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardTitle className="text-xl font-bold">Fast Processing</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">Get results in seconds, not minutes or hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Our optimized processing pipeline delivers results quickly, allowing you to analyze videos efficiently
                without long wait times.
              </p>
              <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-amber-400 to-amber-600 mt-4 transition-all duration-300 rounded-full"></div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature 6 */}
        <motion.div variants={item}>
          <Card className="border dark:border-gray-800 hover:border-pink-200 dark:hover:border-pink-900/50 transition-all hover:shadow-xl overflow-hidden group h-full relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-transparent rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="pb-2 relative">
              <motion.div 
                whileHover={{ rotate: -15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="bg-gradient-to-br from-pink-400 to-pink-600 dark:from-pink-600 dark:to-pink-800 p-3 rounded-xl w-14 h-14 flex items-center justify-center mb-3 shadow-lg group-hover:shadow-pink-500/20 transition-all"
              >
                <Video className="h-8 w-8 text-white" />
              </motion.div>
              <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-shimmer bg-300% animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardTitle className="text-xl font-bold">Multi-Modal Analysis</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">Combines visual, audio, and behavioral analysis.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                By analyzing multiple channels simultaneously, our system achieves 85% accuracy, significantly higher than 
                single-mode detection systems.
              </p>
              <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-pink-400 to-pink-600 mt-4 transition-all duration-300 rounded-full"></div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  )
}
