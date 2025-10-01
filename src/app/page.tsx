import HeroVanishInput from '@/components/HeroVanishInput'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section - Full Screen */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-800 mb-8">
              Pravay
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 mb-12 max-w-4xl mx-auto">
              Where purpose begins.
            </p>
            <HeroVanishInput />
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <a href="#how-it-works" className="bg-gray-800 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-900 transition-colors">
                Start Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section id="how-it-works" className="py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
              You're not lazy.
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-6">
              You're just not doing what you're meant to do.
            </p>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Most people spend years drifting—jumping between jobs, trying new hobbies, hoping something will finally click. 
              The problem isn't you. It's that no one ever helped you discover what truly drives you.
            </p>
          </div>
        </div>
      </section>

      {/* Why We Built This Section */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
              We built this for you.
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-6">
              Traditional career tests give you generic labels. Self-help books tell you to "follow your passion" 
              without showing you how to find it.
            </p>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Pravay uses AI to have real conversations with you—asking the right questions, 
              identifying patterns you've missed, and uncovering what actually makes you come alive.
            </p>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
              See it in action
            </h2>
          </div>
          {/* Video Placeholder */}
          <div className="relative aspect-video bg-gray-100 rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-gray-600 text-lg">Video coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Stop drifting. Start living.
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
            Your purpose is waiting. Let's find it together.
          </p>
          <a 
            href="/login" 
            className="bg-white text-gray-900 px-12 py-5 rounded-lg text-xl font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Begin Your Journey
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              © 2025 Pravay. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
