// Testing URL
// const trackBaseUrl = 'https://lab-95a11ac6-8103-422e-af7e-4a8532f40144.australiaeast.cloudapp.azure.com:7090';

// Load and display tracks
const loadTracks = async () => {
    const trackBaseUrl = document.getElementById('track-base-url').value;
    
    if (!trackBaseUrl) {
        alert('Please enter the Base URL.');
        return;
    }

    try {
        const response = await fetch(`${trackBaseUrl}/track`);
        const data = await response.json();

        if (response.ok) {
            const tracksTable = document.querySelector('#tracksTable tbody');
            tracksTable.innerHTML = ''; // Clear previous entries

            data.result.forEach(track => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${track.id}</td>
                    <td>${track.name}</td>
                    <td>${track.type}</td>
                    <td>${track.laps}</td>
                    <td>${track.baseLapTime}</td>
                `;
                tracksTable.appendChild(row);
            });
            showNotification(200, 'Tracks loaded successfully');
        } else {
            showNotification(data.code || response.status, data.result || 'Failed to load tracks');
        }
    } catch (error) {
        console.error('Error loading tracks:', error);
        // showNotification('Error', error.message || 'An unknown error occurred');
    }
};

const createTrack = async () => {
    const trackBaseUrl = document.getElementById('track-base-url').value;
    const trackName = document.getElementById('trackName').value;
    const trackType = document.getElementById('trackType').value;
    const totalLaps = document.getElementById('totalLaps').value;
    const baseLapTime = document.getElementById('baseLapTime').value;
    const apiKey = document.getElementById('api-key').value;

    if (!trackBaseUrl|| !apiKey || !trackName || !trackType || totalLaps === '' || baseLapTime === '') {
        alert('Please enter all required fields.');
        return;
    }

    const newTrack = {
        name: trackName,
        type: trackType,
        laps: parseInt(totalLaps, 10),
        baseLapTime: parseFloat(baseLapTime)
    };

    try {
        const response = await fetch(`${trackBaseUrl}/track`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': apiKey
            },
            body: JSON.stringify(newTrack)
        });

        const data = await response.json();
        if (response.ok) {
            showNotification(data.code || response.status, data.result || 'Track created successfully');
            loadTracks(); 
        } else {
            showNotification(data.code || response.status, data.result || 'Failed to create track');
            throw new Error('Failed to create track');
        }
    } catch (error) {
        console.error('Error creating track:', error);
    }
};

// Delete a track by ID
const deleteTrack = async () => {
    const trackBaseUrl = document.getElementById('track-base-url').value;
    const apiKey = document.getElementById('api-key').value;
    const trackID = document.getElementById('deleteTrackID').value;

    if (!trackID || !trackBaseUrl || !apiKey) {
        alert('Please enter the API key, Track ID and BaseURL.');
        return;
    }

    try {
        const response = await fetch(`${trackBaseUrl}/track/${trackID}`, {
            method: 'DELETE',
            headers: {
                'X-API-KEY': apiKey
            }
        });

        const data = await response.json();
        if (response.ok) {
            showNotification(data.code || response.status, data.result || 'Track deleted successfully');
            loadTracks(); 
        } else {
            showNotification(data.code || response.status, data.result || 'Failed to delete track');
            throw new Error('Failed to delete track');
        }
    } catch (error) {
        console.error('Error deleting track:', error);
    }
};