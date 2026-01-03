let questions = [];
let currentIndex = 0;
let answers = {};
let timer;
let timeLeft = 90;

// Load questions
fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    questions = data;
  });

function startQuiz() {
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("quiz-screen").classList.remove("hidden");
  currentIndex = 0;
  showQuestion();
}

function showQuestion() {
  clearInterval(timer);
  timeLeft = 90;
  startTimer();

  const q = questions[currentIndex];
  document.getElementById("question-number").innerText =
    `Question ${currentIndex + 1} / ${questions.length}`;

  document.getElementById("question").innerText = q.question;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.options.forEach(option => {
    if (option.trim() !== "") {
      const btn = document.createElement("button");
      btn.innerText = option;

      if (answers[currentIndex] === option) {
        btn.classList.add("selected");
      }

      btn.onclick = () => {
        answers[currentIndex] = option;
        showQuestion();
      };

      optionsDiv.appendChild(btn);
    }
  });
}

function startTimer() {
  document.getElementById("timer").innerText = `Time: ${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = `Time: ${timeLeft}s`;

    if (timeLeft <= 0) {
      nextQuestion();
    }
  }, 1000);
}

function nextQuestion() {
  clearInterval(timer);
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    showQuestion();
  } else {
    endQuiz();
  }
}

function prevQuestion() {
  clearInterval(timer);
  if (currentIndex > 0) {
    currentIndex--;
    showQuestion();
  }
}

function endQuiz() {
  clearInterval(timer);
  document.getElementById("quiz-screen").classList.add("hidden");
  document.getElementById("result-screen").classList.remove("hidden");

  let score = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.correctAnswer) score++;
  });

  document.getElementById("result-screen").innerHTML = `
    <h2>Quiz Finished</h2>
    <p>Score: <b>${score} / ${questions.length}</b></p>
    <p>Accuracy: ${((score / questions.length) * 100).toFixed(2)}%</p>
  `;
}
