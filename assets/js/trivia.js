/* 
    ----------------------------------------------------------------
    FOR TRIVIA.HTML
    ----------------------------------------------------------------
*/

// Create a temporary object to store gameplay data
let gameplayObject = {
    username: '',
    score: 0,
    numQuestions: 0,
    totalTime: 0,
    date: new Date().toJSON().slice(0,10)
}
 
// Handle username form submission
const usernameFormEl = document.querySelector('#username-form');
const submitUsernameForm = function(event) {
    event.preventDefault();
    const username = usernameFormEl.username.value;
    if (!username || username === "") {
        const errorMessageEl = document.querySelector('#error-message');
        errorMessageEl.textContent = "Please enter a valid username.";
        return;
    }
    const usernameModuleEl = document.querySelector('#username-module');
    usernameModuleEl.setAttribute('style', 'display: none;');
    gameplayObject.username = username;
    startCountdown();
  
}
usernameFormEl.addEventListener('submit', submitUsernameForm);

// Start the game countdown
const startCountdown = function() {
    let timeLeft = 4;
    const countEl = document.querySelector('#countdown-timer');
    const timeInterval = setInterval(function() {
        if (timeLeft > 1) {
            countEl.textContent = timeLeft - 1;
            timeLeft--;
        } else if (timeLeft === 1) {
            countEl.textContent = 'Go!';
            timeLeft--;
        } else {
            countEl.textContent = '';
            clearInterval(timeInterval);
            initializeQuestion();
        }
    }, 1000);
}

// Define a global variable for the current question and timer
let currentQuestion = {};
let timer;

// Chose a question type and call the respective operations
const initializeQuestion = function() {
    // Ensure none of the radio buttons are checked
    clearRadioButtons();
    // Randomly select either a multiple choice (0) or short answer (1) question
    const questionType = Math.floor(Math.random() * 2);
    if (questionType === 0) {
        // Display multiple choice question
        newMultipleChoice();
    } else {
        // Display short answer question (displaying only multiple choice for now!)
        newMultipleChoice();
    }
}

// Display a new multiple choice question
const newMultipleChoice = function() {
    // Increment the number of questions
    gameplayObject.numQuestions++;
    // Select a random question
    const questionIndex = Math.floor(Math.random() * tempMultipleChoiceQuestions.length);
    const question = tempMultipleChoiceQuestions[questionIndex];
    currentQuestion = question;
    // Display the prompt header
    const promptHeaderModule = document.querySelector('#prompt-header');
    promptHeaderModule.setAttribute('style', 'display: flex;');
    const promptEl = document.querySelector('#prompt');
    promptEl.textContent = currentQuestion.prompt;
    // Fill the form with the choices
    const multipleChoiceModule = document.querySelector('#multiplechoice-module');
    multipleChoiceModule.setAttribute('style', 'display: flex;');
    const questionALabel = document.querySelector('#choice1-label');
    questionALabel.textContent = currentQuestion.choices[0];
    const questionBLabel = document.querySelector('#choice2-label');
    questionBLabel.textContent = currentQuestion.choices[1];
    const questionCLabel = document.querySelector('#choice3-label');
    questionCLabel.textContent = currentQuestion.choices[2];
    const questionDLabel = document.querySelector('#choice4-label');
    questionDLabel.textContent = currentQuestion.choices[3];
    // Handle the timer
    let timeLeft = 10;
    const timerEl = document.querySelector('#timer');
    timerEl.setAttribute('style', 'background-color: #66FF99;');
    timer = setInterval(function() {
        if (timeLeft != 0) {
            if (timeLeft <= 3) {
                timerEl.setAttribute('style', 'background-color: #ffcbca;');
            }
            timerEl.textContent = timeLeft;
            timeLeft--;
            gameplayObject.totalTime++;
        } else {
            timerEl.textContent = '';
            clearInterval(timer);
            displayMultipleChoiceResults(true);
            setTimeout(() => {
                endGame();
            }, 3000)
        }
    }, 1000);
}

// Handle the multiple choice question submission
const multipleChoiceFormEl = document.querySelector('#multiplechoice-form');
const submitMultipleChoiceForm = function(event) {
    event.preventDefault();
    const correctRadio = `choice${currentQuestion.correctIndex + 1}-input`;
    const timerEl = document.querySelector('#timer');
    let correctAnswer = false;
    if (document.getElementById(correctRadio).checked) {
        gameplayObject.score++;
        clearInterval(timer);
        correctAnswer = true;
        displayMultipleChoiceResults(correctAnswer);
        const streak = document.querySelector('#streak');
        streak.textContent = gameplayObject.score;
        setTimeout(() => {
            timerEl.innerHTML = "";
            clearMessages();
            initializeQuestion();
        }, 3000);
    } else {
        clearInterval(timer);
        displayMultipleChoiceResults(correctAnswer);
        setTimeout(() => {
            timerEl.innerHTML = "";
            clearMessages();
            endGame();
        }, 3000);
    }
}
multipleChoiceFormEl.addEventListener('submit', submitMultipleChoiceForm);

// Display feedback on the multiple choice questions
const displayMultipleChoiceResults = function(correctAnswer) {
    const correctMessage = document.createElement('span');
    correctMessage.textContent = "Correct";
    correctMessage.setAttribute('style', 'color: #66FF99; margin-left: 1rem;');
    const correctDiv = `#question${currentQuestion.correctIndex + 1}-div`;
    const correctDivEl = document.querySelector(correctDiv);
    correctDivEl.appendChild(correctMessage);
    if (correctAnswer) {
        return;
    }
    const incorrectMessage = document.createElement('span');
    incorrectMessage.textContent = "Incorrect";
    incorrectMessage.setAttribute('style', 'color: #ffcbca;  margin-left: 1rem;');
    const radioButtons = document.querySelectorAll('input[name="question"]')
    for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            const incorrectDiv = `#question${i + 1}-div`;
            const incorrectDivEl = document.querySelector(incorrectDiv);
            incorrectDivEl.appendChild(incorrectMessage);
        }
    }
}

// Dsiplay the endgame module with game stats
const endGame = function() {
    // Hide any visible content
    const promptHeaderEl = document.querySelector('#prompt-header');
    promptHeaderEl.setAttribute('style', 'display: none;');
    const multipleChoiceModule = document.querySelector('#multiplechoice-module');
    multipleChoiceModule.setAttribute('style', 'display: none;');
    const shortAnswerModule = document.querySelector('#multiplechoice-module');
    shortAnswerModule.setAttribute('style', 'display: none;');
    // Display the endgame section
    const endgameModuleEl = document.querySelector('#endgame-module');
    endgameModuleEl.setAttribute('style', 'display: flex;');
    const unformattedAvgTime = gameplayObject.totalTime / gameplayObject.numQuestions;
    const avgTime = Math.round(unformattedAvgTime);
    let formattedAvgTime;
    if (avgTime === 1) {
        formattedAvgTime = `${Math.round(unformattedAvgTime)} second`;
    } else {
        formattedAvgTime = `${Math.round(unformattedAvgTime)} seconds`;
    }
    const statObject = {
        username: gameplayObject.username,
        score: gameplayObject.score,
        avgTime: formattedAvgTime,
        date: gameplayObject.date
    }
    const usernameEl = document.querySelector('#player');
    usernameEl.textContent = statObject.username;
    const scoreEl = document.querySelector('#score');
    scoreEl.textContent = statObject.score;
    const avgTimeEl = document.querySelector('#avgTime');
    avgTimeEl.textContent = statObject.avgTime;
    const dateEl = document.querySelector('#date');
    dateEl.textContent = statObject.date;
    updateStatsInStorage(statObject);
}

// Handle the replay game button
const replayButton = document.querySelector('#replay-button');
const restartGame = function(username) {
    gameplayObject = {
        username: username,
        score: 0,
        numQuestions: 0,
        totalTime: 0,
        date: new Date().toJSON().slice(0, 10),
    };
    const endgameModuleEl = document.querySelector('#endgame-module');
    endgameModuleEl.setAttribute('style', 'display: none;');
    startCountdown();
}
replayButton.addEventListener('click', function() {
    restartGame(gameplayObject.username);
});

// Handle the exit game button
const exitButton = document.querySelector('#exit-button');
const redirectPage = function() {
    window.location = "index.html";
}
exitButton.addEventListener('click', redirectPage);

// Clears the feedback messages
const clearMessages = function() {
    const messageElements = document.querySelectorAll('#multiplechoice-form span');
    for (message of messageElements) {
        message.remove();
    }
}

// Clears the radio buttons
const clearRadioButtons = function() {
    const radioButtons = document.querySelectorAll('input[name="question"]');
    for (button of radioButtons) {
        button.checked = false;
    }
}

// Appends a new entry to the statsObject in local storage
const updateStatsInStorage = function(stat) {
    const statsObject = readStatsFromStorage();
    statsObject.push(stat);
    localStorage.setItem('statsObject', JSON.stringify(statsObject));
}

// Reads local storage and returns the statsObject
const readStatsFromStorage = function() {
    const statsObject = localStorage.getItem('statsObject');
    if (statsObject && statsObject.length > 0) {
        return JSON.parse(statsObject);
    } else {
        return [];
    }
}

// Store the temporary list of multiple choice questions
const tempMultipleChoiceQuestions = [
    {
        prompt: "What is the capital of France?",
        choices: ["Berlin", "Madrid", "Paris", "Rome"],
        correctIndex: 2
    },
    {
        prompt: "Who wrote the novel '1984'?",
        choices: ["George Orwell", "Aldous Huxley", "J.K. Rowling", "Ernest Hemingway"],
        correctIndex: 0
    },
    {
        prompt: "Which planet is known as the Red Planet?",
        choices: ["Earth", "Mars", "Jupiter", "Venus"],
        correctIndex: 1
    },
    {
        prompt: "In what year did the Titanic sink?",
        choices: ["1912", "1905", "1923", "1898"],
        correctIndex: 0
    },
    {
        prompt: "What is the chemical symbol for gold?",
        choices: ["Ag", "Au", "Pb", "Fe"],
        correctIndex: 1
    },
    {
        prompt: "Who painted the Mona Lisa?",
        choices: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Claude Monet"],
        correctIndex: 1
    },
    {
        prompt: "Which country is home to the kangaroo?",
        choices: ["Canada", "South Africa", "Australia", "Brazil"],
        correctIndex: 2
    },
    {
        prompt: "What is the largest mammal in the world?",
        choices: ["Elephant", "Blue Whale", "Great White Shark", "Giraffe"],
        correctIndex: 1
    },
    {
        prompt: "How many continents are there on Earth?",
        choices: ["5", "6", "7", "8"],
        correctIndex: 2
    },
    {
        prompt: "What is the longest river in the world?",
        choices: ["Amazon", "Nile", "Yangtze", "Mississippi"],
        correctIndex: 1
    }
];