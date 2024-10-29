import { useState, useEffect, useRef } from 'react';
import { stepsData } from './steps';
import { Header } from './components/Header';
import { PhaseInfo } from './components/PhaseInfo';
import { ImageSection } from './components/ImageSection';
import { TimeAdjustButtons } from './components/TimeAdjustButtons';
import { Timer } from './components/Timer';

function App() {
  const [currentPhase, setCurrentPhase] = useState(stepsData[0]);
  const [currentStep, setCurrentStep] = useState(stepsData[0].steps[0]);
  const [phaseTimerSec, setPhaseTimerSec] = useState(stepsData[0].steps[0].duration * 60);
  const phaseTimerRef = useRef(null);
  const chimeSoundRef = useRef(null);

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
      <Header />
      <PhaseInfo currentPhase={currentPhase} currentStep={currentStep} />
      <ImageSection />

      <div className="fixed bottom-0 left-0 right-0 bg-white p-2 border-t border-grey">
        <TimeAdjustButtons onAdjustTime={adjustTime} />
        <Timer
          currentStep={currentStep}
          phaseTimerSec={phaseTimerSec}
          formatTimeMinSec={formatTimeMinSec}
          onPrevStep={handlePrevStep}
          onNextStep={handleNextStep}
        />
      </div>

      <audio ref={chimeSoundRef} src="./chime.mp3" preload="auto" />
    </div>
  );
}

export default App;
