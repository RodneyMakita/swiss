import React from 'react';

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M12 7a5 5 0 0 0-5 5v1" />
    <path d="M12 12a5 5 0 0 1 5 5v1" />
    <circle cx="12" cy="7" r="5" />
    <path d="M19 21H5a2 2 0 0 1-2-2v-2a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2a2 2 0 0 1-2 2z" />
  </svg>
);

export default UserIcon;
