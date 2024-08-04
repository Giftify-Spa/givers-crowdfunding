// LoadingSpinner.tsx
import React from 'react';
import { Loader } from '@mantine/core';

const LoadingSpinner: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Loader color="violet" size="lg" />
    </div>
  );
};

export default LoadingSpinner;
