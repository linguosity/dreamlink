"use client"

import { useState, useEffect } from "react";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from "../../lib/utils/supabase/browser-client";
import useSession from "../../lib/utils/supabase/use-session";
import LoginButton from "@/components/login-button";
import Link from "next/link";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const router = useRouter();
  const session = useSession();
  const supabase = createSupabaseClient();

  useEffect(() => {
    if (session) {
      console.log("LoginPage: User is logged in, redirecting to home");
      router.push('/');
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        console.log('LoginPage: Attempting to sign in...');
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        console.log('LoginPage: Sign in successful, redirecting to home...');
        router.push('/');
      } else {
        if (password !== repeatPassword) {
          setError("Passwords don't match");
          return;
        }
        if (!agreeToTerms) {
          setError("You must agree to the terms and conditions");
          return;
        }
        console.log('LoginPage: Attempting to sign up...');
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user && !data.session) {
          setError('Please check your email to confirm your account before signing in.');
        } else {
          console.log('LoginPage: Sign up successful, redirecting to home...');
          router.push('/');
        }
      }
    } catch (error: any) {
      console.error('LoginPage: Authentication error:', error);
      setError(error.message || 'An error occurred. Please try again.');
    }
  };

  console.log("LoginPage: Rendering login page");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Sign In to DreamLink" : "Create a DreamLink Account"}
        </h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Your email" />
            </div>
            <TextInput
              id="email"
              type="email"
              placeholder="name@flowbite.com"
              required
              shadow
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Your password" />
            </div>
            <TextInput
              id="password"
              type="password"
              required
              shadow
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {!isLogin && (
            <div>
              <div className="mb-2 block">
                <Label htmlFor="repeat-password" value="Repeat password" />
              </div>
              <TextInput
                id="repeat-password"
                type="password"
                required
                shadow
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
            </div>
          )}
          {isLogin ? (
            <div className="flex items-center gap-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <Label htmlFor="remember">Remember me</Label>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Checkbox 
                id="agree" 
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              {/* <Label htmlFor="agree" className="flex">
                I agree with the&nbsp;
                <Link href="#" className="text-cyan-600 hover:underline dark:text-cyan-500">
                  terms and conditions
                </Link>
              </Label> */}
            </div>
          )}
          <Button type="submit" color="blue">
            {isLogin ? "Sign In" : "Register new account"}
          </Button>
        </form>
        <div className="mt-4">
          <LoginButton nextUrl="/" />
        </div>
        <p className="mt-4 text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-cyan-600 hover:underline dark:text-cyan-500"
            onClick={() => setIsLogin(!isLogin)}
          > 
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}