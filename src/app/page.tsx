'use client';

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/app/auth/AuthContext';
import Navbar from '@/components/component/Navbar';
import Home from '@/components/component/home'; 
import Categories from '@/components/component/categories'; 
import Cart from '@/components/component/cart';
import Profile from '@/components/component/profile';  
import { CartProvider } from '@/app/backend/CartContext';
import SlideToRefreshProvider from '@/components/component/SlideToRefreshProvider';
import { SignInLoginIn } from './auth/signIn';
import '@/app/globals.css';

const AppContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('home');
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      setActiveSection('home');
    } else {
      setActiveSection('signin');
    }
  }, [isAuthenticated]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleContinueShopping = () => {
    setActiveSection('home');
  };

  return (
    <div className="">
      {isAuthenticated ? (
        <>
          <Navbar onSectionChange={handleSectionChange} />
          <div className="">
            {activeSection === 'home' && <Home />}
            {activeSection === 'categories' && <Categories />}
            {activeSection === 'cart' && (
              <Cart 
                onContinueShopping={handleContinueShopping} 
                user={user} // Ensure user is passed here
              />
            )}
            {activeSection === 'profile' && <Profile />}
          </div>
        </>
      ) : (
        <SignInLoginIn />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <SlideToRefreshProvider>
          <AppContent />
        </SlideToRefreshProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
