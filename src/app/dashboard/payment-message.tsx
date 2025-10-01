'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PaymentMessage() {
  const searchParams = useSearchParams()
  const payment = searchParams.get('payment')
  const router = useRouter()
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (payment) {
      const timer = setTimeout(() => setShow(false), 10000)
      return () => clearTimeout(timer)
    }
  }, [payment])

  // Redirect to /dashboard (without query) after 2s when payment was successful
  useEffect(() => {
    if (payment === 'success') {
      const redirectTimer = setTimeout(() => {
        router.replace('/dashboard')
      }, 2000)
      return () => clearTimeout(redirectTimer)
    }
  }, [payment, router])

  if (!payment || !show) return null

  return (
    <div className="mb-6">
      {payment === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-green-800">Payment Successful! 🎉</h3>
              <p className="mt-1 text-sm text-green-700">Your credits have been added!</p>
            </div>
            <button onClick={() => setShow(false)} className="ml-3 text-green-600 hover:text-green-800">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {payment === 'cancelled' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-yellow-800">Payment Cancelled</h3>
              <p className="mt-1 text-sm text-yellow-700">No worries! You can purchase anytime.</p>
            </div>
            <button onClick={() => setShow(false)} className="ml-3 text-yellow-600 hover:text-yellow-800">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
