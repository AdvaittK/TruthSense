import { Upload } from "@/components/upload"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <header className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-scan-face"
              >
                <path d="M3 7v2a10 10 0 0 0 20 0V7" />
                <path d="M12 6h0" />
                <path d="M8 9h0" />
                <path d="M16 9h0" />
                <path d="M8 13a4 4 0 0 0 8 0" />
              </svg>
            </span>
            Lie Detection
          </h1>
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              How It Works
            </a>
            <a href="#upload" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Try It
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Advanced Lie Detection System
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Upload a video and our AI will analyze facial expressions, voice patterns, and micro-gestures to determine
            truthfulness with high accuracy.
          </p>
          <a
            href="#upload"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Try It Now
          </a>
        </section>

        <Features />
        <HowItWorks />

        <section id="upload" className="py-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Upload Your Video</h2>
            <Upload />
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="mb-6 text-center w-full">
              <h3 className="text-xl font-bold flex items-center gap-2 justify-center">
              <span className="text-red-500">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-scan-face"
                >
                <path d="M3 7v2a10 10 0 0 0 20 0V7" />
                <path d="M12 6h0" />
                <path d="M8 9h0" />
                <path d="M16 9h0" />
                <path d="M8 13a4 4 0 0 0 8 0" />
                </svg>
              </span>
              Lie Detection 
              </h3>
              <p className="text-gray-400 mt-2">Advanced AI-powered lie detection</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Lie Detection System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
