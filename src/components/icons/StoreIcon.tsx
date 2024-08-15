import React from 'react';
import Image from 'next/image';
import Logo from '@/assets/logo.png'

const StoreIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Image
      src={Logo}
      alt="Store Logo"
      className={className}
      width={32} // Adjust the width as needed
      height={32} // Adjust the height as needed
    />
  );
};

export default StoreIcon;
