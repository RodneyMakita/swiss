'use client';

import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JSX, SVGProps, useEffect, useState } from "react";
import '@/app/globals.css';

export default function SuccessPage() {
  const [paymentDetails, setPaymentDetails] = useState<{
    amount?: string;
    date?: string;
    paymentMethod?: string;
  }>({});
  
  const searchParams = useSearchParams(); // Use the useSearchParams hook
  const amount = searchParams.get('amount'); // Get the 'amount' query parameter

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      // Mock data, replace with actual data if needed
      const details = {
        amount: amount ? `$${(parseFloat(amount) / 100).toFixed(2)}` : 'N/A',
        date: new Date().toLocaleDateString(), // For demo purposes, use current date
        paymentMethod: "Visa ending in 1234", // Mock data, replace with actual
      };
      setPaymentDetails(details);
    };

    fetchPaymentDetails();
  }, [amount]);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <CircleCheckIcon className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Payment Successful!</h1>
        <p className="mt-4 text-muted-foreground">Thank you for your payment. We appreciate your business.</p>
      </div>
      <div className="mt-8 w-full max-w-md space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">{paymentDetails.amount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{paymentDetails.date}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="font-medium">{paymentDetails.paymentMethod}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="ml-auto">Download Receipt</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function CircleCheckIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
