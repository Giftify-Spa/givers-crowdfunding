// LoadingSpinner.tsx
import React from 'react';
import { Loader } from '@mantine/core';

const LoadingSpinnerTable: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh' }}>
      <Loader color="violet" size="md" />
    </div>
  );
};

export default LoadingSpinnerTable;
