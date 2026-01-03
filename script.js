let questions = [];
let currentIndex = 0;
let answers = {};
let timer;
let timeLeft = 90;

fetch("questions.json")
  .then(res => res.json())
  .then(data => questions = data);

function startQuiz() {
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("quiz-screen").classList.remove("hidden");
  showQuestion();
}

function showQuestion() {
  clearInterval(timer);
  timeLeft = 90;
  startTimer();

  const q = questions[currentIndex];

  document.getElementById("question-count").innerText =
    `Question ${currentIndex + 1} / ${questions.length}`;

  document.getElementById("question-text").innerText = q.question;

  const img = document.getElementById("question-image");
  if (q.image && q.image.trim()) {
    img.src = q.image;
    img.classList.remove("hidden");
  } else {
    img.classList.add("hidden");
  }

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.options.forEach(opt => {
    if (opt.trim()) {
      const btn = document.createElement("button");
      btn.innerText = opt;

      if (answers[currentIndex] === opt) {
        btn.classList.add("selected");
      }

      btn.onclick = () => {
        answers[currentIndex] = opt;
        showQuestion();
      };

      optionsDiv.appendChild(btn);
    }
  });

  renderPalette();
}

function startTimer() {
  document.getElementById("timer").innerText = `${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = `${timeLeft}s`;
    if (timeLeft <= 0) nextQuestion();
  }, 1000);
}

function renderPalette() {
  const palette = document.getElementById("question-palette");
  palette.innerHTML = "";

  questions.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.innerText = i + 1;

    if (i === currentIndex) btn.classList.add("active");
    if (answers[i]) btn.classList.add("answered");

    btn.onclick = () => {
      clearInterval(timer);
      currentIndex = i;
      showQuestion();
    };

    palette.appendChild(btn);
  });
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
  const result = document.getElementById("result-screen");
  result.classList.remove("hidden");

  let score = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.correctAnswer) score++;
  });

  result.innerHTML = `
    <h1>Quiz Completed 🎉</h1>
    <h2>Score: ${score} / ${questions.length}</h2>
    <p>Accuracy: ${((score / questions.length) * 100).toFixed(2)}%</p>
  `;
}
