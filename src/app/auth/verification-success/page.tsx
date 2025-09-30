'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function VerificationSuccessPage() {
  const [countdown, setCountdown] = useState(3)
  const router = useRouter()

  useEffect(() => {
    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/login')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Cleanup timer on component unmount
    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-800">Pravay</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Success Content */}
      <section className="py-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 text-center">
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg 
                className="w-8 h-8 text-green-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Email Verified Successfully! 🎉
            </h2>
            
            <p className="text-gray-600 mb-6">
              Your email has been verified and your account is now active.
            </p>

            {/* Countdown and redirect info */}
            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {countdown}
                </div>
              </div>
              <p className="text-green-800 font-medium mb-2">
                Redirecting to login page...
              </p>
              <p className="text-sm text-green-700">
                You&apos;ll be automatically redirected in {countdown} second{countdown !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Manual action buttons */}
            <div className="space-y-3">
              <Link 
                href="/login"
                className="block w-full bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Continue to Login
              </Link>
              
              <Link
                href="/dashboard"
                className="block text-gray-600 hover:text-gray-800 text-sm"
              >
                Go to Dashboard
              </Link>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Welcome to Pravay! You can now sign in and start discovering your passion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              © 2024 Pravay. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
