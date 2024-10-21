const currentPhaseInfoContainer = document.getElementById("current-phase-info");
const phaseTitle = document.getElementById("phase-title");
const stepTitle = document.getElementById("step-title");
const stepTitleTimer = document.getElementById("step-title-timer");
const stepTodo = document.getElementById("step-todo");
const stepFocusOn = document.getElementById("step-focus-on");
const phaseTimeDisplay = document.getElementById("phase-time");
const currentTimeDisplay = document.getElementById("current-time");
const resetBtn = document.getElementById("reset-btn");
const prevPhaseBtn = document.getElementById("prev-phase-btn");
const nextPhaseBtn = document.getElementById("next-phase-btn");
const chimeSound = document.getElementById("chime-sound");

const remove1MinBtn = document.getElementById("remove-1-min");
const add1MinBtn = document.getElementById("add-1-min");

let phaseTimer;
let phaseTimerSec = null;
let currentPhase = null;
let currentStep = null;
let data = [];

fetch("steps.json")
  .then((response) => response.json())
  .then((fetchedData) => {
    data = fetchedData;
    initializeApp();
  })
  .catch((error) =>
    console.error("Erreur lors du chargement des données :", error)
  );

function initializeApp() {
  // Démarrer avec la première phase et la première étape
  currentPhase = data[0];
  currentStep = currentPhase.steps ? currentPhase.steps[0] : null;
  phaseTimerSec = currentStep.duration * 60;
  startPhaseTimer(currentStep);
  startCurrentTime();

  // Gérer les boutons "Phase précédente" et "Phase suivante"
  prevPhaseBtn.addEventListener("click", handlePrevStep);
  nextPhaseBtn.addEventListener("click", handleNextStep);

  // Gérer les boutons "Retirer 1 minute" et "Ajouter 1 minute"
  remove1MinBtn.addEventListener("click", removeOneMinute);
  add1MinBtn.addEventListener("click", addOneMinute);

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
  return value.toString().padStart(2, "0");
}

function startCurrentTime() {
  updateCurrentTime(); // Afficher l'heure actuelle immédiatement
  setInterval(updateCurrentTime, 1000); // Mettre à jour l'heure toutes les secondes
}

function startPhaseTimer(step) {
  phaseTimeDisplay.classList.remove("text-red-500");
  if (phaseTimerSec - 1 > 0) {
    // Mandatory to immediately show the timing change
    phaseTimeDisplay.textContent = formatTimeMinSec(phaseTimerSec);
  }
  phaseTimer = setInterval(() => {
    phaseTimerSec--;
    if (phaseTimerSec > 0) {
      phaseTimeDisplay.textContent = formatTimeMinSec(phaseTimerSec);
    }
    if (phaseTimerSec === 0) {
      clearInterval(phaseTimer);
      phaseTimeDisplay.textContent = "00:00";
      phaseTimeDisplay.classList.add("text-red-500");
      playChimeSound(); // Jouer le son à la fin du timer
    }
  }, 1000);
}

function handlePrevStep() {
  const phaseIndex = data.indexOf(currentPhase);
  const stepIndex = currentPhase.steps
    ? currentPhase.steps.indexOf(currentStep)
    : -1;

  if (stepIndex > 0) {
    clearInterval(phaseTimer);
    currentStep = currentPhase.steps[stepIndex - 1];
    phaseTimerSec = currentStep.duration * 60;
    startPhaseTimer(currentStep);
  } else if (phaseIndex > 0) {
    clearInterval(phaseTimer);
    currentPhase = data[phaseIndex - 1];
    currentStep = currentPhase.steps
      ? currentPhase.steps[currentPhase.steps.length - 1]
      : null;
    phaseTimerSec = currentStep.duration * 60;
    startPhaseTimer(currentStep);
  }

  // Mettre à jour les informations de la phase et de l'étape en cours
  updateCurrentPhaseInfo();
}

function handleNextStep() {
  const phaseIndex = data.indexOf(currentPhase);
  const stepIndex = currentPhase.steps
    ? currentPhase.steps.indexOf(currentStep)
    : -1;

  if (stepIndex < currentPhase.steps.length - 1) {
    clearInterval(phaseTimer);
    currentStep = currentPhase.steps[stepIndex + 1];
    phaseTimerSec = currentStep.duration * 60;
    startPhaseTimer(currentStep);
  } else if (phaseIndex < data.length - 1) {
    clearInterval(phaseTimer);
    currentPhase = data[phaseIndex + 1];
    currentStep = currentPhase.steps ? currentPhase.steps[0] : null;
    phaseTimerSec = currentStep.duration * 60;
    startPhaseTimer(currentStep);
  }

  // Mettre à jour les informations de la phase et de l'étape en cours
  updateCurrentPhaseInfo();
}

function updateCurrentPhaseInfo() {
  if (currentPhase) {
    phaseTitle.textContent = currentPhase.name;

    if (currentStep) {
      const nicetime = ` (${currentStep.duration} min.)`;

      stepTitle.textContent = currentStep.name + nicetime;
      stepTitleTimer.textContent = currentStep.name;
      stepTodo.textContent = currentStep.todo || "";
      stepFocusOn.textContent = currentStep.focusOn || "";
    } else {
      stepTitle.textContent = "";
      stepTodo.textContent = "";
    }
  } else {
    phaseTitle.textContent = "";
    stepTitle.textContent = "";
    stepTodo.textContent = "";
  }
}

function playChimeSound() {
  chimeSound.currentTime = 0; // Réinitialiser la position de lecture
  chimeSound.play();
}

function updateCurrentTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  currentTimeDisplay.textContent = `${padZero(hours)}:${padZero(
    minutes
  )}:${padZero(seconds)}`;
}

function removeOneMinute() {
  if (phaseTimer && phaseTimerSec - 60 > 0) {
    phaseTimerSec = phaseTimerSec - 60;
    clearInterval(phaseTimer);
    startPhaseTimer(currentStep, phaseTimerSec);
  }
}

function addOneMinute() {
  if (phaseTimer && phaseTimerSec + 60 < 3599) {
    phaseTimerSec = phaseTimerSec + 60;
    clearInterval(phaseTimer);
    startPhaseTimer(currentStep, phaseTimerSec);
  }
}
