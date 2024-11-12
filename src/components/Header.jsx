import { useState, useEffect } from 'react';

export function Header() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container-fluid">
      <div className="flex flex-row p-6 justify-center">
      <a className="text-2xl font-bold underline" href='https://github.com/guillaumeslash/FCT' target='_blank'>Timer Fresque du Climat</a>
      </div>
    </div>
  );
}
