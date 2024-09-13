// Add an event listener to the gameplay-section
const startGameButton = document.getElementById("gameplay-section");
startGameButton.addEventListener("click", function() {
    window.location.href = "./trivia.html";
});

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

// Renders the stats table section on the landing page
const renderStatsTable = function(statsObject) {
    // Reference the stats-table div
    const statsTableEl = document.querySelector('#stats-table');
    // Clear the content of the stats-table
    statsTableEl.innerHTML = "";
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

    // Sort the statsObject from highest to lowest score
    statsObject.sort((a, b) => b.score - a.score);

    // Append the top ten records to the table body
    for (let i = 0; i < 10; i++) {
        // Construct each table row
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
    // Add a border to the stats table element
    statsTableEl.setAttribute('style', 'border: 1px solid black;');
}

// Testing
const fakeStats = [
    { username: 'Player1', score: 1200, avgTime: '2m 15s', date: '2024-09-01' },
    { username: 'Player2', score: 1150, avgTime: '2m 20s', date: '2024-09-02' },
    { username: 'Player3', score: 1300, avgTime: '2m 10s', date: '2024-09-03' },
    { username: 'Player4', score: 1100, avgTime: '2m 30s', date: '2024-09-04' },
    { username: 'Player5', score: 1250, avgTime: '2m 12s', date: '2024-09-05' },
    { username: 'Player6', score: 1050, avgTime: '2m 35s', date: '2024-09-06' },
    { username: 'Player7', score: 1350, avgTime: '2m 05s', date: '2024-09-07' },
    { username: 'Player8', score: 950, avgTime: '2m 50s', date: '2024-09-08' },
    { username: 'Player9', score: 1250, avgTime: '2m 18s', date: '2024-09-09' },
    { username: 'Player10', score: 1400, avgTime: '2m 00s', date: '2024-09-10' },
    { username: 'Player11', score: 1000, avgTime: '2m 40s', date: '2024-09-11' },
    { username: 'Player12', score: 1450, avgTime: '1m 55s', date: '2024-09-12' },
    { username: 'Player13', score: 900, avgTime: '2m 55s', date: '2024-09-13' },
    { username: 'Player14', score: 1500, avgTime: '1m 50s', date: '2024-09-14' },
    { username: 'Player15', score: 850, avgTime: '3m 00s', date: '2024-09-15' }
];

renderStatsTable(fakeStats);