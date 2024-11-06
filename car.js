// Testing URL
// const baseUrl = "https://lab-d00a6b41-7f81-4587-a3ab-fa25e5f6d9cf.australiaeast.cloudapp.azure.com:7101";

// Load and display cars
const loadCars = async () => {
    const baseUrl = document.getElementById('car-base-url').value;

    if (!baseUrl) {
        alert('Please enter the Base URL.');
        return;
    }

    try {
        const response = await fetch(`${baseUrl}/car`);
        const data = await response.json();

        if (response.ok) {
            const carsTable = document.querySelector('#carsTable tbody');
            carsTable.innerHTML = ''; // Clear previous entries

            data.result.forEach(car => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${car.id}</td>
                    <td>${car.suitability.race}</td>
                    <td>${car.suitability.street}</td>
                    <td>${car.reliability}</td>
                    <td>${car.driver ? car.driver.name : 'N/A'}</td>
                `;
                carsTable.appendChild(row);
            });
        } else {
            showNotification(data.code || response.status, data.result || 'Failed to load cars');
        }
    } catch (error) {
        console.error('Error loading cars:', error);
    }
};

// Create a new car
const createCar = async () => {
    const baseUrl = document.getElementById('car-base-url').value;
    const carReliability = document.getElementById('carReliability').value;
    const suitabilityRace = document.getElementById('suitabilityRace').value;
    const suitabilityStreet = document.getElementById('suitabilityStreet').value;
    const apiKey = document.getElementById('api-key').value;

    console.log("carReliability", carReliability)
    console.log("suitabilityRace", suitabilityRace)
    console.log("suitabilityStreet", suitabilityStreet)
    console.log("apiKey", apiKey)


    if (!baseUrl || !apiKey || carReliability === '' || suitabilityRace === '' || suitabilityStreet === '') {
        alert('Please enter all car details, including the API Key.');
        return;
    }

    const newCar = {
        suitability: {
            race: parseInt(suitabilityRace, 10),
            street: parseInt(suitabilityStreet, 10)
        },
        reliability: parseInt(carReliability, 10)
    };

    try {
        const response = await fetch(`${baseUrl}/car`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': apiKey
            },
            body: JSON.stringify(newCar)
        });

        const data = await response.json();
        if (response.ok) {
            showNotification(data.code || response.status, data.result || 'Car created successfully');
            loadCars(); // Refresh car list to show the new car
        } else {
            showNotification(data.code || response.status, data.result || 'Failed to create car');
            throw new Error('Failed to create car');
        }
    } catch (error) {
        console.error('Error creating car:', error);
        // showNotification('Error', error.message || 'An unknown error occurred');
    }
};

// Delete a car by number
const deleteCar = async () => {
    const baseUrl = document.getElementById('car-base-url').value;

    const carNumber = document.getElementById('deleteCarNumber').value;
    const apiKey = document.getElementById('api-key').value;

    if (!baseUrl || !carNumber || !apiKey) {
        alert('Please enter the Base URL, Car Number and API key.');
        return;
    }

    try {
        const response = await fetch(`${baseUrl}/car/${carNumber}`, {
            method: 'DELETE',
            headers: {
                'X-API-KEY': apiKey
            }
        });

        const data = await response.json();
        showNotification(data.code || response.status, data.result || 'Car deleted successfully');
        loadCars(); // Refresh car list
    } catch (error) {
        console.error('Error deleting car:', error);
        // showNotification('Error', error.message || 'An unknown error occurred');
    }
};

// Associate a driver with a car
const associateDriver = async () => {
    const baseUrl = document.getElementById('car-base-url').value;
    const carID = document.getElementById('associateCarID').value;
    const driverNumber = document.getElementById('associateDriverNumber').value;
    const apiKey = document.getElementById('api-key').value;

    if (!baseUrl || !apiKey || !carID || !driverNumber) {
        alert('Please enter the Base URL, Car ID, Driver Number, and API Key.');
        return;
    }

    try {
        const response = await fetch(`${baseUrl}/car/${carID}/driver`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': apiKey
            },
            body: JSON.stringify({ number: parseInt(driverNumber, 10) })
        });

        const data = await response.json();
        if (response.ok) {
            showNotification(data.code || response.status, data.result || 'Driver associated successfully');

            loadCars();
        } else {
            showNotification(data.code || response.status, data.result || 'Failed to set driver for car');

            throw new Error('Failed to create driver')
        }
    } catch (error) {
        console.error('Error associating driver:', error);
        // showNotification('Error', error.message || 'An unknown error occurred');
    }
};

// Unassociate a driver from a car
const unassociateDriver = async () => {
    const baseUrl = document.getElementById('car-base-url').value;
    const carID = document.getElementById('associateCarID').value;
    const apiKey = document.getElementById('api-key').value;

    if (!baseUrl || !apiKey || !carID) {
        alert('Please enter the Base URL, Car ID, and API Key.');
        return;
    }

    try {
        const response = await fetch(`${baseUrl}/car/${carID}/driver`, {
            method: 'DELETE',
            headers: {
                'X-API-KEY': apiKey
            }
        });

        const data = await response.json();
        if (response.ok) {
            showNotification(data.code || response.status, data.result || 'Driver unassociated successfully');
            loadCars(); // Refresh car list
        } else {
            showNotification(data.code || response.status, data.result || 'Failed to unassociate driver from car');
            throw new Error('Failed to unassociate driver');
        }
    } catch (error) {
        console.error('Error unassociating driver:', error);
        showNotification('Error', error.message || 'An unknown error occurred');
    }
};