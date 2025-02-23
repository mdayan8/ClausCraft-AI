import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, InsertUser } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Scale, Gavel } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  if (user) {
    setLocation("/");
    return null;
  }

  const onSubmit = (data: InsertUser) => {
    if (isLogin) {
      loginMutation.mutate(data);
    } else {
      registerMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{isLogin ? "Login" : "Register"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  {isLogin ? "Login" : "Register"}
                </Button>
              </form>
            </Form>
            <p className="text-center mt-4">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Register" : "Login"}
              </Button>
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="hidden md:flex flex-col justify-center p-8 bg-primary text-primary-foreground">
        <div className="max-w-md mx-auto space-y-6">
          <h1 className="text-4xl font-bold">ClauseCraft AI</h1>
          <p className="text-xl">
            Your AI-powered legal assistant for contract analysis, generation, and expert guidance.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="flex items-center gap-2">
              <Scale className="h-6 w-6" />
              <span>Contract Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Gavel className="h-6 w-6" />
              <span>Legal Guidance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}