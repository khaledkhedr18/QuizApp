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

let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  const page = path.split('/').pop();

  if (page === 'index.html' || page === '') {
    setupStartPage();
  } else if (page === 'quizscreen.html') {
    startQuiz();
  } else if (page === 'resultscreen.html') {
    showResults();
  }
});

function setupStartPage() {
  const startButton = document.getElementById('start-btn');
  if (startButton) {
    startButton.addEventListener('click', () => {
      window.location.href = 'quizscreen.html';
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

  if (!questionText || !answersContainer) return;

  answersDisabled = false;
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;

  currentQuestionSpan.textContent = currentQuestionIndex + 1;
  progressBar.style.width = progressPercent + '%';
  questionText.textContent = currentQuestion.question;

  answersContainer.innerHTML = '';
  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement('button');
    button.textContent = answer.text;
    button.classList.add('answer-btn');
    button.dataset.correct = answer.correct;
    button.addEventListener('click', selectAnswer);
    answersContainer.appendChild(button);
  });
}

function selectAnswer(event) {
  if (answersDisabled) {
    return;
  }

  answersDisabled = true;
  const selectedButton = event.target;
  const isCorrect = selectedButton.dataset.correct === 'true';
  const scoreSpan = document.getElementById('score');

  if (isCorrect) {
    selectedButton.classList.add('correct');
    score++;
    scoreSpan.textContent = score;
  } else {
    selectedButton.classList.add('incorrect');
  }
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion();
    } else {
      localStorage.setItem('mostRecentScore', score);
      window.location.href = 'resultscreen.html';
    }
  }, 1000);
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
  window.location.href = 'index.html';
}
