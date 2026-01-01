// Review Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // Get current user and attempt data
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const attemptId = localStorage.getItem('reviewAttemptId');

  // Check if user is logged in
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  // Check if attempt ID exists
  if (!attemptId) {
    displayEmptyState('No review data found. Please take a quiz first.');
    return;
  }

  // Get user's history
  const history =
    JSON.parse(localStorage.getItem(`history_${user.email}`)) || [];
  const attempt = history.find((h) => h.id == attemptId);

  // Check if attempt exists
  if (!attempt) {
    displayEmptyState('Review session not found. It may have been deleted.');
    return;
  }

  // Render the review
  renderReview(attempt);
});

/**
 * Renders the complete review of the quiz attempt
 * @param {Object} attempt - The quiz attempt object
 */
function renderReview(attempt) {
  const container = document.getElementById('review-content');

  // Calculate stats
  let correctCount = 0;
  let incorrectCount = 0;

  // Count correct and incorrect answers
  attempt.questionsSnapshot.forEach((q, qIdx) => {
    const userChoice = attempt.userAttempt[qIdx];
    if (userChoice !== null && q.answers[userChoice].correct) {
      correctCount++;
    } else if (userChoice !== null) {
      incorrectCount++;
    }
  });

  const totalQuestions = attempt.questionsSnapshot.length;
  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

  // Update summary stats
  updateStats(correctCount, incorrectCount, scorePercentage);

  // Render each question
  attempt.questionsSnapshot.forEach((q, qIdx) => {
    const questionBox = createQuestionBox(q, qIdx, attempt.userAttempt[qIdx]);
    container.appendChild(questionBox);
  });
}

/**
 * Updates the summary statistics at the top of the page
 * @param {number} correct - Number of correct answers
 * @param {number} incorrect - Number of incorrect answers
 * @param {number} score - Score percentage
 */
function updateStats(correct, incorrect, score) {
  document.getElementById('correct-count').textContent = correct;
  document.getElementById('incorrect-count').textContent = incorrect;
  document.getElementById('score-value').textContent = `${score}%`;
}

/**
 * Creates a question box element
 * @param {Object} question - The question object
 * @param {number} qIdx - Question index
 * @param {number|null} userChoice - User's selected answer index
 * @returns {HTMLElement} The question box element
 */
function createQuestionBox(question, qIdx, userChoice) {
  const qDiv = document.createElement('div');
  qDiv.className = 'question-box';

  // Determine if user's answer was correct
  const isUserRight =
    userChoice !== null && question.answers[userChoice].correct;

  // Add appropriate class for styling
  if (userChoice !== null) {
    qDiv.classList.add(isUserRight ? 'correct-box' : 'incorrect-box');
  }

  // Create question header
  const questionHeader = document.createElement('h3');
  questionHeader.textContent = `${qIdx + 1}. ${question.question}`;
  qDiv.appendChild(questionHeader);

  // Create answer options
  question.answers.forEach((ans, aIdx) => {
    const answerDiv = createAnswerOption(ans, aIdx, userChoice);
    qDiv.appendChild(answerDiv);
  });

  return qDiv;
}

/**
 * Creates an answer option element
 * @param {Object} answer - The answer object
 * @param {number} aIdx - Answer index
 * @param {number|null} userChoice - User's selected answer index
 * @returns {HTMLElement} The answer option element
 */
function createAnswerOption(answer, aIdx, userChoice) {
  const ansDiv = document.createElement('div');
  ansDiv.className = 'ans';

  let statusClass = '';
  let labelText = '';

  // Determine the status of this answer
  if (aIdx === userChoice) {
    // This was the user's choice
    if (answer.correct) {
      statusClass = 'correct';
      labelText = ' (Your Correct Answer)';
    } else {
      statusClass = 'incorrect';
      labelText = ' (Your Wrong Answer)';
    }
  } else if (answer.correct) {
    // This is the correct answer but user didn't select it
    statusClass = 'missed';
    labelText = ' (Correct Answer)';
  }

  if (statusClass) {
    ansDiv.classList.add(statusClass);
  }

  ansDiv.textContent = answer.text + labelText;

  return ansDiv;
}

/**
 * Displays an empty state message when no review data is available
 * @param {string} message - The message to display
 */
function displayEmptyState(message) {
  const container = document.getElementById('review-content');
  const emptyDiv = document.createElement('div');
  emptyDiv.className = 'empty-state';

  const heading = document.createElement('h2');
  heading.textContent = '📋 No Review Available';

  const paragraph = document.createElement('p');
  paragraph.textContent = message;

  const button = document.createElement('button');
  button.className = 'back-btn';
  button.textContent = 'Go to Dashboard';
  button.style.marginTop = '20px';
  button.onclick = () => (window.location.href = 'dashboard.html');

  emptyDiv.appendChild(heading);
  emptyDiv.appendChild(paragraph);
  emptyDiv.appendChild(button);
  container.appendChild(emptyDiv);

  // Hide stats when there's no data
  document.querySelector('.summary-stats').style.display = 'none';
}
