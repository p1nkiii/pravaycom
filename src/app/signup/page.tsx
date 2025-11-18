import { signup, signInWithGoogle } from './actions'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Signup Form Section */}
      <section className="py-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8">
            <h2 className="text-xl font-bold text-gray-800">
              Create Your Account
            </h2>
            <p className="mt-2 max-w-sm text-sm text-gray-600">
              Join Pravay and start discovering your true passion through AI conversations
            </p>

            <form className="my-8" action={signup}>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="first_name">First Name</Label>
                <Input 
                  id="first_name" 
                  name="first_name"
                  placeholder="John" 
                  type="text" 
                  required
                />
              </LabelInputContainer>

              <LabelInputContainer className="mb-4">
                <Label htmlFor="age">Age</Label>
                <Input 
                  id="age" 
                  name="age"
                  placeholder="25" 
                  type="number" 
                  required
                  min={0}
                  max={120}
                />
              </LabelInputContainer>

              <LabelInputContainer className="mb-4">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  name="email"
                  placeholder="your@email.com" 
                  type="email" 
                  required
                />
              </LabelInputContainer>
              
              <LabelInputContainer className="mb-8">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  name="password"
                  placeholder="••••••••" 
                  type="password" 
                  required
                  minLength={6}
                />
              </LabelInputContainer>

              <button
                className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-sky-500 to-sky-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
                type="submit"
              >
                Create Account &rarr;
                <BottomGradient />
              </button>
            </form>

            <div className="my-6 flex items-center">
              <div className="flex-grow h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              <span className="px-4 text-sm text-gray-500">Or continue with</span>
              <div className="flex-grow h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>

            <form action={signInWithGoogle}>
              <button
                type="submit"
                className="group/btn relative flex h-10 w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign up with Google
              </button>
            </form>

            <div className="mt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="text-gray-800 font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
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
  )
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
