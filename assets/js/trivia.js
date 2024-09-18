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
    console.log('hello World')
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
    console.log(gameplayObject)
}
usernameFormEl.addEventListener('submit', submitUsernameForm);
