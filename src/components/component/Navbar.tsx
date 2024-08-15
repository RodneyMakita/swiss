import { useState, useEffect } from 'react';
import { FaHome as HomeIcon, FaList as ListIcon, FaShoppingCart as ShoppingCartIcon, FaUser as UserIcon } from 'react-icons/fa';
import { useCart } from '@/app/backend/CartContext';

interface NavbarProps {
  onSectionChange: (section: string) => void;
}

const Navbar = ({ onSectionChange }: NavbarProps) => {
  const [scrollY, setScrollY] = useState(0);
  const [hidden, setHidden] = useState(false);
  const { cart } = useCart(); // Access cart from the context

  // Calculate total quantity of items in the cart
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > scrollY) {
        setHidden(true);  // Hide navbar on scroll down
      } else {
        setHidden(false); // Show navbar on scroll up
      }
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollY]);

  const handleNavigation = (section: string) => {
    onSectionChange(section); // Notify parent component
  };

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 bg-background border-t flex justify-around py-2 z-50 shadow-lg transition-transform duration-300 ${
        hidden ? 'transform translate-y-full' : 'transform translate-y-0'
      }`}
    >
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
        className="relative flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
        onClick={() => handleNavigation('cart')}
      >
        <ShoppingCartIcon className="w-6 h-6 text-[#111827]" />
        {totalItems > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {totalItems}
          </span>
        )}
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
