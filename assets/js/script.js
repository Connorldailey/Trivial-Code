// Add an event listener to the gameplay-section
const startGameButton = document.getElementById("gameplay-section");
startGameButton.addEventListener("click", function() {
    window.location.href = "./trivia.html";
});

// Renders the stats table section on the page (requires sorted statsObject)
const renderStatsTable = function(statsObject) {
    // Reference the stats-table div
    const statsTableEl = document.querySelector('#stats-table');
    // Check if there are any stats in local storage
    if (!statsObject) {
        const emptyTableMessage = document.createElement('p');
        emptyTableMessage.textContent = "Nothing to display yet. Play to place.";
        statsTableEl.appendChild(emptyTableMessage);
        return;
    } 
    // Create the table header
    const tableHeaderEl = document.createElement('tr');
    const positionHeaderEl = document.createElement('th');
    positionHeaderEl.textContent = "Position";
    tableHeaderEl.appendChild(positionHeaderEl);
    const usernameHeaaderEl = document.createElement('th');
    usernameHeaaderEl.textContent = "Username";
    tableHeaderEl.appendChild(usernameHeaaderEl);
    const scoreHeaderEl = document.createElement('th');
    scoreHeaderEl.textContent = "Score";
    tableHeaderEl.appendChild(scoreHeaderEl);
    const timeHeaderEl = document.createElement('th');
    timeHeaderEl.textContent = "Average Time";
    tableHeaderEl.appendChild(timeHeaderEl);
    const dateHeaderEl = document.createElement('th');
    dateHeaderEl.textContent = "Date";
    tableHeaderEl.appendChild(dateHeaderEl);
    // Append the table header to the stats table
    statsTableEl.appendChild(tableHeaderEl);


    for (let i = 0; i < 10; i++) {
        // Construct the table row
        const tableRowEl = document.createElement('tr');
        const positionEl = document.createElement('td');
        positionEl.textContent = i + 1;
        tableRowEl.appendChild(positionEl);
        const usernameEl = document.createElement('td');
        usernameEl.textContent = statsObject[i].username;
        tableRowEl.appendChild(usernameEl);
        const scoreEl = document.createElement('td');
        scoreEl.textContent = statsObject[i].score;
        tableRowEl.appendChild(scoreEl);
        const timeEl = document.createElement('td');
        timeEl.textContent = statsObject[i].avgTime;
        tableRowEl.appendChild(timeEl);
        const dateEl = document.createElement('td');
        dateEl.textContent = statsObject[i].date;
        tableRowEl.appendChild(dateEl);
        // Append the row to the table
        statsTableEl.appendChild(tableRowEl);
    }
}
