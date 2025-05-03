"use client"

import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function HowItWorks() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <section id="how-it-works" className="py-20 relative">
      {/* Background decorative elements */}
      <div className="absolute top-40 left-20 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-40 right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>

      {/* Section header with enhanced styling */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/60 dark:to-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg p-8 mb-16 max-w-4xl mx-auto">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-600/20 blur-2xl rounded-full"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center relative z-10"
        >
          <motion.div className="mb-4 inline-block">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
              <span className="w-1 h-1 mr-1.5 rounded-full bg-purple-500 animate-pulse"></span>
              4-Step Process
            </span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            How It Works
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto">
            Our advanced system processes videos through multiple stages to deliver 
            <span className="font-semibold text-purple-500 dark:text-purple-400"> accurate results</span>.
          </p>
        </motion.div>
      </div>

      <div className="relative">
        {/* Connection line removed as it's not needed anymore */}

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8 relative"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Step 1 */}
          <motion.div className="relative" variants={item}>
            <motion.div 
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm relative z-10 flex flex-col items-center p-8 rounded-xl shadow-lg border border-gray-100/80 dark:border-gray-800/80 h-full hover:shadow-xl transition-all duration-300 group overflow-hidden"
              whileHover={{ y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <motion.div 
                className="w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-red-600 dark:from-red-600 dark:to-red-800 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-red-500/20 transition-shadow"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <span className="text-2xl font-bold text-white">1</span>
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">Upload Video</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Upload your video through our secure interface. We accept most common video formats.
              </p>
              <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-red-400 to-red-600 mt-4 transition-all duration-300 rounded-full"></div>
            </motion.div>
            <div className="hidden md:flex absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 z-20">
              <motion.div 
                className="bg-white dark:bg-gray-900 rounded-full p-2 shadow-lg border border-gray-100/80 dark:border-gray-800/80"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <ArrowRight className="h-7 w-7 text-red-500 dark:text-red-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div className="relative" variants={item}>
            <motion.div 
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm relative z-10 flex flex-col items-center p-8 rounded-xl shadow-lg border border-gray-100/80 dark:border-gray-800/80 h-full hover:shadow-xl transition-all duration-300 group overflow-hidden"
              whileHover={{ y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <motion.div 
                className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 dark:from-amber-600 dark:to-amber-800 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-amber-500/20 transition-shadow"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <span className="text-2xl font-bold text-white">2</span>
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">Preprocessing</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                We extract frames, detect faces, and analyze audio to prepare for AI processing.
              </p>
              <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-amber-400 to-amber-600 mt-4 transition-all duration-300 rounded-full"></div>
            </motion.div>
            <div className="hidden md:flex absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 z-20">
              <motion.div 
                className="bg-white dark:bg-gray-900 rounded-full p-2 shadow-lg border border-gray-100/80 dark:border-gray-800/80"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.3 }}
              >
                <ArrowRight className="h-7 w-7 text-amber-500 dark:text-amber-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div className="relative" variants={item}>
            <motion.div 
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm relative z-10 flex flex-col items-center p-8 rounded-xl shadow-lg border border-gray-100/80 dark:border-gray-800/80 h-full hover:shadow-xl transition-all duration-300 group overflow-hidden"
              whileHover={{ y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <motion.div 
                className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 dark:from-purple-600 dark:to-purple-800 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-purple-500/20 transition-shadow"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <span className="text-2xl font-bold text-white">3</span>
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">AI Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Our deep learning models analyze multiple behavioral cues with 85% accuracy to detect deception.
              </p>
              <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-purple-400 to-purple-600 mt-4 transition-all duration-300 rounded-full"></div>
            </motion.div>
            <div className="hidden md:flex absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 z-20">
              <motion.div 
                className="bg-white dark:bg-gray-900 rounded-full p-2 shadow-lg border border-gray-100/80 dark:border-gray-800/80"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.6 }}
              >
                <ArrowRight className="h-7 w-7 text-purple-500 dark:text-purple-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Step 4 */}
          <motion.div className="relative" variants={item}>
            <motion.div 
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm relative z-10 flex flex-col items-center p-8 rounded-xl shadow-lg border border-gray-100/80 dark:border-gray-800/80 h-full hover:shadow-xl transition-all duration-300 group overflow-hidden"
              whileHover={{ y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <motion.div 
                className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-blue-500/20 transition-shadow"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <span className="text-2xl font-bold text-white">4</span>
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">Results</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Get detailed analysis with confidence scores and explanations for each detected behavior.
              </p>
              
              <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-blue-400 to-blue-600 mt-4 transition-all duration-300 rounded-full"></div>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Enhanced mobile steps connection lines */}
        <div className="md:hidden">
          {/* Removing mobile connection lines as well */}
        </div>
        
        {/* Bottom decoration */}
        <div className="hidden"></div>
      </div>
    </section>
  )
}
