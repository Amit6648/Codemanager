import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div
      className="bg-background flex min-h-screen w-full flex-col items-center justify-center gap-6 p-6 md:p-10 backdrop-blur-2xl">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
