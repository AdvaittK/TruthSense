"use client"

import { Upload } from "@/components/upload"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { ApiStatus } from "@/components/api-status"
import { motion } from "framer-motion"
import { ScanFace, Menu, X, ArrowRight, MoonStar, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useTheme } from "next-themes"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export default function Home() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <header className="sticky top-0 z-10 w-full backdrop-blur-lg bg-white/80 dark:bg-gray-950/90 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto py-4">
          <div className="flex justify-between items-center px-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <a href="#" className="flex items-center gap-2.5 group">
                <div className="bg-gradient-to-br from-red-500 to-red-700 p-2 rounded-lg shadow-lg group-hover:shadow-red-500/20 transition-all duration-300">
                  <ScanFace size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Truth<span className="text-red-500">Sense</span>
                  </h1>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-medium">
                    Advanced Lie Detection
                  </p>
                </div>
              </a>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <div className="bg-gray-100 dark:bg-gray-800/50 rounded-full p-1 mr-3">
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-1"
                >
                  {[
                    { href: "#features", label: "Features" },
                    { href: "#how-it-works", label: "How It Works" },
                    { href: "#upload", label: "Try It Now" }
                  ].map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors hover:bg-white dark:hover:bg-gray-800"
                    >
                      {item.label}
                    </a>
                  ))}
                </motion.div>
              </div>
              
              <div className="flex items-center gap-2 border-l pl-3 border-gray-200 dark:border-gray-700">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <MoonStar className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
                
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-purple-600 rounded-full opacity-70 group-hover:opacity-100 blur transition duration-300"></div>
                  <ApiStatus />
                </div>
              </div>
            </nav>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonStar className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-purple-600 rounded-full opacity-70 group-hover:opacity-100 blur transition duration-300"></div>
                <ApiStatus />
              </div>
              
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="ml-1 rounded-full border-gray-300 dark:border-gray-700">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] pr-0">
                  <div className="flex justify-between items-center mb-8 pr-6">
                    <div className="flex items-center gap-2">
                      <div className="bg-gradient-to-br from-red-500 to-red-700 p-1.5 rounded-md shadow-sm">
                        <ScanFace size={18} className="text-white" />
                      </div>
                      <h3 className="font-semibold text-lg">
                        Truth<span className="text-red-500">Sense</span>
                      </h3>
                    </div>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                  </div>
                  <div className="flex flex-col gap-1 pr-6">
                    {[
                      { href: "#features", label: "Features", icon: "✨" },
                      { href: "#how-it-works", label: "How It Works", icon: "🔍" },
                      { href: "#upload", label: "Try It Now", icon: "🚀" }
                    ].map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 text-lg rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="text-xl">{item.icon}</span>
                        {item.label}
                      </a>
                    ))}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between px-4">
                      <div className="text-sm text-gray-500">Model Status</div>
                      <ApiStatus />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-8 pb-20">
        {/* Hero Section with Glass Card Design */}
        <section className="relative mb-24">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-purple-600/10 rounded-3xl -z-10"></div>
          
          {/* Background decorative elements */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl -z-10"></div>
          
          <div className="relative overflow-hidden rounded-3xl bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-32 h-32 bg-gradient-to-br from-red-500/40 to-purple-600/40 blur-2xl rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-32 h-32 bg-gradient-to-tr from-red-500/30 to-purple-600/30 blur-2xl rounded-full"></div>
            
            <div className="py-16 px-8 text-center relative z-10">
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="flex flex-col items-center max-w-4xl mx-auto"
              >
                <motion.div variants={item} className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                    <span className="w-1 h-1 mr-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    Advanced AI Technology
                  </span>
                </motion.div>
                
                <motion.h2 
                  variants={item}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-600 font-extrabold">
                    Truth Detection
                  </span>{" "}
                  Powered by CNN-LSTM Model
                </motion.h2>
                
                <motion.p 
                  variants={item}
                  className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed"
                >
                  Upload a video and our advanced AI system will analyze facial expressions, 
                  voice patterns, and micro-gestures to determine truthfulness with 
                  <span className="font-semibold text-red-500 dark:text-red-400"> 85% accuracy</span>.
                </motion.p>
                
                <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white px-8 rounded-full shadow-lg hover:shadow-red-500/25 transition-all"
                    asChild
                  >
                    <a href="#upload" className="inline-flex items-center gap-2">
                      Try It Now
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                    asChild
                  >
                    <a href="#how-it-works" className="inline-flex items-center gap-2">
                      Learn How It Works
                    </a>
                  </Button>
                </motion.div>
                
                <motion.div 
                  variants={item} 
                  className="mt-12 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400"
                >
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 border-2 border-white dark:border-gray-900 flex items-center justify-center text-xs font-medium">
                        {i}
                      </div>
                    ))}
                  </div>
                  <p>Analyze you video now with our technology</p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features section and remaining content */}
        <Features />
        <HowItWorks />

        <section id="upload" className="py-20 relative">
          {/* Background decorative elements */}
          <div className="absolute top-40 right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-40 left-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -z-10"></div>
          
          {/* Enhanced section header with styling */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/60 dark:to-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg p-8 mb-16 max-w-4xl mx-auto">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-red-500/20 blur-2xl rounded-full"></div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center relative z-10"
            >
              <motion.div className="mb-4 inline-block">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  <span className="w-1 h-1 mr-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                  ANALYZE NOW
                </span>
              </motion.div>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-600">
                Upload Your Video
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto">
                Our advanced AI system will analyze the video for signs of deception using facial expressions, 
                voice patterns, and micro-gestures detection with 
                <span className="font-semibold text-blue-500 dark:text-blue-400"> industry-leading accuracy</span>.
              </p>
            </motion.div>
          </div>
          
          {/* Upload component wrapper with enhanced styling */}
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-red-500/5 rounded-3xl blur-lg -z-10 transform scale-105"></div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <Upload />
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="w-full bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and description */}
            <div className="col-span-1 md:col-span-2">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="bg-gradient-to-br from-red-500 to-red-700 p-2 rounded-lg shadow-lg">
                  <ScanFace size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight">
                    Truth<span className="text-red-500">Sense</span>
                  </h3>
                </div>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="text-gray-400 mb-6 max-w-md"
              >
                Our advanced AI system analyzes facial expressions, voice patterns, and micro-gestures to determine truthfulness with 85% accuracy. Perfect for interview analysis, security applications, and more.
              </motion.p>
              <div className="flex gap-4">
                {[
                  { id: "facebook", href: "#", icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path></svg> },
                  { id: "twitter", href: "#", icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg> },
                  { id: "github", href: "#", icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg> },
                  { id: "dribbble", href: "#", icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd"></path></svg> }
                ].map((social) => (
                  <a 
                    key={social.id} 
                    href={social.href} 
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={`Visit our ${social.id} page`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="md:ml-auto">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Navigate</h4>
              <ul className="space-y-2">
                {[
                  { href: "#features", label: "Features" },
                  { href: "#how-it-works", label: "How It Works" },
                  { href: "#upload", label: "Upload Video" },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-base text-gray-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3"></h4>
              <ul className="space-y-2">
                {[
                  { id: "docs", href: "#", label: "" },
                  { id: "research", href: "#", label: "" },
                  { id: "privacy", href: "#", label: "" },
                  { id: "terms", href: "#", label: "" },
                ].map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      className="text-base text-gray-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Status and copyright */}
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="bg-gray-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>System Online</span>
              </div>
              <ApiStatus />
            </div>
            
            <p className="text-sm">© {new Date().getFullYear()} TruthSense AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
