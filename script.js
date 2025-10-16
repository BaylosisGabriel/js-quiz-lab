// ================================
// JavaScript Quiz Game
// ================================

const quizData = [
  {
    question: "What does 'let' declare in JavaScript?",
    options: ["A constant value", "A changeable variable", "A function", "An array"],
    correct: 1
  },
  {
    question: "Which is the strict equality operator?",
    options: ["==", "=", "===", "!="],
    correct: 2
  },
  {
    question: "What is the purpose of a for loop?",
    options: ["To declare variables", "To repeat code a set number of times", "To handle events", "To style elements"],
    correct: 1
  },
  {
    question: "How do you select an element by ID in the DOM?",
    options: ["querySelector", "getElementById", "createElement", "appendChild"],
    correct: 1
  },
  {
    question: "Which keyword prevents variable reassignment?",
    options: ["let", "const", "var", "static"],
    correct: 1
  },
  {
    question: "What does DOM stand for?",
    options: ["Document Object Model", "Display Object Manager", "Digital Operation Mode", "Data Output Method"],
    correct: 0
  },
  {
    question: "How do you select an element with the ID 'header' in CSS?",
    options: [".header", "#header", "header", "id.header"],
    correct: 1
  },
  {
    question: "Which CSS property controls the text size?",
    options: ["font-size", "text-style", "font-weight", "text-size"],
    correct: 0
  },
  {
    question: "What does HTML stand for?",
    options: [
      "Hyperlinks and Text Markup Language",
      "Hyper Text Markup Language",
      "Home Tool Markup Language",
      "Hyper Tag Markdown Language"
    ],
    correct: 1
  },
  {
    question: "Which tag is used to create a hyperlink in HTML?",
    options: ["<a>", "<link>", "<href>", "<url>"],
    correct: 0
  }
];

// ============= VARIABLES =============
let currentQuestion = 0;
let score = 0;
let selectedAnswer = -1;
let totalQuestions = quizData.length;
let timerInterval;
let timeLeft = 30;
let highScore = localStorage.getItem("jsQuizHighScore") || 0;

// Shuffle questions initially
quizData.sort(() => Math.random() - 0.5);

// Shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ============= UPDATE PROGRESS BAR =============
function updateProgress() {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  document.getElementById("progress-fill").style.width = progress + "%";
  document.getElementById("current-q").textContent = currentQuestion + 1;
  document.getElementById("total-q").textContent = totalQuestions;
}

// ============= TIMER FUNCTIONS =============
function startTimer() {
  timeLeft = 30;
  document.getElementById("timer-container").style.display = "block";
  document.getElementById("timer-text").textContent = timeLeft;
  document.getElementById("timer-fill").style.width = "100%";

  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer-text").textContent = timeLeft;
    document.getElementById("timer-fill").style.width = (timeLeft / 30) * 100 + "%";

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      nextQuestion(); // timeout
    }
  }, 1000);
}

function clearTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    document.getElementById("timer-container").style.display = "none";
  }
}

// ============= LOAD QUESTION =============
function loadQuestion() {
  try {
    const q = quizData[currentQuestion];
    if (!q) throw new Error("No question data");

    // Shuffle the choices, keeping track of the correct one
    const optionsWithIndex = q.options.map((opt, idx) => ({
      text: opt,
      isCorrect: idx === q.correct
    }));

    const shuffled = shuffleArray(optionsWithIndex);

    document.getElementById("question").textContent = q.question;
    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    shuffled.forEach((opt, index) => {
      const btn = document.createElement("button");
      btn.textContent = opt.text;
      btn.classList.add("option");
      btn.onclick = () => selectOption(opt.isCorrect, btn);
      optionsDiv.appendChild(btn);
    });

    document.getElementById("next-btn").style.display = "none";
    updateProgress();
    startTimer();
  } catch (err) {
    console.error("Error loading question:", err);
    document.getElementById("question").innerHTML =
      "<p style='color:red;'>Error loading question. Check console.</p>";
  }
}

// ============= SELECT OPTION =============
function selectOption(isCorrect, btn) {
  if (selectedAnswer !== -1) return; // Prevent multiple clicks
  selectedAnswer = isCorrect ? 1 : 0;
  clearTimer();

  const options = document.querySelectorAll(".option");
  options.forEach(opt => {
    opt.disabled = true;
    opt.classList.remove("correct", "incorrect");
  });

  if (isCorrect) {
    btn.classList.add("correct");
  } else {
    btn.classList.add("incorrect");
    // Highlight the correct one
    const correctBtn = Array.from(options).find(o => o.textContent === findCorrectAnswer().text);
    if (correctBtn) correctBtn.classList.add("correct");
  }

  document.getElementById("next-btn").style.display = "block";
}

// Finding the correct option text for current question
function findCorrectAnswer() {
  const q = quizData[currentQuestion];
  return { text: q.options[q.correct] };
}

// ============= NEXT QUESTION =============
function nextQuestion() {
  if (selectedAnswer === 1) score++;

  currentQuestion++;
  selectedAnswer = -1;

  if (currentQuestion < totalQuestions) {
    loadQuestion();
  } else {
    showScore();
  }
}

// ============= SHOW SCORE =============
function showScore() {
  clearTimer();
  document.getElementById("question-container").style.display = "none";
  document.getElementById("score-container").style.display = "flex";

  document.getElementById("score-circle-text").textContent = score;
  document.getElementById("total-score").textContent = totalQuestions;

  const percentage = Math.round((score / totalQuestions) * 100);
  let feedback = "";

  if (percentage >= 90) feedback = "🔥 Perfect! You’re a JavaScript Master!";
  else if (percentage >= 70) feedback = "👏 Great work! Keep learning.";
  else if (percentage >= 50) feedback = "👍 Not bad! Review a few topics.";
  else feedback = "📚 Keep practicing — you’ll get there!";

  document.getElementById("feedback").textContent = feedback;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("jsQuizHighScore", highScore);
  }

  document.getElementById("high-score").style.display = "block";
  document.getElementById("high-score-val").textContent = highScore;
}

// ============= RESTART QUIZ =============
function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  selectedAnswer = -1;

  document.getElementById("question-container").style.display = "block";
  document.getElementById("score-container").style.display = "none";
  document.getElementById("high-score").style.display = "none";

  quizData.sort(() => Math.random() - 0.5); //reshuffle questions
  loadQuestion();
}

// ============= INITIALIZE =============
document.addEventListener("DOMContentLoaded", loadQuestion);
