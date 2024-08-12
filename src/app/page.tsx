// src/app/page.tsx

'use client';

import { useState } from 'react';
import Navbar from '@/components/component/Navbar';
import Home from '@/components/component/home'; 
import Categories from '@/components/component/categories'; 
import Cart from '@/components/component/cart';
import Profile from '@/components/component/profile';  

const App = () => {
  const [activeSection, setActiveSection] = useState<string>('home');

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  return (
    <div className=""> {/* Add padding to ensure content is not hidden behind the navbar */}
      <Navbar onSectionChange={handleSectionChange} />
      <div className="">
        {activeSection === 'home' && <Home />}
        {activeSection === 'categories' && <Categories />}
        {activeSection === 'cart' && <Cart />}
        {activeSection === 'profile' && <Profile />}
      </div>
    </div>
  );
};

export default App;
