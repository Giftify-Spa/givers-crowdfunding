import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RedirectTimerProps {
  redirectTo: string;
  delayInSeconds: number;
}

const RedirectTimer: React.FC<RedirectTimerProps> = ({ redirectTo, delayInSeconds }) => {
  const [secondsLeft, setSecondsLeft] = useState(delayInSeconds);
  const navigate = useNavigate();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    if (secondsLeft === 0) {
      navigate(redirectTo); // Redirection outside the render cycle
    }

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [secondsLeft, navigate, redirectTo]);

  return (
    <div>
      <p>Redireccíon en {secondsLeft} segundos...</p>
    </div>
  );
};

export default RedirectTimer;
