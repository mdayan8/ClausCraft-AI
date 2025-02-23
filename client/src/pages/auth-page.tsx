import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuth } from "@/hooks/use-auth";

export default function AuthPage() {
  const [location, setLocation] = useLocation();
  const { user, registerMutation } = useAuth();

  useEffect(() => {
    if (!user) {
      // Auto-register with default credentials
      registerMutation.mutate({ 
        email: "user@example.com", 
        password: "password123" 
      });
    } else {
      setLocation("/dashboard");
    }
  }, [user, setLocation, registerMutation]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl">Logging in automatically...</h1>
      </div>
    </div>
  );
}