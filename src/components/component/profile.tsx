import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SVGProps } from 'react';

export default function Profile() {
  return (
    <div className="w-full max-w-md mx-auto px-54">
      <div className="bg-primary text-primary-foreground py-6 px-4 flex flex-col sm:flex-row items-center ">
        <Avatar className="w-12 h-12 mb-4 sm:mb-0 sm:mr-4 rounded-sm">
          <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-lg font-semibold">John Doe</h2>
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
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid gap-4 mt-4">
        <Link href="#" className="bg-background rounded-lg shadow-sm overflow-hidden block">
          <div className="flex items-center gap-4 p-4">
            <div className="bg-primary text-primary-foreground rounded-full p-2">
              <ShoppingBagIcon className="w-5 h-5 rounded-sm" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Orders</h3>
              <p className="text-sm text-muted-foreground">View your past orders</p>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-muted-foreground rounded-sm" />
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
            <ChevronRightIcon className="w-5 h-5 text-muted-foreground rounded-sm" />
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
            <ChevronRightIcon className="w-5 h-5 text-muted-foreground rounded-sm" />
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
            <ChevronRightIcon className="w-5 h-5 text-muted-foreground rounded-sm" />
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
            <ChevronRightIcon className="w-5 h-5 text-muted-foreground rounded-sm " />
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
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
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
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
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
      <polyline points="18 8 22 12 18 16" />
      <polyline points="6 8 2 12 6 16" />
      <line x1="2" x2="22" y1="12" y2="12" />
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
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
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
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
