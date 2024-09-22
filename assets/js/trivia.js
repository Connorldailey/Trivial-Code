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

// Load and initialize sounds
const sounds = {
    background: new Audio('./assets/sounds/background.mp3'),
    countdown: new Audio('./assets/sounds/countdown.wav'),
    go: new Audio('./assets/sounds/go.wav'),
    correct: new Audio('./assets/sounds/correct.wav'),
    incorrect: new Audio('./assets/sounds/incorrect.mp3'),
};
// Loop the background music
sounds.background.loop = true;
// Set the volume of the background music
sounds.background.volume = 0.5;

// Handle username form submission
const usernameFormEl = document.querySelector('#username-form');
const submitUsernameForm = function(event) {
    // Prevent page refresh on submission
    event.preventDefault();
    // Get the value entered in the username input field
    const username = usernameFormEl.username.value;
    // Check if the username is empty or invalid
    if (!username || username === "") {
        // Display an error message if no username is provided
        const errorMessageEl = document.querySelector('#error-message');
        errorMessageEl.textContent = "Please enter a valid username.";
        return; // Exit the function
    }
    // Retrieve the username module and hide it
    const usernameModuleEl = document.querySelector('#username-module');
    usernameModuleEl.setAttribute('style', 'display: none;');
    gameplayObject.username = username;
    // Start the countdown after the username is submitted
    startCountdown();
}
// Add an event listener to the username form
usernameFormEl.addEventListener('submit', submitUsernameForm);

// Start the game countdown
const startCountdown = function() {
    // Center the countdown in the trivia section
    const triviaSection = document.querySelector('#trivia-section');
    triviaSection.style.justifyContent = 'center';
    triviaSection.style.alignItems = 'center';
    // Set the timer to 4 seconds
    let timeLeft = 4;
    // Select the countdown timer element from the DOM
    const countEl = document.querySelector('#countdown-timer');
    // Set up an interval that runs every second
    const timeInterval = setInterval(function() {
        // Count down from 3 to 1
        if (timeLeft > 1) {
            countEl.textContent = timeLeft - 1;
            timeLeft--;
            // Play the countdown haptic
            sounds.countdown.play();
        // Display "Go!" when there is one second left until gameplay
        } else if (timeLeft === 1) {
            countEl.textContent = 'Go!';
            timeLeft--;
            // Play the "Go!" haptic
            sounds.go.play();
        // Clear the countdown display, clear the interval, and display a question
        } else {
            countEl.textContent = '';
            clearInterval(timeInterval);
            // Reset the Flexbox styles back to default
            triviaSection.style.justifyContent = '';
            triviaSection.style.alignItems = '';
            const streak = document.querySelector('#streak');
            streak.textContent = 0;
            sounds.background.play();
            initializeQuestion();
        }
    }, 1000);
}

// Define a global variable for the current question
let currentQuestion = {};
// Define a global variable for the questions seen
let questionsSeen = [];
// Define a global variable for the game timer
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
        questionIndex = Math.floor(Math.random() * multipleChoiceQuestions.length);
        question = multipleChoiceQuestions[questionIndex];
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
    correctMessage.setAttribute('style', 'color: #66FF99;');
    correctMessage.classList.add('ms-3');
    const correctDiv = `#question${currentQuestion.correctIndex + 1}-div`;
    const correctDivEl = document.querySelector(correctDiv);
    correctDivEl.appendChild(correctMessage);
    if (correctAnswer) {
        // Play correct answer haptic
        sounds.correct.play();
        return;
    } else {
        // Play incorrect answer haptic
        sounds.incorrect.play();
    }
    const incorrectMessage = document.createElement('span');
    incorrectMessage.textContent = "Incorrect";
    incorrectMessage.classList.add('text-danger', 'ms-3');
    const radioButtons = document.querySelectorAll('input[name="question"]')
    for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            const incorrectDiv = `#question${i + 1}-div`;
            const incorrectDivEl = document.querySelector(incorrectDiv);
            incorrectDivEl.appendChild(incorrectMessage);
        }
    }
}

// Display a new short answer question
const newShortAnswer = function() {
    // Increment the number of questions
    gameplayObject.numQuestions++;
    // Select a random question
    let questionIndex;
    let question;
    let questionUsed = true;
    while(questionUsed) {
        questionIndex = Math.floor(Math.random() * shortAnswerQuestions.length);
        question = shortAnswerQuestions[questionIndex];
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
    document.querySelector('#shortanswer-input').value = '';
    // Display Short Answer Module
    const shortAnswerModule = document.querySelector('#shortanswer-module');
    shortAnswerModule.setAttribute('style', 'display: flex;');
    // Handle the timer
    let timeLeft = 30;
    const timerEl = document.querySelector('#timer');
    timerEl.setAttribute('style', 'background-color: #66FF99;');
    timer = setInterval(function() {
        if (timeLeft != 0) {
            if (timeLeft <= 10) {
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
// Handle the short answer question submission
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
    const feedbackMessage = document.createElement('span');
    const shortAnswerForm = document.querySelector('#shortanswer-form');
    // Add feedback message for correct/incorrect answers
    if (correctAnswer) {   
        // Play correct answer haptic
        sounds.correct.play(); 
        feedbackMessage.textContent = "Correct";
        feedbackMessage.setAttribute('style', 'color: #66FF99;');
        feedbackMessage.classList.add('ms-3');
        shortAnswerForm.appendChild(feedbackMessage);
    } else {
        // Play incorrect answer haptic
        sounds.incorrect.play();
        feedbackMessage.textContent = "Incorrect";
        feedbackMessage.classList.add('text-danger', 'ms-3');
        shortAnswerForm.appendChild(feedbackMessage);
        // Create and add the correct answer element
        const validAnswerEl = document.createElement('p');
        validAnswerEl.textContent = `The correct answer is: ${currentQuestion.answer}`;
        validAnswerEl.id = 'correct-answer';
        validAnswerEl.classList.add('mt-2', 'text-info');
        const shortAnswerModule = document.querySelector('#shortanswer-module');
        shortAnswerModule.appendChild(validAnswerEl);
    }
}

// Dsiplay the endgame module with game stats
const endGame = function() {
    // Stop the background music
    sounds.background.pause();
    // Hide any visible content
    const promptHeaderEl = document.querySelector('#prompt-header');
    promptHeaderEl.setAttribute('style', 'display: none;');
    const multipleChoiceModule = document.querySelector('#multiplechoice-module');
    multipleChoiceModule.setAttribute('style', 'display: none;');
    const shortAnswerModule = document.querySelector('#shortanswer-module');
    shortAnswerModule.setAttribute('style', 'display: none;');
    // Display the endgame section content
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
// Add an event listener to the replay game button
replayButton.addEventListener('click', function() {
    restartGame(gameplayObject.username);
});

// Handle the exit game button
const exitButton = document.querySelector('#exit-button');
const redirectPage = function() {
    window.location = "index.html";
}
// Add an event listener to the exit game button
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
    const validAnswerEl = document.querySelector('#correct-answer');
    if (validAnswerEl) {
        validAnswerEl.remove();
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

// Reads from local storage and returns the statsObject
const readStatsFromStorage = function() {
    const statsObject = localStorage.getItem('statsObject');
    if (statsObject && statsObject.length > 0) {
        return JSON.parse(statsObject);
    } else {
        return [];
    }
}

// Store the updated list of multiple-choice questions about HTML, CSS, and JavaScript
const multipleChoiceQuestions = [
    {
        prompt: "What does HTML stand for?",
        choices: [
            "HyperText Markup Language",
            "Hyperlinks and Text Markup Language",
            "Home Tool Markup Language",
            "Hyperlinking Text Management Language"
        ],
        correctIndex: 0
    },
    {
        prompt: "Which HTML element is used to define important text?",
        choices: [
            "<strong>",
            "<b>",
            "<i>",
            "<em>"
        ],
        correctIndex: 0
    },
    {
        prompt: "What is the correct CSS syntax to change the background color of an element?",
        choices: [
            "background-color: red;",
            "color: background red;",
            "bgcolor: red;",
            "background = red;"
        ],
        correctIndex: 0
    },
    {
        prompt: "Which property is used to change the font size in CSS?",
        choices: [
            "font-style",
            "font-weight",
            "text-size",
            "font-size"
        ],
        correctIndex: 3
    },
    {
        prompt: "Inside which HTML element do we put the JavaScript code?",
        choices: [
            "<js>",
            "<javascript>",
            "<script>",
            "<code>"
        ],
        correctIndex: 2
    },
    {
        prompt: "Which operator is used to assign a value to a variable in JavaScript?",
        choices: [
            "*",
            "=",
            "-",
            "+"
        ],
        correctIndex: 1
    },
    {
        prompt: "How do you write a comment in CSS?",
        choices: [
            "// This is a comment",
            "/* This is a comment */",
            "# This is a comment",
            "<!-- This is a comment -->"
        ],
        correctIndex: 1
    },
    {
        prompt: "Which method is used to add an element at the end of an array in JavaScript?",
        choices: [
            "push()",
            "pop()",
            "shift()",
            "unshift()"
        ],
        correctIndex: 0
    },
    {
        prompt: "Which CSS property controls the text size?",
        choices: [
            "font-style",
            "text-size",
            "font-size",
            "text-transform"
        ],
        correctIndex: 2
    },
    {
        prompt: "What is the correct way to link an external JavaScript file?",
        choices: [
            "<script href='script.js'></script>",
            "<script name='script.js'></script>",
            "<script src='script.js'></script>",
            "<script file='script.js'></script>"
        ],
        correctIndex: 2
    },
    {
        prompt: "Which CSS property is used to change the text color of an element?",
        choices: ["font-style", "text-decoration", "color", "font-weight"],
        correctIndex: 2
    },
    {
        prompt: "How do you call a function named 'myFunction' in JavaScript?",
        choices: ["call myFunction()", "myFunction()", "func myFunction()", "call function myFunction()"],
        correctIndex: 1
    },
    {
        prompt: "Which of the following is the correct way to write a JavaScript array?",
        choices: [
            "var colors = (1:'red', 2:'green', 3:'blue')",
            "var colors = ['red', 'green', 'blue']",
            "var colors = 'red', 'green', 'blue'",
            "var colors = {'red', 'green', 'blue'}"
        ],
        correctIndex: 1
    },
    {
        prompt: "What does CSS stand for?",
        choices: [
            "Creative Style Sheets",
            "Computer Style Sheets",
            "Cascading Style Sheets",
            "Colorful Style Sheets"
        ],
        correctIndex: 2
    },
    {
        prompt: "Which HTML attribute is used to define inline styles?",
        choices: ["class", "font", "styles", "style"],
        correctIndex: 3
    },
    {
        prompt: "Which JavaScript event occurs when the user clicks on an HTML element?",
        choices: ["onmouseclick", "onchange", "onclick", "onmouseover"],
        correctIndex: 2
    },
    {
        prompt: "In CSS, how do you select an element with the id 'demo'?",
        choices: ["#demo", ".demo", "*demo", "demo"],
        correctIndex: 0
    },
    {
        prompt: "Which property is used to change the left margin of an element in CSS?",
        choices: ["padding-left", "margin-left", "indent", "left-margin"],
        correctIndex: 1
    },
    {
        prompt: "How do you add a comment in JavaScript?",
        choices: [
            "<!-- This is a comment -->",
            "// This is a comment",
            "' This is a comment",
            "** This is a comment **"
        ],
        correctIndex: 1
    },
    {
        prompt: "Which HTML element is used for specifying a header for a document or section?",
        choices: ["<head>", "<header>", "<h1>", "<section>"],
        correctIndex: 1
    },
    {
        prompt: "In CSS, which of the following values cannot be used with the 'position' property?",
        choices: ["static", "relative", "fixed", "middle"],
        correctIndex: 3
    },
    {
        prompt: "What is the correct JavaScript syntax to write 'Hello World' in an alert box?",
        choices: [
            "alert('Hello World');",
            "msg('Hello World');",
            "alertBox('Hello World');",
            "msgBox('Hello World');"
        ],
        correctIndex: 0
    },
    {
        prompt: "Which CSS property is used to change the font of an element?",
        choices: ["font-family", "font-style", "font-weight", "font-size"],
        correctIndex: 0
    },
    {
        prompt: "How do you create a function in JavaScript?",
        choices: [
            "function:myFunction()",
            "function myFunction()",
            "function = myFunction()",
            "create function myFunction()"
        ],
        correctIndex: 1
    },
    {
        prompt: "Which HTML attribute specifies an alternate text for an image, if the image cannot be displayed?",
        choices: ["alt", "src", "title", "longdesc"],
        correctIndex: 0
    },
    {
        prompt: "In JavaScript, how do you declare a variable?",
        choices: [
            "var myVariable;",
            "variable myVariable;",
            "v myVariable;",
            "declare myVariable;"
        ],
        correctIndex: 0
    },
    {
        prompt: "Which CSS property is used to control the spacing between lines of text?",
        choices: ["line-height", "letter-spacing", "text-spacing", "spacing"],
        correctIndex: 0
    },
    {
        prompt: "How do you add a background color for all `<h1>` elements in CSS?",
        choices: [
            "h1 {background-color: blue;}",
            "h1.all {background-color: blue;}",
            "all.h1 {background-color: blue;}",
            "h1:all {background-color: blue;}"
        ],
        correctIndex: 0
    },
    {
        prompt: "What does DOM stand for in web development?",
        choices: [
            "Document Object Model",
            "Data Object Model",
            "Document Oriented Model",
            "Display Object Management"
        ],
        correctIndex: 0
    },
    {
        prompt: "Which JavaScript keyword is used to define a block of code that will execute regardless of the try and catch result?",
        choices: ["catch", "finally", "error", "default"],
        correctIndex: 1
    }
];

const shortAnswerQuestions = [
    {
        prompt: "What does HTML stand for? (Answer with three words)",
        answer: "HyperText Markup Language"
    },
    {
        prompt: "Which HTML tag is used to create a hyperlink?",
        answer: "<a>"
    },
    {
        prompt: "What attribute specifies the URL in an anchor tag?",
        answer: "href"
    },
    {
        prompt: "How do you insert a comment in HTML? (Start and end tags)",
        answer: "<!-- -->"
    },
    {
        prompt: "What does CSS stand for? (Answer with three words)",
        answer: "Cascading Style Sheets"
    },
    {
        prompt: "Which CSS property changes the text color?",
        answer: "color"
    },
    {
        prompt: "How do you select an element with id 'main' in CSS? (Use the correct selector)",
        answer: "#main"
    },
    {
        prompt: "How do you select elements with class 'container' in CSS? (Use the correct selector)",
        answer: ".container"
    },
    {
        prompt: "Which CSS property is used to change the background color?",
        answer: "background-color"
    },
    {
        prompt: "What is the correct HTML tag for inserting a line break?",
        answer: "<br>"
    },
    {
        prompt: "Name one keyword used to declare a variable whose value can change in JavaScript.",
        answer: "let"
    },
    {
        prompt: "Which operator assigns a value to a variable in JavaScript? (Single character)",
        answer: "="
    },
    {
        prompt: "How do you display 'Hello World' in an alert box in JavaScript? (Use alert function syntax)",
        answer: "alert('Hello World');"
    },
    {
        prompt: "Which HTML tag defines an unordered list?",
        answer: "<ul>"
    },
    {
        prompt: "Which HTML tag defines a table header cell?",
        answer: "<th>"
    },
    {
        prompt: "Which CSS property controls the size of text?",
        answer: "font-size"
    },
    {
        prompt: "How do you create a function named 'myFunction' in JavaScript? (Use function declaration syntax)",
        answer: "function myFunction() {}"
    },
    {
        prompt: "Which attribute provides alternate text for an image in HTML?",
        answer: "alt"
    },
    {
        prompt: "Which JavaScript array method removes the last element? (Method name with parentheses)",
        answer: "pop()"
    },
    {
        prompt: "How do you add a comment in CSS? (Start and end symbols)",
        answer: "/* */"
    },
    {
        prompt: "Which keyword declares a constant variable in JavaScript? (One word)",
        answer: "const"
    },
    {
        prompt: "Which HTML attribute makes an input field mandatory? (One word)",
        answer: "required"
    },
    {
        prompt: "Which JavaScript method converts an array to a string? (Method name with parentheses)",
        answer: "join()"
    },
    {
        prompt: "What is the correct HTML tag to create a numbered list? (Use angle brackets)",
        answer: "<ol>"
    },
    {
        prompt: "Which CSS property is used to make text bold? (Two words, hyphenated)",
        answer: "font-weight"
    },
    {
        prompt: "How do you write 'Hello World' to the console in JavaScript?",
        answer: "console.log('Hello World');"
    },
    {
        prompt: "Which HTML attribute specifies the language of the document?",
        answer: "lang"
    },
    {
        prompt: "Which CSS property adds space inside an element's border? (One word)",
        answer: "padding"
    },
    {
        prompt: "How do you reference an external CSS file named 'styles.css' in HTML? (Use full link tag with href attribute)",
        answer: "<link rel='stylesheet' href='styles.css'>"
    },
    {
        prompt: "Which JavaScript keyword is used to skip to the next iteration of a loop?",
        answer: "continue"
    }
];
