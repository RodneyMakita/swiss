import React, { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SVGProps } from 'react';
import { useAuth } from '@/app/auth/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { db } from '@/app/firebase';
import { User } from 'firebase/auth';
import { updateProfile } from 'firebase/auth';
import { EditProfile } from './edit-profile';

export default function Profile() {
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);
    
          if (docSnap.exists()) {
            setAvatarUrl(docSnap.data().avatarUrl || null);
          } else {
            console.error('No such document!');
          }
        } catch (error) {
          console.error('Error fetching avatar URL:', error);
        }
      } else {
        console.error('User is not authenticated');
      }
    };
    fetchAvatar();
  }, [user]);

  const updateUserProfile = async (user: User, displayName: string) => {
    try {
      if (user) {
        await updateProfile(user, { displayName });
        await setDoc(doc(db, 'users', user.uid), {
          displayName: displayName,
          email: user.email,
        });
        console.log('User profile updated');
      } else {
        console.error('User is not authenticated');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('Successfully signed out');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleEditProfileClick = () => {
    setIsEditing(true);
  };

  if (isEditing) {
    return <EditProfile setIsEditing={setIsEditing} displayName={user?.displayName || ''} email={user?.email || ''} avatarUrl={avatarUrl} />;
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:px-54 overflow-y-auto">
      <div className="bg-primary text-primary-foreground py-6 px-4 flex flex-col sm:flex-row items-center rounded-lg">
        <Avatar className="w-12 h-12 mb-4 sm:mb-0 sm:mr-4 rounded-sm">
          <AvatarImage src={avatarUrl || "/placeholder-user.jpg"} alt="User Avatar" />
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
            <DropdownMenuItem onClick={handleEditProfileClick}>Edit Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Links in the Profile page */}
      <div className="grid gap-4 mt-4">
        <Link href="/orders" className="bg-background rounded-lg shadow-sm overflow-hidden block">
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
        <Link href="/wishlist" className="bg-background rounded-lg shadow-sm overflow-hidden block">
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
        <Link href="/settings" className="bg-background rounded-lg shadow-sm overflow-hidden block">
          <div className="flex items-center gap-4 p-4">
            <div className="bg-primary text-primary-foreground rounded-full p-2">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Settings</h3>
              <p className="text-sm text-muted-foreground">Manage your account settings</p>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
          </div>
        </Link>
        <Link href="/payment-methods" className="bg-background rounded-lg shadow-sm overflow-hidden block">
          <div className="flex items-center gap-4 p-4">
            <div className="bg-primary text-primary-foreground rounded-full p-2">
              <CreditCardIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Payment Methods</h3>
              <p className="text-sm text-muted-foreground">Manage your payment methods</p>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
          </div>
        </Link>
        
       
        <Link href="/address" className="bg-background rounded-lg shadow-sm overflow-hidden block">
          <div className="flex items-center gap-4 p-4">
            <div className="bg-primary text-primary-foreground rounded-full p-2">
              <HomeIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Address</h3>
              <p className="text-sm text-muted-foreground">Manage your shipping addresses</p>
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

function HomeIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M20 20V10.57a1 1 0 0 0-.39-.78l-7-5.57a1 1 0 0 0-1.22 0l-7 5.57a1 1 0 0 0-.39.78V20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2z"></path>
      <polyline points="7 20 7 12 17 12 17 20"></polyline>
    </svg>
  );
}
function MoveHorizontalIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M18 8l-6 6-6-6" />
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
      <path d="M6 2l1 7h10l1-7" />
      <path d="M5 7h14l-1.5 13.3A2 2 0 0 1 15.52 22H8.48a2 2 0 0 1-1.98-1.7L5 7z" />
      <path d="M16 11v5a4 4 0 0 1-8 0v-5" />
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
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
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
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-.99 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-.99-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-.99H3a2 2 0 1 1 0-4h.09c.7 0 1.32-.39 1.51-.99a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.16A1.65 1.65 0 0 0 9 5.09V5a2 2 0 1 1 4 0v.09c0 .7.39 1.32.99 1.51.61.25 1.3.14 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.16c0 .7.39 1.32.99 1.51h.09a2 2 0 1 1 0 4h-.09c-.7 0-1.32.39-1.51.99z" />
    </svg>
  );
}

function CreditCardIcon(props: SVGProps<SVGSVGElement>) {
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
      <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
      <path d="M2 10h20" />
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
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 1.5-1 2-1.75 2.4-.55.29-.75.6-.75 1.6M12 17h.01" />
    </svg>
  );
}