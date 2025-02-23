
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export default function AuthPage() {
  const [location, setLocation] = useLocation();
  const { user, registerMutation } = useAuth();

  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  useEffect(() => {
    if (!user && !registerMutation.isPending && !registerMutation.isSuccess && !registerMutation.isError) {
      registerMutation.mutate({ 
        email: "user@example.com", 
        password: "password123" 
      });
    }
  }, [user, registerMutation.isPending, registerMutation.isSuccess, registerMutation.isError]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl">Logging in automatically...</h1>
      </div>
    </div>
  );
}
