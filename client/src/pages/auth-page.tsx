
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, registerMutation } = useAuth();

  useEffect(() => {
    if (user) {
      setLocation("/");
      return;
    }

    if (!registerMutation.isPending && !registerMutation.isSuccess && !registerMutation.isError) {
      registerMutation.mutate({
        email: "demo@example.com",
        password: "demo123"
      });
    }
  }, [user, registerMutation.isPending, registerMutation.isSuccess, registerMutation.isError]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl">Logging in...</h1>
      </div>
    </div>
  );
}
