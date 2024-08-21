import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  const variantClass = variant === 'secondary' ? 'bg-gray-200 text-gray-800' : 'bg-blue-500 text-white';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-sm font-medium ${variantClass} ${className}`}>
      {children}
    </span>
  );
};

