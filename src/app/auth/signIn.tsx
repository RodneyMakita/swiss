import React, { useState } from "react";
import Logo from '@/assets/swiisspants-logo.png'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Spinner } from "@nextui-org/react";
import { auth } from "@/app/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from "firebase/auth";

export function SignInLoginIn() {
  const router = useRouter(); // Initialize router for redirection
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
    setError(null); // Clear any previous errors
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      console.log('User signed up and profile updated:', userCredential.user);
      router.push('/'); // Redirect after successful sign-up
    } catch (err) {
      console.error('Error during sign-up:', err);
      if (err instanceof Error) {
        if (err.message.includes('email')) {
          setError('Email already in use. Please use a different email.');
        } else if (err.message.includes('password')) {
          setError('Password is too weak. Please choose a stronger password.');
        } else {
          setError('Sign-up failed. Please try again.');
        }
      } else {
        setError('An unknown error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setError(null); // Clear any previous errors
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/'); // Redirect after successful sign-in
    } catch (error) {
      console.error("Authentication error:", error);
      if (error instanceof Error) {
        if (error.message.includes('user-not-found')) {
          setError('Account does not exist. Please check your email or sign up.');
        } else if (error.message.includes('wrong-password')) {
          setError('Incorrect password. Please try again.');
        } else {
          setError('Account does not exist. Please check your email or sign up.');
        }
      } else {
        setError('An unknown error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  

  const handleForgotPassword = async () => {
    setLoading(true);
    setError(null); // Clear any previous errors
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      console.log('Password reset email sent');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      setError('Failed to send password reset email. Please try again.');
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
          />
          {!showForgotPassword && (
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
              {isSignUp ? "Create an account" : "Sign in to your account"}
            </h2>
          )}
          {!showForgotPassword && (
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button
                type="button"
                className="font-medium text-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
                    placeholder="John Doe"
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
                <Label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                  Remember me
                </Label>
              </div>
              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
              <div>
                <Label htmlFor="reset-email" className="sr-only">
                  Email address
                </Label>
                <Input
                  id="reset-email"
                  name="reset-email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full rounded-md border-0 py-1.5 text-foreground ring-1 ring-inset ring-muted placeholder:text-muted-foreground focus:z-10 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Button type="button" className="w-full" onClick={handleForgotPassword}>
                  Reset password
                </Button>
              </div>
              {resetEmailSent && (
                <div className="text-sm text-green-500">
                  An email has been sent to {email} with instructions to reset your password.
                </div>
              )}
              <div className="text-sm text-center">
                <button
                  type="button"
                  className="font-medium text-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={() => setShowForgotPassword(false)}
                >
                  Login to your account
                </button>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="text-red-500 text-center mt-4">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
