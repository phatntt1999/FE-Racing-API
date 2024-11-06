// Testing URL
// const baseUrl = "https://lab-d00a6b41-7f81-4587-a3ab-fa25e5f6d9cf.australiaeast.cloudapp.azure.com:7101";

// Function to fetch and display drivers in the table
const loadDrivers = async () => {
    const baseDriverUrl = document.getElementById('base-url').value;
    if (!baseDriverUrl) {
        alert('Please enter the Base URL.');
        return;
    }

    try {
        const response = await fetch(`${baseDriverUrl}/driver`);
        if (!response.ok) throw new Error('Failed to fetch drivers');

        const data = await response.json();
        const drivers = data.result;

        const tableBody = document.querySelector('#driversTable tbody');
        tableBody.innerHTML = '';
        
        drivers.forEach(driver => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${driver.name}</td>
            <td>${driver.number}</td>
            <td>${driver.shortName}</td>
            <td>${driver.skill.street}</td>
            <td>${driver.skill.race}</td>
            `;
            tableBody.appendChild(row);
        });
        
        showNotification(data.code, data.result);
    } catch (error) {
        console.error('Error loading drivers:', error);
        alert('Failed to fetch drivers');
    }
};

// Function to create a new driver
const createDriver = async () => {
    const baseDriverUrl = document.getElementById('base-url').value;
    const driverName = document.getElementById('driverName').value;
    const driverNumber = document.getElementById('driverNumber').value;
    const driverShortName = document.getElementById('driverShortName').value;
    const driverSkillRace = document.getElementById('driverSkillRace').value;
    const driverSkillStreet = document.getElementById('driverSkillStreet').value;
    const apiKey = document.getElementById('api-key').value;

    // Debugging
    // const baseDriverUrl = ""
    // const driverName = "abc";
    // const driverNumber = "13";
    // const driverShortName = "abc";
    // const driverSkillRace = "14";
    // const driverSkillStreet = "14";
    // const apiKey = "321";

    // Validate required fields
    if (!baseDriverUrl || !driverName || !driverNumber || !driverShortName || !apiKey || driverSkillRace === '' || driverSkillStreet === '') {
        alert('Please enter all fields.');
        return;
    }

    // Construct the driver object
    const newDriver = {
        name: driverName,
        number: parseInt(driverNumber, 10),
        shortName: driverShortName,
        skill: {
            race: parseInt(driverSkillRace, 10),
            street: parseInt(driverSkillStreet, 10)
        }
    };

    try {
        const response = await fetch(`${baseDriverUrl}/driver`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': apiKey
            },
            body: JSON.stringify(newDriver)
        });

        data = await response.json();

        if (response.ok) {
            showNotification(data.code, data.result);

            loadDrivers();
        } else {
            showNotification(data.code || response.status, data.result || 'Failed to create driver');

            throw new Error('Failed to create driver')
        }
    } catch (error) {
        console.error('Error creating driver:', error);
    }
};

// Function to delete a driver by ID
const deleteDriver = async () => {
    const baseDriverUrl = document.getElementById('base-url').value;
    const driverNumber = document.getElementById('driverNumberDelete').value;
    const apiKey = document.getElementById('api-key-delete').value;

    if (!baseDriverUrl || !driverNumber || !apiKey) {
        alert('Please enter both the Base URL and Driver ID.');
        return;
    }

    try {
        const response = await fetch(`${baseDriverUrl}/driver/${driverNumber}`, {
            method: 'DELETE',
            headers: {
                'X-API-KEY': apiKey
            }
        });

        data = await response.json();

        if (response.ok) {
            showNotification(data.code, data.result);

            loadDrivers();
        } else {
            showNotification(data.code || response.status, data.result || 'Failed to create driver');

            throw new Error('Failed to delete driver')
        }
    } catch (error) {
        console.error('Error deleting driver:', error);
    }
};
