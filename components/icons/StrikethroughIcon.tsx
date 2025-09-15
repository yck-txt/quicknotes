import React from 'react';

export const StrikethroughIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 4H9a3 3 0 0 0-2.83 2H5v2h1.17A3 3 0 0 0 9 10h1v2H8a3 3 0 0 0-2.83 2H4v2h1.17A3 3 0 0 0 8 20h2v-2h-2a1 1 0 0 1-1-1v-2h4v2a1 1 0 0 1-1 1h-2v2h2a3 3 0 0 0 2.83-2H19v-2h-1.17A3 3 0 0 0 15 12h-1v-2h2a3 3 0 0 0 2.83-2H20V6h-1.17A3 3 0 0 0 16 4z"></path>
    <line x1="4" x2="20" y1="12" y2="12"></line>
  </svg>
);
