// Function to manage tab content loading
const loadTabContent = (tabName) => {
    const content = document.getElementById('content');
    content.innerHTML = ''; // Clear previous content

    switch (tabName) {
        case 'drivers':
            loadDriversContent();
            break;
        case 'cars':
            loadCarsContent();
            break;
        case 'tracks':
            loadTracksContent();
            break;
        case 'races':
            loadRacesContent();
            break;
        case 'trackScraper':
            loadTrackScraperContent();
            break;
        default:
            content.innerHTML = '<h2>Welcome! Select a tab to view or manage data.</h2>';
    }
};

const showNotification = (code, result) => {
    const notification = document.getElementById('notification');

    notification.classList.remove('hidden', 'success', 'error');
    
    if (code == "200") {
        notification.innerText = `Code: ${code}, Result: Action complete successfully`;
        notification.classList.add('show', 'success');
    } else {
        notification.innerText = `Code: ${code}, Result: ${result}`;
        notification.classList.add('show', 'error');
    }

    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hidden');
    }, 3000);
};

// Function to load Drivers tab structure
const loadDriversContent = () => {
    const content = document.getElementById('content');
    content.innerHTML = `
        <h2>Driver Management</h2>

        <div id="notification" class="notification hidden"></div>

        <label for="base-url">Team REST Service Base URL:</label>
        <input type="text" id="base-url" placeholder="Enter Base URL" />
        <button id="load-drivers-btn" onclick="loadDrivers()">Load Drivers</button>
        <br>

        <h2>Drivers List</h2>
        <table id="driversTable">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Number</th>
                    <th>Short Name</th>
                    <th>Street Skill</th>
                    <th>Race Skill</th>
                </tr>
            </thead>
            <tbody>
                <!-- Driver rows will be dynamically added here -->
            </tbody>
        </table>
        
        <h3>Create New Driver</h3>
        <label for="api-key">API Key:</label>
        <input type="text" id="api-key" placeholder="Enter X-API-KEY" />
        <br>
        <input type="text" id="driverName" placeholder="Driver Name" />
        <input type="text" id="driverNumber" placeholder="Driver Number" />
        <input type="text" id="driverShortName" placeholder="Driver Short Name" />
        <input type="number" id="driverSkillRace" placeholder="Race Skill (0-100)" min="0" max="100" />
        <input type="number" id="driverSkillStreet" placeholder="Street Skill (0-100)" min="0" max="100" />
        <br>
        <button onclick="createDriver()">Create Driver</button>

        <h3>Delete Driver</h3>
        <label for="api-key">API Key:</label>
        <input type="text" id="api-key-delete" placeholder="Enter X-API-KEY" />
        <input type="text" id="driverNumberDelete" placeholder="Driver number" />
        <br>
        <button onclick="deleteDriver()">Delete Driver</button>
    `;
};

// Function to load Cars tab structure
const loadCarsContent = () => {
    const content = document.getElementById('content');

    content.innerHTML = `
        <h2>Car Management</h2>

        <div id="notification" class="notification hidden"></div>

        <label for="base-url">Team REST Service Base URL:</label>
        <input type="text" id="car-base-url" placeholder="Enter Base URL" />
        <button id="load-cars-btn" onclick="loadCars()">Load Cars</button>

        <h2>Cars List</h2>
        <table id="carsTable">
            <thead>
                <tr>
                    <th>Car id</th>
                    <th>Race Suitability</th>
                    <th>Street Suitability</th>
                    <th>Reliability</th>
                    <th>Driver Name</th>
                </tr>
            </thead>
            <tbody>
                <!-- Car rows will be dynamically added here -->
            </tbody>
        </table>

        <br>
        <br>

        <label for="api-key">API Key:</label>
        <input type="text" id="api-key" placeholder="Enter X-API-KEY" />
        <br>
        <h3>Associate/Unassociate Driver</h3>
        <input type="text" id="associateCarID" placeholder="Car ID" />
        <input type="text" id="associateDriverNumber" placeholder="Driver Number" />
        <button onclick="associateDriver()">Associate Driver</button>
        <button onclick="unassociateDriver()">Unassociate Driver</button>

        <h3>Create New Car</h3>
        <input type="number" id="carReliability" placeholder="Reliability (0-100)" min="0" max="100" />
        <input type="text" id="suitabilityRace" placeholder="Suitability Race" />
        <input type="text" id="suitabilityStreet" placeholder="Suitability Street" />
        <button onclick="createCar()">Create Car</button>

        <h3>Delete Car</h3>
        <input type="text" id="deleteCarNumber" placeholder="Car Number to Delete" />
        <button onclick="deleteCar()">Delete Car</button>
    `;
};

const loadTracksContent = () => {
    const content = document.getElementById('content');
    content.innerHTML = `
        <h2>Track Management</h2>

        <div id="notification" class="notification hidden"></div>

        <label for="track-base-url">Team REST Service Base URL:</label>
        <input type="text" id="track-base-url" placeholder="Enter Base URL" />

        <br>
        <button id="load-tracks-btn" onclick="loadTracks()">Load Tracks</button>

        <h2>Tracks List</h2>
        <table id="tracksTable">
            <thead>
                <tr>
                    <th>Track ID</th>
                    <th>Track Name</th>
                    <th>Track Type</th>
                    <th>Total Laps</th>
                    <th>BaseLapTime</th>
                </tr>
            </thead>
            <tbody>
                <!-- Track rows will be dynamically added here -->
            </tbody>
        </table>

        <br>
        <br>
        <label for="api-key">API Key:</label>
        <input type="text" id="api-key" placeholder="Enter X-API-KEY" />
        <br>

        <h3>Create New Track</h3>
        <input type="text" id="trackName" placeholder="Track Name" />
        <input type="text" id="trackType" placeholder="Track Type" />
        <input type="number" id="totalLaps" placeholder="Total Laps" min="1" />
        <input type="number" id="baseLapTime" placeholder="Base Lap Time (seconds)" min="1" />
        <button onclick="createTrack()">Create Track</button>

        <h3>Delete Track</h3>
        <input type="text" id="deleteTrackID" placeholder="Track ID to Delete" />
        <button onclick="deleteTrack()">Delete Track</button>
    `;
};

const loadRacesContent = () => {
    const content = document.getElementById('content');
    content.innerHTML = `
        <h2>Races Management</h2>

        <div id="notification" class="notification hidden"></div>

        <label for="race-base-url">Race REST Service Base URL:</label>
        <input type="text" id="race-base-url" placeholder="Enter Base URL" />

        <br>

        <label for="api-key">API Key:</label>
        <input type="text" id="api-key" placeholder="Enter X-API-KEY" />

        <br>
        <button id="load-races-btn" onclick="loadRaces()">Load Races</button>

        <h2>Races List</h2>
        <table id="racesTable">
            <thead>
                <tr>
                    <th>Race ID</th>
                    <th>Track Name</th>
                    <th>View Details</th>
                </tr>
            </thead>
            <tbody>
                <!-- Race rows will be dynamically added here -->
            </tbody>
        </table>

        <br>
        
    `;
};