const quizQuestions = [
  {
    question: 'What is the capital of France?',
    answers: [
      { text: 'London', correct: false },
      { text: 'Berlin', correct: false },
      { text: 'Paris', correct: true },
      { text: 'Madrid', correct: false },
    ],
  },
  {
    question: 'Which planet is known as the Red Planet?',
    answers: [
      { text: 'Venus', correct: false },
      { text: 'Mars', correct: true },
      { text: 'Jupiter', correct: false },
      { text: 'Saturn', correct: false },
    ],
  },
  {
    question: 'What is the largest ocean on Earth?',
    answers: [
      { text: 'Atlantic Ocean', correct: false },
      { text: 'Indian Ocean', correct: false },
      { text: 'Arctic Ocean', correct: false },
      { text: 'Pacific Ocean', correct: true },
    ],
  },
  {
    question: 'Which of these is NOT a programming language?',
    answers: [
      { text: 'Java', correct: false },
      { text: 'Python', correct: false },
      { text: 'Banana', correct: true },
      { text: 'JavaScript', correct: false },
    ],
  },
  {
    question: 'What is the chemical symbol for gold?',
    answers: [
      { text: 'Go', correct: false },
      { text: 'Gd', correct: false },
      { text: 'Au', correct: true },
      { text: 'Ag', correct: false },
    ],
  },
];

let state = {
  currentIndex: 0,
  userAnswers: new Array(quizQuestions.length).fill(null),
  flaggedIndices: [],
};

const STORAGE_KEY = 'quiz_session_data';

let currentQuestionIndex = 0;
let score = 0;
let flaggedQuestions = new Set();

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  const page = path.split('/').pop();

  if (page === 'index.html' || page === '') {
    setupStartPage();
  } else if (page === 'quizscreen.html') {
    loadSession();
    initQuizUI();
    showQuestion();
    updateFlaggedList();
  } else if (page === 'resultscreen.html') {
    showResults();
  }
  const flagBtn = document.getElementById('flag-btn');
  if (flagBtn) {
    flagBtn.addEventListener('click', toggleFlag);
  }
});

function saveSession() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadSession() {
  const savedState = localStorage.getItem(STORAGE_KEY);
  if (savedState) {
    state = JSON.parse(savedState);
  }
}

function initQuizUI() {
  document.getElementById('total-questions').textContent = quizQuestions.length;

  document.getElementById('flag-btn').addEventListener('click', toggleFlag);
  document
    .getElementById('prev-btn')
    .addEventListener('click', () => navigate(-1));
  document
    .getElementById('next-btn')
    .addEventListener('click', () => navigate(1));
  document.getElementById('submit-btn').addEventListener('click', finishExam);
}

function setupStartPage() {
  const startButton = document.getElementById('start-btn');
  if (startButton) {
    startButton.addEventListener('click', () => {
      window.location.href = 'pages/quizscreen.html';
    });
  }
}

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  const totalQuestionsSpan = document.getElementById('total-questions');
  if (totalQuestionsSpan) totalQuestionsSpan.textContent = quizQuestions.length;

  showQuestion();
}

function showQuestion() {
  const questionText = document.getElementById('question-text');
  const answersContainer = document.getElementById('answers-container');
  const currentQuestionSpan = document.getElementById('current-question');
  const progressBar = document.getElementById('progress');
  const flagBtn = document.getElementById('flag-btn');
  const submitBtn = document.getElementById('submit-btn');

  if (!questionText || !answersContainer) return;

  const currentQuestion = quizQuestions[state.currentIndex];
  const progressPercent = (state.currentIndex / quizQuestions.length) * 100;

  currentQuestionSpan.textContent = state.currentIndex + 1;
  progressBar.style.width = progressPercent + '%';
  questionText.textContent = currentQuestion.question;

  if (flaggedQuestions.has(state.currentIndex)) {
    flagBtn.classList.add('active-flag');
    flagBtn.textContent = 'Unflag';
  } else {
    flagBtn.classList.remove('active-flag');
    flagBtn.textContent = 'Flag';
  }

  answersContainer.innerHTML = '';
  currentQuestion.answers.forEach((answer, index) => {
    const button = document.createElement('button');
    button.textContent = answer.text;
    button.classList.add('answer-btn');

    if (state.userAnswers[state.currentIndex] === index) {
      button.classList.add('selected');
    }

    button.addEventListener('click', () => selectAnswer(index));
    answersContainer.appendChild(button);
  });

  document.getElementById('prev-btn').style.visibility =
    state.currentIndex === 0 ? 'hidden' : 'visible';

  if (state.currentIndex === quizQuestions.length - 1) {
    document.getElementById('next-btn').style.display = 'none';
    submitBtn.style.display = 'block';

    const allAnswered = state.userAnswers.every((answer) => answer !== null);
    submitBtn.disabled = !allAnswered;
  } else {
    document.getElementById('next-btn').style.display = 'block';
    submitBtn.style.display = 'none';
  }
}

function toggleFlag() {
  const idx = state.currentIndex;
  if (state.flaggedIndices.includes(idx)) {
    state.flaggedIndices = state.flaggedIndices.filter((i) => i !== idx);
  } else {
    state.flaggedIndices.push(idx);
  }
  saveSession();
  updateFlaggedList();
  showQuestion();
}

function updateFlaggedList() {
  const listContainer = document.getElementById('flagged-list');
  if (!listContainer) return;

  listContainer.innerHTML = '';

  if (state.flaggedIndices.length === 0) {
    listContainer.innerHTML =
      '<p id="empty-flag-msg">No questions flagged.</p>';
    return;
  }

  state.flaggedIndices
    .sort((a, b) => a - b)
    .forEach((index) => {
      const item = document.createElement('div');
      item.classList.add('flagged-item');
      item.textContent = `Q${index + 1}: ${quizQuestions[
        index
      ].question.substring(0, 20)}...`;
      item.onclick = () => {
        state.currentIndex = index;
        showQuestion();
      };
      listContainer.appendChild(item);
    });
}

function selectAnswer(answerIndex) {
  state.userAnswers[state.currentIndex] = answerIndex;
  saveSession();
  showQuestion();
}

function navigate(direction) {
  state.currentIndex += direction;
  saveSession();
  showQuestion();
}

function showResults() {
  const finalScoreSpan = document.getElementById('final-score');
  const maxScoreSpan = document.getElementById('max-score');
  const resultMessage = document.getElementById('result-message');
  const restartButton = document.getElementById('restart-btn');
  const savedScore = localStorage.getItem('mostRecentScore') || 0;
  const total = quizQuestions.length;

  if (finalScoreSpan) finalScoreSpan.textContent = savedScore;
  if (maxScoreSpan) maxScoreSpan.textContent = total;

  const percentage = (savedScore / total) * 100;

  if (resultMessage) {
    if (percentage === 100)
      resultMessage.textContent = "Perfect Score! You're a genius!";
    else if (percentage > 80)
      resultMessage.textContent = 'Great job! You know your stuff';
    else if (percentage > 40)
      resultMessage.textContent = 'Not bad! Try again to improve!';
    else resultMessage.textContent = 'Better luck next time!';
  }

  if (restartButton) {
    restartButton.addEventListener('click', () => {
      restartQuiz();
      localStorage.removeItem('mostRecentScore');
    });
  }
}

function restartQuiz() {
  window.location.href = '../index.html';
}

function finishExam() {
  let finalScore = 0;
  state.userAnswers.forEach((selectedIdx, qIdx) => {
    if (
      selectedIdx !== null &&
      quizQuestions[qIdx].answers[selectedIdx].correct
    ) {
      finalScore++;
    }
  });

  localStorage.setItem('mostRecentScore', finalScore);
  localStorage.removeItem(STORAGE_KEY);
  window.location.href = 'resultscreen.html';
}
