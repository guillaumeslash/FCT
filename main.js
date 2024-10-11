const currentPhaseInfoContainer = document.getElementById('current-phase-info');
const phaseTitle = currentPhaseInfoContainer.querySelector('h2');
const phaseDescription = currentPhaseInfoContainer.querySelector('p:first-of-type');
const stepTitle = currentPhaseInfoContainer.querySelector('h3');
const stepDescription = currentPhaseInfoContainer.querySelector('p:last-of-type');
const phaseTimeDisplay = document.getElementById('phase-time');
const globalTimeDisplay = document.getElementById('global-time');
const resetBtn = document.getElementById('reset-btn');
const prevPhaseBtn = document.getElementById('prev-phase-btn');
const nextPhaseBtn = document.getElementById('next-phase-btn');

let globalTimer;
let phaseTimer;
let currentPhase = null;
let currentStep = null;
let data = [];

fetch('steps.json')
  .then(response => response.json())
  .then(fetchedData => {
    data = fetchedData;
    initializeApp();
  })
  .catch(error => console.error('Erreur lors du chargement des données :', error));

  function initializeApp() {
    data.forEach(phase => {
        const phaseElement = document.createElement('div');
        phaseElement.classList.add('phase');
  
        const phaseTitle = document.createElement('h2');
        phaseTitle.textContent = phase.name;
        phaseElement.appendChild(phaseTitle);
  
        if (phase.todo) {
          const phaseTodo = document.createElement('p');
          phaseTodo.textContent = phase.todo;
          phaseElement.appendChild(phaseTodo);
        }
  
        if (phase.steps) {
          const stepsContainer = document.createElement('div');
          stepsContainer.classList.add('steps-container');
  
          phase.steps.forEach(step => {
            const stepElement = document.createElement('div');
            stepElement.classList.add('etape');
  
            const stepName = document.createElement('h3'); // il faut changer ici 
            stepName.textContent = step.name;
            stepElement.appendChild(stepName);
  
            const stepTimer = document.createElement('div');
            stepTimer.textContent = formatTime(step.duration * 60);
            stepElement.appendChild(stepTimer);
  
            if (step.todo) {
              console.log(step.todo);
              const stepTodo = document.createElement('p');
              stepTodo.textContent = step.todo;
              stepElement.appendChild(stepTodo);
            }
  
            stepsContainer.appendChild(stepElement);
          });
  
          phaseElement.appendChild(stepsContainer);
        }
  
        //phasesContainer.appendChild(phaseElement);
      });
  
    // Démarrer avec la première phase et la première étape
    currentPhase = data[0];
    currentStep = currentPhase.steps ? currentPhase.steps[0] : null;
    startPhaseTimer(currentPhase, currentStep);
    startGlobalTimer(10800); // 3 heures
  
    // Gérer les boutons "Phase précédente" et "Phase suivante"
    prevPhaseBtn.addEventListener('click', handlePrevStep);
    nextPhaseBtn.addEventListener('click', handleNextStep);

    // Afficher les informations de la phase et de l'étape en cours
    updateCurrentPhaseInfo();
  }

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${padZero(hours)}:${padZero(minutes)}:${padZero(remainingSeconds)}`;
}

function formatTimeMinSec(seconds) {
  //const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${padZero(minutes)}:${padZero(remainingSeconds)}`;
}

function padZero(value) {
  return value.toString().padStart(2, '0');
}

function startGlobalTimer(duration) {
  let remainingTime = duration;

  globalTimer = setInterval(() => {
    remainingTime--;
    globalTimeDisplay.textContent = formatTime(remainingTime);
    localStorage.setItem('globalTimer', remainingTime.toString());

    if (remainingTime === 0) {
      clearInterval(globalTimer);
      alert('Le timer global est terminé !');
    }
  }, 1000);
}

function startPhaseTimer(phase, step) {
    if (step) {
      let remainingTime = step.duration * 60;
  
      phaseTimer = setInterval(() => {
        remainingTime--;
        phaseTimeDisplay.textContent = formatTimeMinSec(remainingTime);
  
        if (remainingTime === 0) {
          clearInterval(phaseTimer);
          handleNextStep();
        }
      }, 1000);
    } else {
      alert('Cette phase ne contient aucune étape.');
    }
  }

  function handlePrevStep() {
    const phaseIndex = data.indexOf(currentPhase);
    const stepIndex = currentPhase.steps ? currentPhase.steps.indexOf(currentStep) : -1;
  
    if (stepIndex > 0) {
      clearInterval(phaseTimer);
      currentStep = currentPhase.steps[stepIndex - 1];
      startPhaseTimer(currentPhase, currentStep);
    } else if (phaseIndex > 0) {
      clearInterval(phaseTimer);
      currentPhase = data[phaseIndex - 1];
      currentStep = currentPhase.steps ? currentPhase.steps[currentPhase.steps.length - 1] : null;
      startPhaseTimer(currentPhase, currentStep);
    }

    // Mettre à jour les informations de la phase et de l'étape en cours
    updateCurrentPhaseInfo();
  }
  
  function handleNextStep() {
    const phaseIndex = data.indexOf(currentPhase);
    const stepIndex = currentPhase.steps ? currentPhase.steps.indexOf(currentStep) : -1;
  
    if (stepIndex < currentPhase.steps.length - 1) {
      clearInterval(phaseTimer);
      currentStep = currentPhase.steps[stepIndex + 1];
      startPhaseTimer(currentPhase, currentStep);
    } else if (phaseIndex < data.length - 1) {
      clearInterval(phaseTimer);
      currentPhase = data[phaseIndex + 1];
      currentStep = currentPhase.steps ? currentPhase.steps[0] : null;
      startPhaseTimer(currentPhase, currentStep);
    }

    // Mettre à jour les informations de la phase et de l'étape en cours
    updateCurrentPhaseInfo();
  }

  function updateCurrentPhaseInfo() {
    if (currentPhase) {
      phaseTitle.textContent = currentPhase.name;
      phaseDescription.textContent = currentPhase.todo || '';
  
      if (currentStep) {
        stepTitle.textContent = currentStep.name;
        stepDescription.textContent = currentStep.todo || '';
      } else {
        stepTitle.textContent = '';
        stepDescription.textContent = '';
      }
    } else {
      phaseTitle.textContent = '';
      phaseDescription.textContent = '';
      stepTitle.textContent = '';
      stepDescription.textContent = '';
    }
  }