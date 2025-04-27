import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Fingerprint, Gauge, ShieldCheck, Zap, Video } from "lucide-react"

export function Features() {
  return (
    <section id="features" className="py-12">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">Key Features</h2>
      <p className="text-xl text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-12">
        Our advanced lie detection system combines multiple analysis techniques for high accuracy results.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <Brain className="h-8 w-8 text-red-500 mb-2" />
            <CardTitle>AI-Powered Analysis</CardTitle>
            <CardDescription>
              Deep learning models trained on thousands of examples of truthful and deceptive behavior.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              Our system uses state-of-the-art neural networks to detect patterns invisible to the human eye, achieving
              67% accuracy with our current model, which continues to improve with training.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <Fingerprint className="h-8 w-8 text-red-500 mb-2" />
            <CardTitle>Micro-Expression Detection</CardTitle>
            <CardDescription>Identifies subtle facial expressions that last for milliseconds.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              Our system can detect micro-expressions that occur involuntarily when someone is being deceptive,
              providing crucial insights into truthfulness.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <Gauge className="h-8 w-8 text-red-500 mb-2" />
            <CardTitle>Confidence Metrics</CardTitle>
            <CardDescription>Detailed confidence scores for each analysis component.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              Get transparent confidence scores for facial analysis, voice patterns, and micro-gestures, allowing you to
              understand the strength of each prediction.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <ShieldCheck className="h-8 w-8 text-red-500 mb-2" />
            <CardTitle>Privacy-Focused</CardTitle>
            <CardDescription>Your videos are processed securely and never stored permanently.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              We prioritize your privacy. Videos are processed in a secure environment and automatically deleted after
              analysis is complete.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <Zap className="h-8 w-8 text-red-500 mb-2" />
            <CardTitle>Fast Processing</CardTitle>
            <CardDescription>Get results in seconds, not minutes or hours.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              Our optimized processing pipeline delivers results quickly, allowing you to analyze videos efficiently
              without long wait times.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <Video className="h-8 w-8 text-red-500 mb-2" />
            <CardTitle>Multi-Modal Analysis</CardTitle>
            <CardDescription>Combines visual, audio, and behavioral analysis.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              By analyzing multiple channels simultaneously, our system achieves 67% accuracy, significantly higher than 
              single-mode detection systems.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
