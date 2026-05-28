// Workout Creator

const state = {
  workout: null,
  exercises: []
};

// DOM Elements
const form = document.getElementById('workout-form');
const formSection = document.querySelector('.form-section');
const workoutSection = document.getElementById('workout-section');
const exerciseModal = document.getElementById('exercise-modal');
const exerciseForm = document.getElementById('exercise-form');
const addExerciseBtn = document.getElementById('add-exercise-btn');
const editBtn = document.getElementById('edit-btn');
const saveBtn = document.getElementById('save-btn');
const resetBtn = document.getElementById('reset-btn');
const modalClose = document.getElementById('modal-close');
const modalCancel = document.getElementById('modal-cancel');

// Event Listeners
form.addEventListener('submit', handleCreateWorkout);
exerciseForm.addEventListener('submit', handleAddExercise);
addExerciseBtn.addEventListener('click', openExerciseModal);
editBtn.addEventListener('click', backToForm);
saveBtn.addEventListener('click', saveWorkout);
resetBtn.addEventListener('click', resetWorkout);
modalClose.addEventListener('click', closeExerciseModal);
modalCancel.addEventListener('click', closeExerciseModal);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
});

function handleCreateWorkout(e) {
  e.preventDefault();

  const name = document.getElementById('workout-name').value;
  const duration = document.getElementById('workout-duration').value;
  const difficulty = document.getElementById('workout-difficulty').value;

  const types = Array.from(document.querySelectorAll('input[name="type"]:checked'))
    .map(el => el.value);

  state.workout = { name, duration, difficulty, types };
  state.exercises = [];

  displayWorkout();
}

function displayWorkout() {
  formSection.hidden = true;
  workoutSection.hidden = false;

  document.getElementById('display-name').textContent = state.workout.name;
  document.getElementById('display-duration').textContent = `${state.workout.duration} min`;
  document.getElementById('display-difficulty').textContent = capitalize(state.workout.difficulty);
  document.getElementById('display-type').textContent = state.workout.types
    .map(t => capitalize(t))
    .join(', ') || 'Libre';

  renderExercisesList();
}

function renderExercisesList() {
  const list = document.getElementById('exercises-list');

  if (state.exercises.length === 0) {
    list.innerHTML = '<div class="empty-state">Aucun exercice — Clique ci-dessous pour en ajouter</div>';
    return;
  }

  list.innerHTML = state.exercises
    .map((ex, idx) => `
      <div class="exercise-item">
        <div class="exercise-details">
          <div class="exercise-name">${ex.name}</div>
          <div class="exercise-meta">${ex.sets} × ${ex.reps} reps | Repos: ${ex.rest}s</div>
        </div>
        <button type="button" class="exercise-remove" data-idx="${idx}" title="Supprimer">✕</button>
      </div>
    `)
    .join('');

  // Attach remove listeners
  list.querySelectorAll('.exercise-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.idx;
      state.exercises.splice(idx, 1);
      renderExercisesList();
    });
  });
}

function openExerciseModal() {
  exerciseForm.reset();
  exerciseModal.showModal();
}

function closeExerciseModal() {
  exerciseModal.close();
}

function handleAddExercise(e) {
  e.preventDefault();

  const exercise = {
    name: document.getElementById('exercise-name').value,
    sets: document.getElementById('exercise-sets').value,
    reps: document.getElementById('exercise-reps').value,
    rest: document.getElementById('exercise-rest').value
  };

  state.exercises.push(exercise);
  renderExercisesList();
  closeExerciseModal();
}

function backToForm() {
  workoutSection.hidden = true;
  formSection.hidden = false;
}

function saveWorkout() {
  if (state.exercises.length === 0) {
    alert('Ajoute au moins un exercice avant de sauvegarder');
    return;
  }

  // Save to localStorage
  const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
  const workout = {
    id: Date.now(),
    ...state.workout,
    exercises: [...state.exercises],
    createdAt: new Date().toISOString()
  };
  workouts.push(workout);
  localStorage.setItem('workouts', JSON.stringify(workouts));

  showToast('Séance sauvegardée !');
  resetWorkout();
}

function resetWorkout() {
  state.workout = null;
  state.exercises = [];
  form.reset();
  workoutSection.hidden = true;
  formSection.hidden = false;
}

function loadFromStorage() {
  const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
  console.log('Workouts loaded:', workouts);
}

function showToast(message) {
  // Simple implementation, can be enhanced
  alert(message);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
