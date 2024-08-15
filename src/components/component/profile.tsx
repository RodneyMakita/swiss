import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SVGProps } from 'react';
import { useAuth } from '@/app/auth/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/app/firebase';
import { User } from 'firebase/auth';
import { updateProfile } from 'firebase/auth';


export default function Profile() {
  const { user, signOut } = useAuth();

  const updateUserProfile = async (user: User, displayName: string) => {
    try {
      await updateProfile(user, { displayName });
      await setDoc(doc(db, 'users', user.uid), {
        displayName: displayName,
        email: user.email,
      });
      console.log('User profile updated');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect or handle post-logout action
      console.log('Successfully signed out');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:px-54 overflow-y-auto">
      <div className="bg-primary text-primary-foreground py-6 px-4 flex flex-col sm:flex-row items-center rounded-lg">
        <Avatar className="w-12 h-12 mb-4 sm:mb-0 sm:mr-4 rounded-sm">
          <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
          <AvatarFallback>{user?.displayName?.[0] || 'JD'}</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-lg font-semibold">{user?.displayName || 'John Doe'}</h2>
          <p className="text-sm text-muted-foreground">Premium Member</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full mt-4 sm:mt-0">
              <MoveHorizontalIcon className="w-5 h-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid gap-4 mt-4">
        <Link href="#" className="bg-background rounded-lg shadow-sm overflow-hidden block">
          <div className="flex items-center gap-4 p-4">
            <div className="bg-primary text-primary-foreground rounded-full p-2">
              <ShoppingBagIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Orders</h3>
              <p className="text-sm text-muted-foreground">View your past orders</p>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
          </div>
        </Link>
        <Link href="#" className="bg-background rounded-lg shadow-sm overflow-hidden block">
          <div className="flex items-center gap-4 p-4">
            <div className="bg-primary text-primary-foreground rounded-full p-2">
              <HeartIcon className="w-5 h-5 rounded-sm" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Wishlist</h3>
              <p className="text-sm text-muted-foreground">View your saved items</p>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
          </div>
        </Link>
        <Link href="#" className="bg-background rounded-lg shadow-sm overflow-hidden block">
          <div className="flex items-center gap-4 p-4">
            <div className="bg-primary text-primary-foreground rounded-full p-2">
              <MapPinIcon className="w-5 h-5 rounded-sm" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Addresses</h3>
              <p className="text-sm text-muted-foreground">Manage your delivery addresses</p>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
          </div>
        </Link>
        <Link href="#" className="bg-background rounded-lg shadow-sm overflow-hidden block">
          <div className="flex items-center gap-4 p-4">
            <div className="bg-primary text-primary-foreground rounded-full p-2">
              <SettingsIcon className="w-5 h-5 rounded-sm" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Settings</h3>
              <p className="text-sm text-muted-foreground">Customize your account settings</p>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
          </div>
        </Link>
        <Link href="#" className="bg-background rounded-lg shadow-sm overflow-hidden block">
          <div className="flex items-center gap-4 p-4">
            <div className="bg-primary text-primary-foreground rounded-full p-2">
              <CircleHelpIcon className="w-5 h-5 rounded-sm" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Help</h3>
              <p className="text-sm text-muted-foreground">Get assistance with your account</p>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
          </div>
        </Link>
      </div>
    </div>
  );
}

function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function CircleHelpIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function HeartIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 1 8.5c0 2.29 1.51 4.04 3 5.5l7 7 7-7z" />
    </svg>
  );
}

function MapPinIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M21 10c0 5-9 12-9 12S3 15 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ShoppingBagIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M6 2v1h12V2h-1M5 6h14v12H5V6zm0 2v10h14V8H5z" />
    </svg>
  );
}

function SettingsIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0-6v2m6.36 3.64 1.42-1.42M21 12h-2m-3.64 6.36 1.42 1.42M12 21v-2M4.64 16.36 3.22 14.94M3 12h2m1.64-6.36L4.22 3.22" />
    </svg>
  );
}
function MoveHorizontalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props
}
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
<path d="M5 15l7-7 7 7" />
</svg>
);
}
