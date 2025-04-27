import { ArrowRight } from "lucide-react"

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-12">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">How It Works</h2>
      <p className="text-xl text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-12">
        Our advanced system processes videos through multiple stages to deliver accurate results.
      </p>

      <div className="relative">
        {/* Connection line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-red-200 via-red-300 to-red-200 dark:from-red-900/30 dark:via-red-800/40 dark:to-red-900/30 -translate-y-1/2 hidden md:block rounded-full"></div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Step 1 */}
          <div className="relative">
            <div className="bg-white dark:bg-gray-950 relative z-10 flex flex-col items-center p-5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 h-full">
              <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-5">
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">Upload Video</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Upload your video through our secure interface.
              </p>
            </div>
            <div className="hidden md:flex absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 z-20">
              <div className="bg-white dark:bg-gray-950 rounded-full p-2 shadow-sm border border-gray-100 dark:border-gray-800">
                <ArrowRight className="h-7 w-7 text-red-500" />
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="bg-white dark:bg-gray-950 relative z-10 flex flex-col items-center p-5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 h-full">
              <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-5">
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">Preprocessing</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                We extract frames, detect faces, and analyze audio.
              </p>
            </div>
            <div className="hidden md:flex absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 z-20">
              <div className="bg-white dark:bg-gray-950 rounded-full p-2 shadow-sm border border-gray-100 dark:border-gray-800">
                <ArrowRight className="h-7 w-7 text-red-500" />
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="bg-white dark:bg-gray-950 relative z-10 flex flex-col items-center p-5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 h-full">
              <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-5">
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">AI Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Our deep learning models analyze multiple behavioral cues with 67% accuracy.
              </p>
            </div>
            <div className="hidden md:flex absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 z-20">
              <div className="bg-white dark:bg-gray-950 rounded-full p-2 shadow-sm border border-gray-100 dark:border-gray-800">
                <ArrowRight className="h-7 w-7 text-red-500" />
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative">
            <div className="bg-white dark:bg-gray-950 relative z-10 flex flex-col items-center p-5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 h-full">
              <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-5">
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">4</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">Results</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Get detailed analysis with confidence scores and explanations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
