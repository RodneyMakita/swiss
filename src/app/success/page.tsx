'use client';

import { useSearchParams, useRouter } from 'next/navigation'; // Import useRouter
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { JSX, SVGProps, useEffect, useState } from 'react';
import { Suspense } from 'react';
import '@/app/globals.css';

interface PaymentDetails {
	amount?: string;
	date?: string;
	paymentMethod?: string;
}

export default function SuccessPage() {
	const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({});
	const searchParams = useSearchParams(); // Use the useSearchParams hook
	const sessionId = searchParams.get('session_id'); // Get the 'session_id' query parameter
	const router = useRouter(); // Use the useRouter hook for navigation

	useEffect(() => {
		const fetchPaymentDetails = async () => {
			if (!sessionId) return;

			try {
				const response = await fetch(`/api/get-payment-details?session_id=${sessionId}`);
				const details = await response.json();

				if (response.ok) {
					setPaymentDetails({
						amount: details.amount ? `${(details.amount / 100).toFixed(2)} ${details.currency.toUpperCase()}` : 'N/A',
						date: new Date(details.created * 1000).toLocaleDateString(),
						paymentMethod: details.payment_method ? details.payment_method : 'N/A',
					});
				} else {
					console.error('Error fetching payment details:', details.error);
				}
			} catch (error) {
				console.error('Error fetching payment details:', error);
			}
		};

		fetchPaymentDetails();
	}, [sessionId]);

	return (
		<Suspense fallback={<Loading />}>
			<div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-md text-center">
					<CircleCheckIcon className="mx-auto h-16 w-16 text-green-500" />
					<h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
						Payment Successful!
					</h1>
					<p className="mt-4 text-muted-foreground">
						Thank you for your payment. We appreciate your business.
					</p>
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
							<Button className="ml-auto" onClick={() => router.push('/')}>
								Go Back Home
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</Suspense>
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

function Loading() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<span>Loading...</span>
		</div>
	);
}
