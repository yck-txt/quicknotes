
import React from 'react';

export const ExpandIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M7 14H4v6h6v-3" />
    <path d="M10 4H4v6h3" />
    <path d="M17 10h3V4h-6v3" />
    <path d="M14 17h6v-6h-3" />
  </svg>
);