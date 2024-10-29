export function Timer({ currentStep, phaseTimerSec, formatTimeMinSec, onPrevStep, onNextStep }) {
  return (
    <div className="flex flex-row justify-center items-center gap-2 h-24">
      <button
        onClick={onPrevStep}
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
        onClick={onNextStep}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded h-full w-full basis-1/4"
      >
        Suiv.
      </button>
    </div>
  );
}
