const currentPhaseInfoContainer = document.getElementById('current-phase-info');
const phaseTitle = document.getElementById('phase-title');
const stepTitle = document.getElementById('step-title');
const stepTodo = document.getElementById('step-todo');
const stepFocusOn = document.getElementById('step-focus-on');
const phaseTimeDisplay = document.getElementById('phase-time');
const globalTimeDisplay = document.getElementById('global-time');
const resetBtn = document.getElementById('reset-btn');
const prevPhaseBtn = document.getElementById('prev-phase-btn');
const nextPhaseBtn = document.getElementById('next-phase-btn');
const chimeSound = document.getElementById('chime-sound');

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
      //alert('Le timer global est terminé !');
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
        playChimeSound(); // Jouer le son à la fin du timer
        handleNextStep();
      }
    }, 1000);
  } else {
    //alert('Cette phase ne contient aucune étape.');
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
  
      if (currentStep) {
        stepTitle.textContent = currentStep.name;
        stepTodo.textContent = currentStep.todo || '';
        stepFocusOn.textContent = currentStep.focusOn || '';
      } else {
        stepTitle.textContent = '';
        stepTodo.textContent = '';
      }
    } else {
      phaseTitle.textContent = '';
      stepTitle.textContent = '';
      stepTodo.textContent = '';
    }
  }

  function playChimeSound() {
    chimeSound.currentTime = 0; // Réinitialiser la position de lecture
    chimeSound.play();
  }

  document.ondblclick = function(e) {
    e.preventDefault();
}