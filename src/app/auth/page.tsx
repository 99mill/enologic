"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getRandomImage } from "@/utils/unsplash";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/utils/supabase";
import { useToast } from "@/components/hooks/use-toast";
import { UnsplashImageAttribution } from "@/components/landing/hero-image-attribution";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [backgroundImage, setBackgroundImage] = useState<any>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchBackgroundImage() {
      const image = await getRandomImage("wine cellar");
      setBackgroundImage(image);
    }
    fetchBackgroundImage();
  }, []);

  const handleSubmit = async (
    e: React.FormEvent,
    action: "login" | "signup"
  ) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (action === "signup") {
        result = await supabase.auth.signUp({ email, password });
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
      }

      if (result.error) throw result.error;

      if (action === "signup") {
        toast({
          title: "Sign up successful",
          description: "Please check your email to confirm your account.",
        });
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBypassLogin = () => {
    router.push("/dashboard");
  };

  return (
    <div className="relative min-h-screen">
      {/* Background for mobile */}
      {/* <div className="md:hidden">
        <div 
          className="fixed inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${backgroundImage?.url || "/placeholder.svg?height=843&width=1280"})`,
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
      </div> */}

      <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-white">
        {/* Left panel with background */}
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImage?.url})`,
            }}
          >
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Enologic
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This winery management system has revolutionized our
                operations, streamlining processes and enhancing our
                productivity significantly.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis, Vineyard Owner</footer>
            </blockquote>
          </div>
          {/* Unsplash Image Attribution */}
          <UnsplashImageAttribution image={backgroundImage} />
        </div>

        {/* Right panel with form */}
        <div className="lg:p-8 w-full">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <Card className="w-full bg-gray-50 border border-gray-200">
              <CardHeader>
                <CardTitle>Welcome to Enologic</CardTitle>
                <CardDescription>
                  Sign up or log in to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login">
                    <form onSubmit={(e) => handleSubmit(e, "login")}>
                      <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <Input
                            id="email-login"
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <Input
                            id="password-login"
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <Button
                        className="w-full mt-4"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading && (
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Login
                      </Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="signup">
                    <form onSubmit={(e) => handleSubmit(e, "signup")}>
                      <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <Input
                            id="email-signup"
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <Input
                            id="password-signup"
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <Button
                        className="w-full mt-4"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading && (
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Sign Up
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="link" asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
              </CardFooter>
            </Card>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              onClick={handleGitHubSignIn}
              className="w-full"
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.gitHub className="mr-2 h-4 w-4" />
              )}{" "}
              GitHub
            </Button>
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Development bypass button */}
      {process.env.NODE_ENV === "development" && (
        <Button
          className="fixed bottom-4 right-4"
          onClick={() => router.push("/dashboard")}
        >
          Bypass Login (Dev Only)
        </Button>
      )}
    </div>
  );
}
