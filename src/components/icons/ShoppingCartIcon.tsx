import React from 'react';

const ShoppingCartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.92-1.53l1.07-5.08H6.43" />
    <path d="M16 8h5a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-8" />
  </svg>
);

export default ShoppingCartIcon;
