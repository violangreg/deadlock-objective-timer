let timerInterval;
let timeLeft = 300;

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 300;
  updateDisplay();
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timerInterval);
    }
  }, 1000);
}

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById('timer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
