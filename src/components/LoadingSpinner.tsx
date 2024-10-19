import { Loader } from '@mantine/core';


interface Props {
  position: string;
}

const LoadingSpinner = ({ position }: Props) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: position, height: '100vh' }}>
      <Loader color="violet" size="lg" />
    </div>
  );
};

export default LoadingSpinner;