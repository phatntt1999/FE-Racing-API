
// Load and display races
const loadRaces = async () => {
    const raceBaseUrl = document.getElementById('race-base-url').value;

    if (!raceBaseUrl) {
        alert('Please enter the API key and Base URL.');
        return;
    }

    try {
        const response = await fetch(`${raceBaseUrl}/race`, {
            method: 'GET',
        });

        if (!response.ok) throw new Error('Failed to fetch races');

        const data = await response.json();
        const races = data.result;

        const tableBody = document.querySelector('#racesTable tbody');
        tableBody.innerHTML = '';

        races.forEach(race => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${race.id}</td>
                <td>${race.track.name}</td>
                <td><button onclick="viewRaceDetails(${race.id})">View Details</button></td>
            `;
            tableBody.appendChild(row);
        });

        showNotification(data.code, 'Races loaded successfully');
    } catch (error) {
        console.error('Error loading races:', error);
    }
};

// View details of a specific race, including leaderboard and lap times
const viewRaceDetails = async (raceID) => {
    const raceBaseUrl = document.getElementById('race-base-url').value;
    const apiKey = document.getElementById('api-key').value;

    if (!raceBaseUrl || !apiKey) {
        alert('Please enter the API key and Base URL.');
        return;
    }

    try {
        const response = await fetch(`${raceBaseUrl}/race/${raceID}`, {
            method: 'GET',
            headers: {
                'X-API-KEY': apiKey
            }
        });

        if (!response.ok) throw new Error('Failed to fetch race details');

        const data = await response.json();
        const race = data.result;

        // Generate leaderboard table
        const leaderboard = race.laps
            .flatMap(lap => lap.lapTimes)
            .reduce((acc, lapTime) => {
                if (!acc[lapTime.entrant]) {
                    acc[lapTime.entrant] = { entrant: lapTime.entrant, laps: 0, totalTime: 0 };
                }
                acc[lapTime.entrant].laps += 1;
                acc[lapTime.entrant].totalTime += parseFloat(lapTime.time);
                return acc;
            }, {});

        const leaderboardArray = Object.values(leaderboard).sort((a, b) => a.totalTime - b.totalTime);

        // Display leaderboard
        let leaderboardHTML = '<div id="notification" class="notification hidden"></div><h3>Leaderboard</h3><table><thead><tr><th>Position</th><th>Entrant</th><th>Total Time</th><th>Laps</th></tr></thead><tbody>';
        leaderboardArray.forEach((entrant, index) => {
            leaderboardHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${entrant.entrant}</td>
                    <td>${entrant.totalTime.toFixed(3)}s</td>
                    <td>${entrant.laps}</td>
                </tr>
            `;
        });
        leaderboardHTML += '</tbody></table>';

        // Generate lap times table
        let lapTimesHTML = '<h3>Lap Times</h3><table><thead><tr><th>Lap Number</th><th>Entrant</th><th>Time</th><th>Crashed</th></tr></thead><tbody>';
        race.laps.forEach(lap => {
            lap.lapTimes.forEach(lapTime => {
                lapTimesHTML += `
                    <tr>
                        <td>${lap.number}</td>
                        <td>${lapTime.entrant}</td>
                        <td>${lapTime.time}s</td>
                        <td>${lapTime.crashed ? 'Yes' : 'No'}</td>
                    </tr>
                `;
            });
        });
        lapTimesHTML += '</tbody></table>';

        // Display leaderboard and lap times in the content area
        const content = document.getElementById('content');
        content.innerHTML = `
            <h2>Race Details for Race ID: ${raceID}</h2>
            ${leaderboardHTML}
            ${lapTimesHTML}
            <button onclick="loadRacesContent()">Back to Races List</button>
        `;

        showNotification(data.code, 'Race details loaded successfully');
    } catch (error) {
        console.error('Error loading race details:', error);
    }
};