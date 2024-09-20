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
    date: new Date().toJSON().slice(0,10),
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
let questionsSeen = [];
let timer;

// Chose a question type and call the respective operations
const initializeQuestion = function() {
    // Ensure none of the radio buttons are checked
    clearRadioButtons();
    // Clears all messages
    clearMultipleChoiceMessages();
    clearShortAnswerMessages();
    // Randomly select either a multiple choice (0) or short answer (1) question
    const questionType = Math.floor(Math.random() * 2);
    if (questionType === 0) {
        // Display multiple choice question
        newMultipleChoice();
    } else {
        // Display short answer question
        newShortAnswer();
    }
}

// Display a new multiple choice question
const newMultipleChoice = function() {
    // Increment the number of questions
    gameplayObject.numQuestions++;
    // Select a random question
    let questionIndex;
    let question;
    let questionUsed = true;
    while(questionUsed) {
        questionIndex = Math.floor(Math.random() * tempMultipleChoiceQuestions.length);
        question = tempMultipleChoiceQuestions[questionIndex];
        if (!questionsSeen.includes(question)) {
            questionUsed = false;
            questionsSeen.push(question);
        }
    }
    currentQuestion = question;
    // Display the prompt header
    const promptHeaderModule = document.querySelector('#prompt-header');
    promptHeaderModule.setAttribute('style', 'display: flex;');
    const promptEl = document.querySelector('#prompt');
    promptEl.textContent = currentQuestion.prompt;
    // Hide Short Answer Module if displayed
    const shortAnswerModule = document.querySelector('#shortanswer-module');
    shortAnswerModule.setAttribute('style', 'display: none;');

    // Fill the form with the choices
    const multipleChoiceModule = document.querySelector('#multiplechoice-module');
    multipleChoiceModule.setAttribute('style', 'display: flex;');
    const choice1Label = document.querySelector('#choice1-label');
    choice1Label.textContent = currentQuestion.choices[0];
    const choice2Label = document.querySelector('#choice2-label');
    choice2Label.textContent = currentQuestion.choices[1];
    const choice3Label = document.querySelector('#choice3-label');
    choice3Label.textContent = currentQuestion.choices[2];
    const choice4Label = document.querySelector('#choice4-label');
    choice4Label.textContent = currentQuestion.choices[3];
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
    const correctRadio = `#choice${currentQuestion.correctIndex + 1}-input`;
    const timerEl = document.querySelector('#timer');
    let correctAnswer = false;
    console.log(document.querySelector(correctRadio).checked);
    if (document.querySelector(correctRadio).checked) {
        gameplayObject.score++;
        clearInterval(timer);
        correctAnswer = true;
        displayMultipleChoiceResults(correctAnswer);
        const streak = document.querySelector('#streak');
        streak.textContent = gameplayObject.score;
        setTimeout(() => {
            timerEl.innerHTML = "";
            initializeQuestion();
        }, 3000);
    } else {
        clearInterval(timer);
        displayMultipleChoiceResults(correctAnswer);
        setTimeout(() => {
            timerEl.innerHTML = "";
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

// Display a new Short Answer question
const newShortAnswer = function() {
    // Increment the number of questions
    gameplayObject.numQuestions++;
    // Select a random question
    let questionIndex;
    let question;
    let questionUsed = true;
    while(questionUsed) {
        questionIndex = Math.floor(Math.random() * tempShortAnswerQuestions.length);
        question = tempShortAnswerQuestions[questionIndex];
        if (!questionsSeen.includes(question)) {
            questionUsed = false;
            questionsSeen.push(question);
        }
    }
    currentQuestion = question;
    // Display the prompt header
    const promptHeaderModule = document.querySelector('#prompt-header');
    promptHeaderModule.setAttribute('style', 'display: flex;');
    const promptEl = document.querySelector('#prompt');
    promptEl.textContent = currentQuestion.prompt;
    // Hide Multiple Choice Module if displayed
    const multipleChoiceModule = document.querySelector('#multiplechoice-module');
    multipleChoiceModule.setAttribute('style', 'display: none;');
    // Remove Textbox Content
    const textBox = document.querySelector('#shortanswer-input');
    textBox.textContent = '';
    // Display Short Answer Module
    const shortAnswerModule = document.querySelector('#shortanswer-module');
    shortAnswerModule.setAttribute('style', 'display: flex;');
    // Handle the timer
    let timeLeft = 20;
    const timerEl = document.querySelector('#timer');
    timerEl.setAttribute('style', 'background-color: #66FF99;');
    timer = setInterval(function() {
        if (timeLeft != 0) {
            if (timeLeft <= 5) {
                timerEl.setAttribute('style', 'background-color: #ffcbca;');
            }
            timerEl.textContent = timeLeft;
            timeLeft--;
            gameplayObject.totalTime++;
        } else {
            timerEl.textContent = '';
            clearInterval(timer);
            displayShortAnswerResults(false);
            setTimeout(() => {
                endGame();
            }, 3000)
        }
    }, 1000);
}
// Handle the Short Answer question submission
const shortAnswerFormEl = document.querySelector('#shortanswer-form');
const submitShortAnswerForm = function(event) {
    event.preventDefault();
    const timerEl = document.querySelector('#timer');
    let correctAnswer = false;
    const userAnswer = document.querySelector('#shortanswer-input').value;
    const formattedUserAnswer = userAnswer.toUpperCase().trim();
    const correctShortAnswer = currentQuestion.answer.toUpperCase();
    if (formattedUserAnswer === correctShortAnswer) {
        gameplayObject.score++;
        clearInterval(timer);
        correctAnswer = true;
        displayShortAnswerResults(correctAnswer);
        const streak = document.querySelector('#streak');
        streak.textContent = gameplayObject.score;
        setTimeout(() => {
            timerEl.innerHTML = "";
            initializeQuestion();
        }, 3000);
    } else {
        clearInterval(timer);
        displayShortAnswerResults(correctAnswer);
        setTimeout(() => {
            timerEl.innerHTML = "";
            endGame();
        }, 3000);
    }
}
shortAnswerFormEl.addEventListener('submit', submitShortAnswerForm);

// Display feedback on short answer questions
const displayShortAnswerResults = function(correctAnswer) {
    const correctMessage = document.createElement('span');
    const textDiv = document.querySelector('#shortanswer-div');
    if (correctAnswer) {    
        correctMessage.textContent = "Correct";
        correctMessage.setAttribute('style', 'color: #66FF99; margin-left: 1rem;');
        textDiv.appendChild(correctMessage)
    } else {
        correctMessage.textContent = "Incorrect";
        correctMessage.setAttribute('style', 'color: #ffcbca;  margin-left: 1rem;');
        textDiv.appendChild(correctMessage);
        const validAnswerEl = document.createElement('p');
        validAnswerEl.textContent = currentQuestion.answer; 
        textDiv.appendChild(validAnswerEl);
    }
}

// Dsiplay the endgame module with game stats
const endGame = function() {
    // Hide any visible content
    const promptHeaderEl = document.querySelector('#prompt-header');
    promptHeaderEl.setAttribute('style', 'display: none;');
    const multipleChoiceModule = document.querySelector('#multiplechoice-module');
    multipleChoiceModule.setAttribute('style', 'display: none;');
    const shortAnswerModule = document.querySelector('#shortanswer-module');
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

// Clears the feedback messages for multiple choice questions
const clearMultipleChoiceMessages = function() {
    const messageElements = document.querySelectorAll('#multiplechoice-form span');
    for (message of messageElements) {
        message.remove();
    }
}
// Clears the feedback messages for short answer questions
const clearShortAnswerMessages = function() {
    const messageElements = document.querySelectorAll('#shortanswer-form span');
    for (message of messageElements) {
        message.remove();
    }
    const validAnswerEl = document.querySelectorAll('#shortanswer-form p');
    for (answer of validAnswerEl) {
        answer.remove();
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
        choices: ["8", "6", "7", "4"],
        correctIndex: 2
    },
    {
        prompt: "What is the longest river in the world?",
        choices: ["Amazon", "Nile", "Yangtze", "Mississippi"],
        correctIndex: 1
    }
];

const tempShortAnswerQuestions = [
    {
        prompt: "Which CSS property is used to define a flex container?",
        answer: "display: flex;"
    },
    {
        prompt: "Which CSS property defines the direction of flex items?",
        answer: "flex-direction"
    },
    {
        prompt: "How do you change the alignment of items along the main axis?",
        answer: "justify-content"
    },
    {
        prompt: "Which CSS property aligns items along the cross axis?",
        answer: "align-items"
    },
    {
        prompt: "How do you make a flex item grow to fill the available space?",
        answer: "flex-grow"
    },
    {
        prompt: "Which value of 'justify-content' spaces items evenly with equal space around them?",
        answer: "space-around"
    },
    {
        prompt: "How do you make flex items wrap onto multiple lines?",
        answer: "flex-wrap: wrap;"
    }
];