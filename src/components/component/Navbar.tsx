// src/components/component/Navbar.tsx

'use client';

import { FaHome as HomeIcon, FaList as ListIcon, FaShoppingCart as ShoppingCartIcon, FaUser as UserIcon } from 'react-icons/fa';

interface NavbarProps {
  onSectionChange: (section: string) => void;
}

const Navbar = ({ onSectionChange }: NavbarProps) => {
  const handleNavigation = (section: string) => {
    onSectionChange(section); // Notify parent component
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t flex justify-around py-2 z-50 shadow-lg">
      <button
        className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
        onClick={() => handleNavigation('home')}
      >
        <HomeIcon className="w-6 h-6 text-[#111827]" />
        <span className="text-xs">Home</span>
      </button>
      <button
        className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
        onClick={() => handleNavigation('categories')}
      >
        <ListIcon className="w-6 h-6 text-[#111827]" />
        <span className="text-xs">Categories</span>
      </button>
      <button
        className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
        onClick={() => handleNavigation('cart')}
      >
        <ShoppingCartIcon className="w-6 h-6 text-[#111827]" />
        <span className="text-xs">Cart</span>
      </button>
      <button
        className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
        onClick={() => handleNavigation('profile')}
      >
        <UserIcon className="w-6 h-6 text-[#111827]" />
        <span className="text-xs">Account</span>
      </button>
    </nav>
  );
};

export default Navbar;
