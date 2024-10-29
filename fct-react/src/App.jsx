import { useState, useEffect, useRef } from 'react';
import stepsData from '/src/steps.json';

function App() {
  const [currentPhase, setCurrentPhase] = useState(stepsData[0]);
  const [currentStep, setCurrentStep] = useState(stepsData[0].steps[0]);
  const [phaseTimerSec, setPhaseTimerSec] = useState(stepsData[0].steps[0].duration * 60);
  const [currentTime, setCurrentTime] = useState('');
  const phaseTimerRef = useRef(null);
  const chimeSoundRef = useRef(null);

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

  useEffect(() => {
    startPhaseTimer();
    return () => clearInterval(phaseTimerRef.current);
  }, [currentStep]);

  const formatTimeMinSec = (seconds) => {
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startPhaseTimer = () => {
    if (phaseTimerRef.current) {
      clearInterval(phaseTimerRef.current);
    }

    phaseTimerRef.current = setInterval(() => {
      setPhaseTimerSec((prev) => {
        if (prev <= 1) {
          clearInterval(phaseTimerRef.current);
          playChimeSound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const playChimeSound = () => {
    if (chimeSoundRef.current) {
      chimeSoundRef.current.currentTime = 0;
      chimeSoundRef.current.play();
    }
  };

  const handlePrevStep = () => {
    const phaseIndex = stepsData.indexOf(currentPhase);
    const stepIndex = currentPhase.steps.indexOf(currentStep);

    if (stepIndex > 0) {
      setCurrentStep(currentPhase.steps[stepIndex - 1]);
      setPhaseTimerSec(currentPhase.steps[stepIndex - 1].duration * 60);
    } else if (phaseIndex > 0) {
      const prevPhase = stepsData[phaseIndex - 1];
      setCurrentPhase(prevPhase);
      setCurrentStep(prevPhase.steps[prevPhase.steps.length - 1]);
      setPhaseTimerSec(prevPhase.steps[prevPhase.steps.length - 1].duration * 60);
    }
  };

  const handleNextStep = () => {
    const phaseIndex = stepsData.indexOf(currentPhase);
    const stepIndex = currentPhase.steps.indexOf(currentStep);

    if (stepIndex < currentPhase.steps.length - 1) {
      setCurrentStep(currentPhase.steps[stepIndex + 1]);
      setPhaseTimerSec(currentPhase.steps[stepIndex + 1].duration * 60);
    } else if (phaseIndex < stepsData.length - 1) {
      const nextPhase = stepsData[phaseIndex + 1];
      setCurrentPhase(nextPhase);
      setCurrentStep(nextPhase.steps[0]);
      setPhaseTimerSec(nextPhase.steps[0].duration * 60);
    }
  };

  const adjustTime = (minutes) => {
    setPhaseTimerSec((prev) => {
      const newTime = prev + (minutes * 60);
      if (newTime > 0 && newTime < 3600) {
        return newTime;
      }
      return prev;
    });
  };

  return (
    <div className="bg-gray-100 mb-44">
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

      <div className="bg-white p-6 rounded-lg shadow-md mb-2">
        <h1 className="text-2xl font-bold mb-4">{currentPhase.name}</h1>
        <h2 className="text-xl font-bold mb-4">
          {currentStep.name} ({currentStep.duration} min.)
        </h2>
        <h3 className="text-lg font-semibold mb-4">A faire 👇</h3>
        <p className="text-gray-600 mb-4 whitespace-pre-line">{currentStep.todo}</p>
        <hr className="mb-4" />
        <h3 className="text-lg font-semibold mb-4">Aller plus loin 💡</h3>
        <p className="text-gray-600 whitespace-pre-line">{currentStep.focusOn}</p>
      </div>

      <div className="flex justify-center items-center border-t">
        <img
          className=""
          src="/imgs/memo.jpg"
          alt="lien entre les cartes"
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-2 border-t border-grey">
        <div className="flex flex-row justify-center items-center gap-4 h-10 mb-2">
          <div className="basis-1/4"></div>
          <button
            onClick={() => adjustTime(-1)}
            className="basis-1/4 text-sm bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-3 rounded-full w-full h-full"
          >
            -1 min
          </button>
          <button
            onClick={() => adjustTime(1)}
            className="basis-1/4 text-sm bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-3 rounded-full w-full h-full"
          >
            +1 min
          </button>
          <div className="basis-1/4"></div>
        </div>

        <div className="flex flex-row justify-center items-center gap-2 h-24">
          <button
            onClick={handlePrevStep}
            className="basis-1/4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full h-full"
          >
            Préc.
          </button>
          <div className="bg-gray-200 rounded-lg h-full w-full place-content-center text-center basis-2/4">
            <p className="font-bold text-xl">{currentStep.name}</p>
            <p className={`text-3xl font-bold ${phaseTimerSec === 0 ? 'text-red-500' : ''}`}>
              {formatTimeMinSec(phaseTimerSec)}
            </p>
          </div>
          <button
            onClick={handleNextStep}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded h-full w-full basis-1/4"
          >
            Suiv.
          </button>
        </div>
      </div>

      <audio ref={chimeSoundRef} src="/chime.mp3" preload="auto" />
    </div>
  );
}

export default App;
