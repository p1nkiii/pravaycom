import { login, signup } from './actions'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-gray-800">PassionAI</a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Form Section */}
      <section className="py-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8">
            <h2 className="text-xl font-bold text-gray-800">
              Welcome to PassionAI
            </h2>
            <p className="mt-2 max-w-sm text-sm text-gray-600">
              Sign in to start discovering your true passion through AI conversations
            </p>

            <form className="my-8" action={login}>
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
                />
              </LabelInputContainer>

              <button
                className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-gray-800 to-gray-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
                type="submit"
              >
                Sign In &rarr;
                <BottomGradient />
              </button>

              <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

              <button
                formAction={signup}
                className="group/btn shadow-input relative flex h-10 w-full items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 font-medium text-gray-800 border border-gray-200 hover:bg-gray-100 transition-colors"
                type="submit"
              >
                <span className="text-sm">
                  Create New Account
                </span>
                <BottomGradient />
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                By signing in, you agree to our{' '}
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
              <a href="/" className="text-gray-800 font-medium hover:underline">
                Learn more about PassionAI
              </a>
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