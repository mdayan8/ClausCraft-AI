import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuth } from "@/hooks/use-auth";

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [location, setLocation] = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
        </div>

        {isLogin ? (
          <LoginForm onToggle={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onToggle={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}