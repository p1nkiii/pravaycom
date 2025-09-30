import { signup } from './actions'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-800">PassionAI</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Signup Form Section */}
      <section className="py-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8">
            <h2 className="text-xl font-bold text-gray-800">
              Create Your Account
            </h2>
            <p className="mt-2 max-w-sm text-sm text-gray-600">
              Join PassionAI and start discovering your true passion through AI conversations
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
                  min={13}
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
                className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-gray-800 to-gray-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
                type="submit"
              >
                Create Account &rarr;
                <BottomGradient />
              </button>

              <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="text-gray-800 font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-gray-800 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-gray-800 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Ready to discover your passion?{' '}
              <Link href="/" className="text-gray-800 font-medium hover:underline">
                Learn more about PassionAI
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
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

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
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
