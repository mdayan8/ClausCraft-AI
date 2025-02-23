
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
    const registerUser = async () => {
      if (!user && !registerMutation.isPending && !registerMutation.isSuccess) {
        await registerMutation.mutateAsync({ 
          email: "user@example.com", 
          password: "password123" 
        });
      }
    };
    registerUser();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl">Logging in automatically...</h1>
      </div>
    </div>
  );
}
