// document.addEventListener("DOMContentLoaded", function() {
//     fetchReservations();
//     fetchAvailability();
//     scheduleMidnightUpdate();
// });

// // Function to fetch reservations data from the server
// function fetchReservations() {
//     fetch('http://localhost:3000/api/reservations')
//         .then(response => response.json())
//         .then(data => populateReservationsTable(data))
//         .catch(error => console.error('Error fetching reservations:', error));
// }

// // Function to populate reservations table
// function populateReservationsTable(reservations) {
//     const tbody = document.querySelector('table tbody');
//     tbody.innerHTML = ''; // Clear existing rows

//     reservations.forEach(reservation => {
//         const row = document.createElement('tr');
//         const userCell = document.createElement('td');
//         const img = document.createElement('img');
//         img.src = 'images/pngtree-user-avatar-placeholder-black-png-image_3918427.jpg'; // Default avatar
//         const userName = document.createElement('p');
//         userName.textContent = reservation.user;
//         userCell.appendChild(img);
//         userCell.appendChild(userName);

//         const dateCell = document.createElement('td');
//         dateCell.textContent = reservation.date;

//         const hourCell = document.createElement('td');
//         hourCell.textContent = reservation.hour;

//         const fieldCell = document.createElement('td');
//         fieldCell.textContent = reservation.field;

//         const statusCell = document.createElement('td');
//         const statusSpan = document.createElement('span');
//         statusSpan.className = `status ${reservation.status.toLowerCase()}`;
//         statusSpan.textContent = reservation.status;
//         statusCell.appendChild(statusSpan);

//         row.appendChild(userCell);
//         row.appendChild(dateCell);
//         row.appendChild(hourCell);
//         row.appendChild(fieldCell);
//         row.appendChild(statusCell);

//         tbody.appendChild(row);
//     });
// }

// // Function to fetch availability data from the server
// function fetchAvailability() {
//     fetch('http://localhost:3000/api/availability')
//         .then(response => response.json())
//         .then(data => populateAvailabilityList(data))
//         .catch(error => console.error('Error fetching availability:', error));
// }

// // Function to populate availability list
// function populateAvailabilityList(availability) {
//     const ul = document.querySelector('.todo-list');
//     ul.innerHTML = ''; // Clear existing items

//     availability.forEach(slot => {
//         const li = document.createElement('li');
//         li.className = 'not-completed';

//         const p = document.createElement('p');
//         p.textContent = `Field ${slot.field}: ${slot.time}`;

//         const icon = document.createElement('i');
//         icon.className = 'bx bx-dots-vertical-rounded';

//         li.appendChild(p);
//         li.appendChild(icon);

//         ul.appendChild(li);
//     });
// }

// // Function to schedule the update at midnight
// function scheduleMidnightUpdate() {
//     const now = new Date();
//     const midnight = new Date(
//         now.getFullYear(),
//         now.getMonth(),
//         now.getDate() + 1, // Next day
//         0, 0, 0 // Midnight
//     );
//     const timeUntilMidnight = midnight - now;

//     setTimeout(() => {
//         fetchReservations();
//         fetchAvailability();
//         scheduleMidnightUpdate(); // Schedule the next update
//     }, timeUntilMidnight);
// }

document.addEventListener("DOMContentLoaded", function() {
    const authToken = localStorage.getItem('AthToken'); // Assuming you store the auth token in sessionStorage
    fetchReservations(authToken);
    fetchAvailability(authToken);
    scheduleMidnightUpdate(authToken);
});

// Function to fetch reservations data from the server
function fetchReservations(authToken) {
    fetch('http://localhost:3000/api/reservations', {
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
    fetch('http://localhost:3000/api/availability', {
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
