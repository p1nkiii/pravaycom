'use client'

import Link from 'next/link'
import { motion } from 'motion/react'

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Error Content */}
      <section className="py-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="shadow-lg mx-auto w-full max-w-md rounded-2xl bg-white p-8 text-center border border-gray-100"
          >
            {/* Error Icon */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6"
            >
              <svg 
                className="w-8 h-8 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Oops! Something went wrong
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-gray-600 mb-8 leading-relaxed"
            >
              We encountered an unexpected error. Don&apos;t worry, our team has been notified and we&apos;re working to fix it.
            </motion.p>

            {/* Action Button */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link 
                href="/"
                className="block w-full bg-sky-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-sky-600 transition-colors"
              >
                Go Home
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 pt-6 border-t border-gray-200"
            >
              <p className="text-sm text-gray-500">
                If this problem persists, please contact our support team.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600">
              © 2025 Pravay. All rights reserved.
            </p>
            <Link 
              href="/impressum" 
              className="text-gray-600 hover:text-sky-500 transition-colors text-sm"
            >
              Impressum
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}