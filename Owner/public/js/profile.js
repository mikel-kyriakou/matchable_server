//Profile


document.addEventListener("DOMContentLoaded", function() {
    fetchUserData();
    document.getElementById('saveButton').addEventListener('click', saveUserData);
});

// Function to fetch user data from the server
function fetchUserData() {
    fetch('https://example.com/api/getUserData')
        .then(response => response.json())
        .then(data => populateForm(data))
        .catch(error => console.error('Error fetching user data:', error));
}

// Function to populate the form with fetched data
function populateForm(data) {
    document.getElementById('name').value = data.name;
    document.getElementById('email').value = data.email;
    document.getElementById('telephone').value = data.telephone;
    document.getElementById('location').value = data.location;
    document.getElementById('openingHour').value = data.openingHour;
    document.getElementById('closingHour').value = data.closingHour;
}

// Function to save the updated user data
function saveUserData() {
    const updatedData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value
    };

    fetch('https://example.com/api/updateUserData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Data saved successfully!');
        } else {
            alert('Failed to save data.');
        }
    })
    .catch(error => console.error('Error saving user data:', error));
}