import Link from 'next/link'

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const params = await searchParams
  const email = params.email || 'your email'

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-800">PassionAI</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Check Email Content */}
      <section className="py-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 text-center">
            {/* Email Icon */}
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg 
                className="w-8 h-8 text-gray-800" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Check Your Email
            </h2>
            
            <p className="text-gray-600 mb-6">
              We sent a verification link to:
            </p>
            
            <p className="text-gray-800 font-semibold mb-8 break-all">
              {email}
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-gray-800 mb-3">Next Steps:</h3>
              <ol className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="font-bold mr-2">1.</span>
                  <span>Check your email inbox</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">2.</span>
                  <span>Click the verification link in the email</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">3.</span>
                  <span>You&apos;ll be automatically logged in</span>
                </li>
              </ol>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600 mb-4">
                Didn&apos;t receive the email?
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• Check your spam or junk folder</li>
                <li>• Make sure you entered the correct email</li>
                <li>• Wait a few minutes and check again</li>
              </ul>
              
              <div className="space-y-3">
                <Link 
                  href="/signup"
                  className="block w-full bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Try Again with Different Email
                </Link>
                
                <Link
                  href="/login"
                  className="block text-gray-600 hover:text-gray-800 text-sm"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              © 2024 PassionAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
