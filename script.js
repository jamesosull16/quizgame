//VARIABLE DECLARATIONS

var quiz = document.querySelector("#quiz");
var intro = document.querySelector("#introduction");
var assesFT = document.querySelector("#assess-ft");
var startBtn = document.querySelector("#startBtn");
var timeSpan = document.querySelector("#timeSpan");
var questionH5 = document.querySelector("#question");
var answersDiv = document.querySelector("#answers");
var allDone = document.querySelector("#allDone");
var finalScore = document.querySelector("#finalScore");
var submit = document.querySelector("#submit");
var highScoresList = document.querySelector("#highScoresList");
var initials = document.querySelector("#initials");
var clearHighscoresBtn = document.querySelector("#clearHighscoresBtn");
var progressBar = document.querySelector(".progress");

var totalSeconds = 140;
var timeRemining = totalSeconds;
var secondsElapsed = 0;
var discountSeconds = 0;
var currentQuestion = 0;
var correctAnswers = 0;
var correctScore = 0;
var progress = 0;
var localHighscoresArray = [];
var time = setInterval(timer, 1000);
var justRegistered = false;
clearInterval(time);

// questions array
//set the correct answers to the [0] so the randomizer in the showQuestion() will effectively mix up the answers each time the quiz is run
var questionsArray = [
  {
    q: "How long is a swim in an Ironman triathlon?",
    a: ["2.4 miles", "2 miles", "1.2 miles", "1.5 miles"],
    ca: 0,
  },
  {
    q: "Who is the defending male and female Ironman World Champion?",
    a: [
      "Jan Frodeno/Anne Haug",
      "Tim O'Donnel/Mirinda Carfrae",
      "Craig Alexander/Daniela Ryf",
      "Mark Allen/Lucy Charles-Barkley",
    ],
    ca: 0,
  },
  {
    q: "How long is the bike ride in an Ironman triathlon?",
    a: ["112 miles", "100 miles", "116 miles", "56 miles"],
    ca: 0,
  },
  {
    q: "Who won the very first Ironman World Championship in 1978?",
    a: ["Gordan Haller", "John Dunbar", "Dave Scott", "James O'Sullivan"],
    ca: 0,
  },
  {
    q: "How long is the run in an Ironman triathlon?",
    a: ["26.2 miles", "13.1 miles", "26.5 miles", "20 miles"],
    ca: 0,
  },
  {
    q:
      "What country has dominated the men's podium at the World Championship since 2014?",
    a: ["Germany", "Switzerland", "USA", "Canada"],
    ca: 0,
  },
  {
    q: "Who holds the women's run course record at the World Championship?",
    a: ["Mirinda Carfrae", "Lucy Charles-Barkley", "Daniela Ryf", "Anne Haug"],
    ca: 0,
  },
  {
    q: "Who holds the female's fastest time in any iron distance triathlon",
    a: [
      "Chrissie Wellington",
      "Mirinda Carfrae",
      "Daniella Ryf",
      "Heather Jackson",
    ],
    ca: 0,
  },
  {
    q: "Where is the Ironman World Championship held every year?",
    a: ["Kona, HI", "Roth, Germany", "Los Angeles, CA", "Barcelona, Spain"],
    ca: 0,
  },
  {
    q:
      "Who currently holds the men's course record at the Ironman World Championship?",
    a: ["Jan Frodeno", "Craig Alexander", "Ben Hoffman", "Patrick Lange"],
    ca: 0,
  },
];

//EVENT LISTENERS

startBtn.addEventListener("click", startQuiz);
answersDiv.addEventListener("click", assesSelection);
submit.addEventListener("click", addToHighscores);
clearHighscoresBtn.addEventListener("click", clearHighscores);
$("#staticBackdrop").on("shown.bs.modal", function (e) {
  loadHighScores();
});
$("#staticBackdrop").on("hidden.bs.modal", function (e) {
  if (justRegistered) {
    init();
  }
});

init();

//FUNCTIONS

function init() {
  timeSpan.textContent = timeRemining;
  quiz.style.display = "none";
  allDone.style.display = "none";
  assesFT.style.display = "none";
  intro.style.display = "block";
  startBtn.style.display = "block";
  progressBar.style.display = "none";

  totalSeconds = 140;
  timeRemining = totalSeconds;
  secondsElapsed = 0;
  discountSeconds = 0;
  currentQuestion = 0;
  progress = 0;
  correctAnswers = 0;
  correctScore = 0;
  justRegistered = false;
  timeSpan.textContent = timeRemining;

  if (localStorage.getItem("highscore")) {
    localHighscoresArray = localStorage.getItem("highscore").split(",");
  }
  clearInterval(time);
  updateProgress();

  allDone.firstElementChild.setAttribute("class", "alert alert-info mt-0 mb-0");
  submit.setAttribute("class", "btn btn-info");
  progressBar.firstElementChild.setAttribute(
    "class",
    "progress-bar bg-info progress-bar striped progress-bar animated"
  );
}

//FUNCTION TO KICK THINGS OFF.  CALLS THE SHOWQUESTION() FOR THE QUESTIONS TO DISPLAY AFTER CLICKING 'START QUIZ' BUTTON
function startQuiz() {
  intro.style.display = "none";
  startBtn.style.display = "none";
  quiz.style.display = "block";
  time = setInterval(timer, 1000);
  progressBar.style.display = "block";
  showQuestion();
}
//KICKS THE TIMER OFF WHEN THE 'START QUIZ' BUTTON IS CLICKED
function timer() {
  timeRemining = totalSeconds - secondsElapsed - 1 - discountSeconds;
  timeSpan.textContent = timeRemining;
  secondsElapsed++;
  if (timeRemining <= 0) {
    clearInterval(time);
    disableQuestions();
    gameOver("time_out");
  }
}
//DISPLAYS THE QUESTIONS THROUGHOUT THE QUIZ
function showQuestion() {
  questionH5.textContent = questionsArray[currentQuestion].q;
  var aBtnsArray = [];
  var indexArray = [];
  //creating a button for each answer option
  for (i = 0; i < questionsArray[currentQuestion].a.length; i++) {
    var questionBtn = document.createElement("button");
    questionBtn.setAttribute("type", "button");
    questionBtn.setAttribute(
      "class",
      "list-group-item list-group-item-action list-group-item-info mt-1 answerButton"
    );
    //WORKING WITH THE RANDOMIZER TO DISPLAY THE ANSWERS IN A RANDOM MANOR EVERYTIME THE QUIZ IS RUN THROUGH
    questionBtn.setAttribute("data-index", i);
    if (i === 0) {
      questionBtn.setAttribute("ca", "yes");
    } else {
      questionBtn.setAttribute("ca", "no");
    }
    questionBtn.textContent = questionsArray[currentQuestion].a[i];
    answersDiv.append(questionBtn);
    indexArray.push(i);
  }
  //RANDOMIZER TO MIX UP THE ANSWERS
  answersDiv.childNodes.forEach(function (child) {
    var rndIndex = Math.floor(Math.random() * indexArray.length);
    answersDiv.append(answersDiv.children[rndIndex]);
    indexArray.splice(rndIndex, 1);
  });
}

function disableQuestions() {
  let questionsAssed = document.querySelectorAll(".answerButton");
  questionsAssed.forEach((element) => {
    element.setAttribute(
      "class",
      "list-group-item list-group-item-action list-group-item-danger mt-1 answerButton disabled"
    );
    if (
      parseInt(element.getAttribute("data-index")) ===
      questionsArray[currentQuestion].ca
    ) {
      element.setAttribute(
        "class",
        "list-group-item list-group-item-action list-group-item-success mt-1 answerButton disabled"
      );
    }
  });
}

function assesSelection(event) {
  if (event.target.matches("button")) {
    var index = parseInt(event.target.getAttribute("data-index"));
    var timeInterval = 1000;
    disableQuestions();
    if (event.target.getAttribute("ca") === "yes") {
      displayFTAlert(true);
      correctAnswers++;
    } else {
      discountSeconds += 2;
      clearInterval(time);
      time = setInterval(timer, 1000);
      displayFTAlert(false);
    }
    currentQuestion++;
    updateProgress();

    if (currentQuestion === questionsArray.length) {
      timeInterval = 5000;
      gameOver("questions_done");
    } else {
      setTimeout(removeQuestionsButtons, 1000);
      setTimeout(showQuestion, 1001);
    }

    setTimeout(function () {
      assesFT.style.display = "none";
    }, timeInterval);
  }
}

function updateProgress() {
  progress = Math.floor((currentQuestion / questionsArray.length) * 100);
  var styleStr = String("width: " + progress + "%; height: 100%;");
  progressBar.firstElementChild.setAttribute("style", styleStr);
  progressBar.firstElementChild.textContent = progress + " %";
  correctScore = Math.floor((correctAnswers / questionsArray.length) * 100);
}

//DISPLAYS CORRCT OR INCORRECT MESSAGE DEPENDING ON IF THE USER GETS QUESTION CORRECT
function displayFTAlert(ca) {
  if (ca) {
    assesFT.setAttribute(
      "class",
      "alert alert-success mt-0 mb-0 pt-0 pb-0 text-center"
    );
    assesFT.innerHTML = "<strong>Correct</strong>";
    assesFT.style.display = "block";
  } else {
    assesFT.setAttribute(
      "class",
      "alert alert-danger mt-0 mb-0 pt-0 pb-0 text-center"
    );
    assesFT.innerHTML =
      "<strong>Incorrect. </strong> 2 secs. discounted. Keep trying!!";
    assesFT.style.display = "block";
    timeSpan.style.color = "red";
    setTimeout(function () {
      timeSpan.style.color = "black";
    }, 1000);
  }
}

function removeQuestionsButtons() {
  questionH5.textContent = "";
  var child = answersDiv.lastElementChild;
  while (child) {
    answersDiv.removeChild(child);
    child = answersDiv.lastElementChild;
  }
}

function gameOver(cause) {
  if (cause === "questions_done") {
    setTimeout(() => {
      assesFT.setAttribute(
        "class",
        "alert alert-dark mt-0 mb-0 pt-0 pb-0 text-center"
      );
      assesFT.innerHTML = "<strong>Quiz finished</strong>";
    }, 1500);
    clearInterval(time);
  } else if (cause === "time_out") {
    disableQuestions();

    setTimeout(() => {}, 4000);
    assesFT.setAttribute(
      "class",
      "alert alert-info mt-0 mb-0 pt-0 pb-0 text-center"
    );
    assesFT.innerHTML = "<strong>Time finished</strong>";
  } else {
    return false;
  }
  assesFT.style.display = "block";
  if (correctScore >= 70) {
    setTimeout(() => {}, 5000);
  } else {
    setTimeout(() => {
      allDone.firstElementChild.setAttribute(
        "class",
        "alert alert-danger mt-0 mb-0"
      );

      submit.setAttribute("class", "btn btn-danger");
    }, 5000);
  }
  setTimeout(function () {
    finalScore.textContent = correctScore;
    quiz.style.display = "none";
    allDone.style.display = "block";
    assesFT.style.display = "none";
    removeQuestionsButtons();
  }, 5000);
}

function addToHighscores() {
  var highScoreElement = document.createElement("li");
  var highscoreStr = initials.value + " - " + correctScore;
  localHighscoresArray.push(highscoreStr);
  var highscoreArrayStr = localHighscoresArray.toString();
  highScoreElement.textContent = highscoreStr;
  highScoresList.append(highScoreElement);
  localStorage.setItem("highscore", localHighscoresArray);
  justRegistered = true;
  initials.value = "";
  // Modal
  $("#staticBackdrop").modal("show");
}

function loadHighScores() {
  var tempHighscoresArray = [];
  var tempHighscoresObject = {};
  var tempHighscoresObjectsArray = [];
  var tempLocalSCoreArray = [];
  while (highScoresList.hasChildNodes()) {
    highScoresList.removeChild(highScoresList.childNodes[0]);
  }
  var lastPos;
  var lastChar = "";
  var localScore = 0;
  var localStrScore = "";
  var tempHighscore = "";
  for (i = 0; i < localHighscoresArray.length; i++) {
    for (j = localHighscoresArray[i].length - 1; j >= 0; j--) {
      lastPos = localHighscoresArray[i].length - 1;
      lastChar = localHighscoresArray[i][lastPos - j];
      if (lastChar && lastChar >= 0 && lastChar <= 9) {
        localScore += lastChar;
      }
      if (j > 1) {
        if (j === 2 && lastChar === "1") {
        }
        localStrScore += lastChar;
      }

      localScore = parseInt(localScore);
    }

    tempHighscore = localScore + localStrScore;
    tempHighscoresArray.push(tempHighscore);
    tempHighscoresObject.score = localScore;
    tempHighscoresObject.scoreStr = localStrScore;

    tempHighscoresObjectsArray.push(tempHighscoresObject);
    tempLocalSCoreArray.push(localScore);
    localScore = 0;
    localStrScore = "";
    tempHighscoresObject = {};
  }
  tempLocalSCoreArray.sort(function (a, b) {
    return b - a;
  });
  var sortedScoresCompleteArray = [];
  var flagged = [];
  tempLocalSCoreArray.forEach(function (element) {
    tempHighscoresObjectsArray.forEach(function (object, index) {
      if (element === object.score && !flagged.includes(index)) {
        flagged.push(index);

        var tempScoreString = object.scoreStr + " " + object.score;
        sortedScoresCompleteArray.push(tempScoreString);
      }
    });
  });
  for (i = 0; i < sortedScoresCompleteArray.length; i++) {
    var highScoreElement = document.createElement("li");
    highScoreElement.textContent = sortedScoresCompleteArray[i];
    for (j = sortedScoresCompleteArray[i].length - 1; j >= 0; j--) {
      lastPos = sortedScoresCompleteArray[i].length - 1;
      lastChar = sortedScoresCompleteArray[i][lastPos - j];
      if (lastChar && lastChar >= 0 && lastChar <= 9) {
        localScore += lastChar;
      }
      if (j > 1) {
        localStrScore += lastChar;
      }

      localScore = parseInt(localScore);
    }

    tempHighscore = localScore + localStrScore;

    highScoresList.append(highScoreElement);
    tempHighscoresArray.push(tempHighscore);
    tempHighscoresObject.score = localScore;
    tempHighscoresObject.scoreStr = localStrScore;
    tempHighscoresObjectsArray.push(tempHighscoresObject);
    tempLocalSCoreArray.push(localScore);
    localScore = 0;
    localStrScore = "";
    tempHighscoresObject = {};
  }
}

function clearHighscores() {
  localHighscoresArray = [];
  localStorage.setItem("highscore", localHighscoresArray);
  loadHighScores();
}
