document.getElementsByClassName("categoryModel")[0].style.display = "none";
document.getElementsByClassName("questionAnswer")[0].style.display = "none";
document.getElementsByClassName("scoreContainer")[0].style.display = "none";
document.getElementsByClassName("exitOrPlayAgain")[0].style.display = "none";

let allCategories;
let player1Name = "";
let player2Name = "";
let totalArray = [];
let player1Score = 0;
let player2Score = 0;
let quesCount = 0;
let player1FinalResult = "";
let player2FinalResult = "";
let Slectedcategory = "";

allCategories = [
  { value: "music", text: "music" },
  { value: "sport_and_leisure", text: "sport_and_leisure" },
  { value: "film_and_tv", text: "film_and_tv" },
  { value: "arts_and_literature", text: "arts_and_literature" },
  { value: "history", text: "history" },
  { value: "society_and_culture", text: "society_and_culture" },
  { value: "science", text: "science" },
  { value: "geography", text: "geography" },
  { value: "food_and_drink", text: "food_and_drink" },
  { value: "general_knowledge", text: "general_knowledge" },
];

let currentCategories = [...allCategories];

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const getinfo = (questions) => {
  const array = questions.map((question) => {
    const Question = question.question;
    const correctAnswer = question.correctAnswer;
    const incorrectAnswers = question.incorrectAnswers;
    const allAnswers = [...incorrectAnswers, correctAnswer];
    const shuffledAnswers = shuffleArray(allAnswers);
    return {
      Question: Question,
      correctAnswer: correctAnswer,
      allAnswers: shuffledAnswers,
    };
  });
  totalArray = totalArray.concat(array);
};

const MaxEasy = 2;
const MaxMedium = 4;
const Diff = 6;


let whoWon = "";
const findWinnerLooser = () => {
  if (player1Score > player2Score) {
    whoWon = `${player1Name} wins!`;
  } else if (player1Score < player2Score) {
    whoWon = `${player2Name} wins!`;
  } else {
    whoWon = "It's a Draw!";
  }
};

const scoreContainer = () => {
  document.getElementsByClassName("exitOrPlayAgain")[0].style.display = "none";
  document.getElementsByClassName("scoreContainer")[0].style.display = "block";
  findWinnerLooser();
  document.querySelector(".playersScores .player1 p span").textContent =
    player1Score;
  document.querySelector(".playersScores .player2 p span").textContent =
    player2Score;

  document.querySelector(".whoWon").textContent = whoWon;
};

const playAgainAnotherCategory = () => {
  totalArray = [];
  quesCount = 0;
  document.getElementsByClassName("questionAnswer")[0].style.display = "none";
  document.getElementsByClassName("exitOrPlayAgain")[0].style.display = "none";
  console.log(currentCategories);
  currentCategories = currentCategories.filter(
    (cat) => cat.value !== Slectedcategory
  );
  Slectedcategory = "";
  console.log("filtered categories:", currentCategories);
  document.getElementsByClassName("categoryModel")[0].style.display = "flex";
  dropDown(currentCategories);
};

const catgoryEndBefore = 1;

const exitOrPlayAgain = () => {
  if (currentCategories.length === catgoryEndBefore) {
    const playAgainButton = document.getElementById("playAgainButton");
    if (playAgainButton) {
      console.log("i am here");
      playAgainButton.style.display = "none";
    }
  }
  document.getElementsByClassName("questionAnswer")[0].style.display = "none";
  document.getElementsByClassName("categoryModel")[0].style.display = "none";
  document.getElementsByClassName("exitOrPlayAgain")[0].style.display = "block";
  document
    .getElementById("endGameButton")
    .addEventListener("click", scoreContainer);
  document
    .getElementById("playAgainButton")
    .addEventListener("click", () => playAgainAnotherCategory());
};

const nextQuestionAnswer = (correctAnswer) => {
  const selectedOption = document.querySelector('input[name="answer"]:checked');
  if (!selectedOption) {
    alert("Please select an answer!");
    return;
  }
  const selectedValue = selectedOption.value;
  console.log(quesCount);
  const addScore = (value) => {
    if (quesCount === 0 || quesCount % 2 === 0) {
      player1Score += value;
    } else {
      player2Score += value;
    }
  };
  if (selectedValue === correctAnswer) {
    if (quesCount < MaxEasy) {
      addScore(10);
    }
    if (quesCount >= MaxEasy && quesCount < MaxMedium) {
      addScore(15);
    }
    if (quesCount >= MaxMedium && quesCount < MaxMedium) {
      addScore(20);
    }
  }
  quesCount = quesCount + 1;
  displayQuestionAnswers(totalArray, quesCount);
};

const maxQuesCount = 6;

const displayQuestionAnswers = (totalArray, quesCount) => {
  if (quesCount === maxQuesCount) {
    exitOrPlayAgain(player1Score, player2Score);
    return;
  }
  document.getElementsByClassName("questionAnswer")[0].style.display = "block";
  const question = totalArray[quesCount].Question;
  const correctAnswer = totalArray[quesCount].correctAnswer;
  const parent = document.getElementsByClassName("questionAnswer")[0];
  parent.innerHTML = "";
  const mainheading = document.createElement("h1");
  if (quesCount === 0) {
    mainheading.innerHTML = player1Name;
  }
  const playerName = quesCount % 2 === 0 ? player1Name : player2Name;
  mainheading.innerHTML = playerName;
  parent.appendChild(mainheading).style.textAlign = "center";
  const heading = document.createElement("h2");
  heading.innerHTML = question;
  parent.appendChild(heading).style.textAlign = "center";
  heading.style.padding = "20px";
  const allAnswers = totalArray[quesCount].allAnswers;
  for (let i = 0; i < allAnswers.length; i++) {
    const input = document.createElement("input");
    input.type = "radio";
    input.value = allAnswers[i];
    input.name = "answer";
    const label = document.createElement("label");
    label.textContent = allAnswers[i];
    parent.appendChild(input).style.marginLeft = "20px";
    parent.appendChild(label).style.marginLeft = "10px";
    const br = document.createElement("br");
    parent.appendChild(br);
  }
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "submit";
  parent.appendChild(button).style.margin = "20px";

  button.addEventListener("click", () => nextQuestionAnswer(correctAnswer));
  console.log(player1Score, player2Score);
};

const getQuestionAnswers = async (event) => {
  event.preventDefault();
  try {
    Slectedcategory = document.getElementById("SelectCategory").value;
    if (!Slectedcategory) {
      alert("Please select a category!");
      return;
    }
    console.log(Slectedcategory);
    const fetchQuestions = async (difficulty) => {
      const response = await fetch(
        `https://the-trivia-api.com/api/questions?categories=${Slectedcategory}&limit=2&difficulty=${difficulty}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    };
    const easyQuestions = await fetchQuestions("easy");
    getinfo(easyQuestions);

    const mediumQuestions = await fetchQuestions("medium");
    getinfo(mediumQuestions);

    const hardQuestions = await fetchQuestions("hard");
    getinfo(hardQuestions);

    console.log(totalArray);
    document.getElementsByClassName("categoryModel")[0].style.display = "none";
    document.getElementsByClassName("exitOrPlayAgain")[0].style.display =
      "none";
    displayQuestionAnswers(totalArray, quesCount);
  } catch (error) {
    alert("there is an error in fetching the questions");
  }
};

const dropDown = (currentCategories) => {
  const select = document.getElementById("SelectCategory");
  select.innerHTML = "";
  currentCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.value;
    option.textContent = category.text;
    select.appendChild(option);
  });
};

const categoryDisplay = () => {
  const categoryModel = document.getElementsByClassName("categoryModel")[0];
  const form = document.createElement("form");
  form.id = "categoryForm";
  const select = document.createElement("select");
  select.id = "SelectCategory";
  select.name = "category";
  form.appendChild(select);
  categoryModel.appendChild(form);
  dropDown(allCategories);
  const button = document.createElement("button");
  button.type = "submit";
  button.textContent = "GO";
  form.appendChild(button);
  categoryModel.appendChild(form);
  document
    .getElementById("categoryForm")
    .addEventListener("submit", getQuestionAnswers);
};

const userSubmitForm = (event) => {
  event.preventDefault();
  const user1 = document.getElementById("user1").value;
  const user2 = document.getElementById("user2").value;
  console.log(user1, user2);
  if (user1 === "" || user2 === "") {
    alert("Please fill out both user names!");
    return;
  }
  player1Name = user1;
  player2Name = user2;
  document.getElementById("user1").value = "";
  document.getElementById("user2").value = "";
  categoryDisplay();
  document.getElementsByClassName("users")[0].style.display = "none";
  document.getElementsByClassName("categoryModel")[0].style.display = "flex";
};
