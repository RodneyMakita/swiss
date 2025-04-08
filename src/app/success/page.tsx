'use client';

import { Suspense } from 'react';
import { CircleCheckIcon, Loading, SuccessContent } from './SuccessContent';

export default function SuccessPage() {
	return (
		<Suspense fallback={<Loading />}>
			<SuccessContent />
		</Suspense>
	);
}
