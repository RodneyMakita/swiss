import React, { useState } from "react";
import Logo from '@/assets/swiisspants-logo.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Spinner } from "@nextui-org/react";
import { auth, googleProvider, facebookProvider } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signInWithPopup,
} from "firebase/auth";

export function SignInLoginIn() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      console.log('User signed up and profile updated:', userCredential.user);
      router.push('/');
    } catch (err) {
      console.error('Error during sign-up:', err);
      setError('Sign-up failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error) {
      console.error("Authentication error:", error);
      setError('Sign-in failed. Please check your email and password and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google Sign-in successful:', result.user);
      router.push('/');
    } catch (error) {
      console.error('Google Sign-in error:', error);
      setError('Google Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      console.log('Facebook Sign-in successful:', result.user);
      router.push('/');
    } catch (error) {
      console.error('Facebook Sign-in error:', error);
      setError('Facebook Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      console.log('Password reset email sent');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      setError('Failed to send password reset email. Please check your email and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSignUp) {
      await handleSignUp();
    } else {
      await handleSignIn();
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Spinner size="lg" />
        </div>
      )}
      <div className="w-full max-w-md space-y-8">
        <div>
          <Image
            src={Logo}
            alt="Company Logo"
            className="mx-auto h-auto w-auto mb-20"
            priority
          />
          {!showForgotPassword && (
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
              {isSignUp ? "Create an account" : "Sign in to your account"}
            </h2>
          )}
          {!showForgotPassword && (
            <p className="mt-2 text-center text-sm text-black">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button
                type="button"
                className="font-medium text-black hover:text-muted-foreground"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          )}
        </div>
        {!showForgotPassword && (
          <form className="mt-8 space-y-6" onSubmit={handleFormSubmit}>
            <div className="-space-y-px rounded-md shadow-sm">
              {isSignUp && (
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="relative block w-full rounded-t-md border-0 py-1.5 text-foreground ring-1 ring-inset ring-muted placeholder:text-muted-foreground focus:z-10 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
                    placeholder="Rodney Timba"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}
              <div>
                <Label htmlFor="email-address">Email address</Label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`relative block w-full ${
                    isSignUp ? "rounded-none border-b-0" : "rounded-t-md border-0"
                  } py-1.5 text-foreground ring-1 ring-inset ring-muted placeholder:text-muted-foreground focus:z-10 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6`}
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={`relative block w-full ${
                    isSignUp ? "rounded-b-md border-0" : "rounded-b-md border-0"
                  } py-1.5 text-foreground ring-1 ring-inset ring-muted placeholder:text-muted-foreground focus:z-10 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox id="remember-me" name="remember-me" />
                <Label htmlFor="remember-me" className="ml-2 block text-sm text-black">
                  Remember me
                </Label>
              </div>
              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-black hover:text-muted-foreground"
                  onClick={() => setShowForgotPassword(!showForgotPassword)}
                >
                  Forgot your password?
                </button>
              </div>
            </div>
            <div>
              <Button type="submit" className="w-full">
                {isSignUp ? "Sign up" : "Sign in"}
              </Button>
              <Button type="button" onClick={handleGoogleSignIn} className="w-full mt-4 bg-red-500 text-white">
                Sign in with Google
              </Button>
              <Button type="button" onClick={handleFacebookSignIn} className="w-full mt-4 bg-blue-600 text-white">
                Sign in with Facebook
              </Button>
            </div>
          </form>
        )}
        {showForgotPassword && (
          <div className="absolute mt-2 w-full max-w-md rounded-md bg-background p-4 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Forgot your password?</h3>
              <p className="text-sm text-muted-foreground">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleForgotPassword();
              }}>
                <Label htmlFor="reset-email-address">Email address</Label>
                <Input
                  id="reset-email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full py-1.5 text-foreground ring-1 ring-inset ring-muted placeholder:text-muted-foreground sm:text-sm sm:leading-6"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" className="w-full mt-4">Send Reset Link</Button>
                {resetEmailSent && (
                  <p className="mt-2 text-sm text-green-500">Password reset email sent! Check your inbox.</p>
                )}
                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
              </form>
            </div>
          </div>
        )}
        {error && !showForgotPassword && (
          <div className="text-red-500 text-center mt-4">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
