import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function PassionPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">Pravay</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.email}
              </span>
              <form action="/auth/logout" method="post">
                <button 
                  type="submit"
                  className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Discover Your Passion
          </h1>
          <p className="text-lg text-gray-600">
            Let&apos;s have a conversation to explore what truly drives you.
          </p>
        </div>

        {/* Chat Interface */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
          {/* Chat Messages Area */}
          <div className="h-96 p-6 overflow-y-auto border-b border-gray-200">
            <div className="space-y-4">
              {/* AI Welcome Message */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AI</span>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 max-w-md">
                  <p className="text-gray-800">
                    Hello! I&apos;m here to help you discover your passions. Let&apos;s start with a simple question: What activities or topics make you lose track of time when you&apos;re engaged with them?
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6">
            <form className="flex space-x-4">
              <input
                type="text"
                placeholder="Type your response here..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-sky-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-sky-600 transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
            <span>Question 1 of 5</span>
          </div>
        </div>
      </main>
    </div>
  )
}
