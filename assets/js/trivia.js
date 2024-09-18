/* 
    ----------------------------------------------------------------
    FOR TRIVIA.HTML
    ----------------------------------------------------------------
*/
let gameplayObject = {
    username: '',
    score: 0,
    numQuestions: 0,
    totalTime: 0,
    date: new Date().toJSON().slice(0,10)
}
 
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
            initializeGame();
        }
    }, 1000);
}