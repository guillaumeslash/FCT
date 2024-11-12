export function PhaseInfo({ currentPhase, currentStep }) {
  const processText = (text) => {
    if (!text) return '';
    
    // Split by newlines to process each line
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // Check if line starts with number followed by dot
      if (/^\d+\./.test(line)) {
        // Find where the line ends (next newline or end of text)
        const lineEnd = line.indexOf('\n') === -1 ? line.length : line.indexOf('\n');
        return (
          <span key={index}>
            <strong>{line.substring(0, lineEnd)}</strong>
            {'\n'}
          </span>
        );
      }
      return <span key={index}>{line}{'\n'}</span>;
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-2">
      <h1 className="text-2xl font-bold mb-4">{currentPhase.name}</h1>
      <h2 className="text-xl font-bold mb-4">
        {currentStep.name} ({currentStep.duration} min.)
      </h2>
      <h3 className="text-lg font-semibold mb-4">Début de l'étape 👇</h3>
      <p className="text-gray-600 mb-4 whitespace-pre-line">
        {processText(currentStep.todo)}
      </p>
      <hr className="mb-4" />
      <h3 className="text-lg font-semibold mb-4">Fin de l'étape 👇</h3>
      <p className="text-gray-600 whitespace-pre-line">
        {processText(currentStep.focusOn)}
      </p>
    </div>
  );
}
