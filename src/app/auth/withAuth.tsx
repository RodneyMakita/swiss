import React from 'react';
import { useRouter } from 'next/navigation'; // Use this for Next.js 13+
import { useAuth } from './AuthContext'; // Adjust the import based on your setup

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper: React.FC<P> = (props) => {
    const { user } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
      if (!user) {
        router.push('/signin');
      }
    }, [user, router]);

    if (!user) {
      return <div>Loading...</div>; // Optional: display a loading state
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
