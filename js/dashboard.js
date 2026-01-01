document.addEventListener('DOMContentLoaded', () => {
  // 1. Auth Check
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    alert('Please login to view dashboard');
    window.location.href = '../pages/login.html';
    return;
  }

  // --- FIX FOR UNDEFINED NAME ---
  // Try to get username, otherwise grab the part of email before '@', otherwise 'Student'
  let displayName = 'Student';
  if (currentUser.username) {
    displayName = currentUser.username;
  } else if (currentUser.email) {
    displayName = currentUser.email.split('@')[0];
  }

  // Capitalize first letter just in case
  displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  document.getElementById('user-name').textContent = displayName;
  // -----------------------------

  // 2. Load History
  const historyKey = `history_${currentUser.email}`;
  const history = JSON.parse(localStorage.getItem(historyKey)) || [];

  // 3. Update Stats & Table
  updateStats(history);
  populateTable(history);

  // 4. Bind Button
  document.getElementById('start-new-btn').addEventListener('click', () => {
    window.location.href = '../pages/home.html';
  });
});

function updateStats(history) {
  const totalQuizzes = history.length;

  let totalScorePercent = 0;
  let highScore = 0;
  let maxPossible = 0;

  history.forEach((item) => {
    totalScorePercent += item.percentage;

    // Safety check: handle both 'total' and the typo 'toatl'
    const actualTotal = item.total || item.toatl || 0;

    if (item.score > highScore) {
      highScore = item.score;
      maxPossible = actualTotal;
    }
  });

  const avg =
    totalQuizzes > 0 ? Math.round(totalScorePercent / totalQuizzes) : 0;

  document.getElementById('total-quizzes').innerText = totalQuizzes;
  document.getElementById('avg-score').innerText = `${avg}%`;
  document.getElementById('high-score').innerText =
    totalQuizzes > 0 ? `${highScore}/${maxPossible}` : '-';
}

function populateTable(history) {
  const tbody = document.getElementById('history-body');
  const noDataMsg = document.getElementById('no-data-msg');

  if (history.length === 0) {
    noDataMsg.style.display = 'block';
    return;
  }

  const reversedHistory = [...history].reverse();

  reversedHistory.forEach((record) => {
    const row = document.createElement('tr');
    const isPass = record.percentage >= 50;
    const statusClass = isPass ? 'status-pass' : 'status-fail';
    const statusText = isPass ? 'Passed' : 'Needs Work';

    // Safety check for the table display as well
    const displayTotal = record.total || record.toatl || '?';

    row.innerHTML = `
        <td>${record.date}</td>
        <td><span class="highlight">${record.score}/${displayTotal}</span> (${record.percentage}%)</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>
            <button class="btn-review" onclick="viewReview(${record.id})">Review</button>
        </td>
    `;
    tbody.appendChild(row);
  });
}

function viewReview(attemptId) {
  localStorage.setItem('reviewAttemptId', attemptId);
  window.location.href = 'review.html';
}
