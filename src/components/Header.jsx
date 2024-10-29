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
      <div className="flex flex-row p-6">
        <div className="basis-3/4">
          <h1 className="text-2xl font-bold">Fresque du Climat</h1>
        </div>
        <div className="basis-1/4 text-right">
          <p className="text-xs text-center font-bold text-right">Heure</p>
          <p className="text-sm font-bold">{currentTime}</p>
        </div>
      </div>
    </div>
  );
}
