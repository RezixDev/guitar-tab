import React from 'react';

const SkipLink: React.FC = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-500 text-white p-2"
  >
    Skip to main content
  </a>
);

export default SkipLink;