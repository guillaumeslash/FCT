export function PhaseInfo({ currentPhase, currentStep }) {
  return (
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
  );
}
