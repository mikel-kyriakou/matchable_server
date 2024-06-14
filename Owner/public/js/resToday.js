

const BASE_URL="http://192.168.1.142:8000";


document.addEventListener("DOMContentLoaded", function() {
    const authToken = localStorage.getItem('AthToken'); // Assuming you store the auth token in sessionStorage
    fetchReservations(authToken);
    fetchAvailability(authToken);
    scheduleMidnightUpdate(authToken);
});

// Function to fetch reservations data from the server
function fetchReservations(authToken) {
    fetch(`${BASE_URL}/owner/login`, {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => response.json())
    .then(data => populateReservationsTable(data))
    .catch(error => console.error('Error fetching reservations:', error));
}

// Function to fetch availability data from the server
function fetchAvailability(authToken) {
    fetch(`${BASE_URL}/owner/login`, {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => response.json())
    .then(data => populateAvailabilityList(data))
    .catch(error => console.error('Error fetching availability:', error));
}

// Function to schedule the update at midnight
function scheduleMidnightUpdate(authToken) {
    const now = new Date();
    const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // Next day
        0, 0, 0 // Midnight
    );
    const timeUntilMidnight = midnight - now;

    setTimeout(() => {
        fetchReservations(authToken);
        fetchAvailability(authToken);
        scheduleMidnightUpdate(authToken); // Schedule the next update
    }, timeUntilMidnight);
}
