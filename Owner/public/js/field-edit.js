document.getElementById('btn-add').addEventListener('click', function() {
    document.getElementById('addNewForm').style.display = 'flex';
});

document.getElementById('cancelBtn').addEventListener('click', function() {
    document.getElementById('addNewForm').style.display = 'none';
    document.getElementById('newFieldRowForm').reset();
});

document.getElementById('newFieldRowForm').addEventListener('submit',async function(event) {
    event.preventDefault();

    const field = document.getElementById('fieldName').value;
    const selectedSport = document.querySelector('input[name="sports"]:checked');
    const selectedSportText = selectedSport ? selectedSport.nextElementSibling.textContent : null;
    const openTime = document.getElementById("openingTime").value;
    const closeTime = document.getElementById("closingTime").value;
    const price = document.getElementById('price').value;
    // Get current date and time
    var now = new Date();
    var datetime = now.toLocaleString();


    // Create a data object to send to the server
    const data = {
        field: field,
        sportName: selectedSportText,

        openTime: openTime,
        closeTime: closeTime,
        price: price,
    };

    try {
        const response = await fetch('/your-endpoint-for-saving-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            console.log('Data successfully saved to the database.');
            // Optionally, do something after successful submission
        } else {
            console.error('Failed to save data to the database.');
            // Optionally, handle the error
        }
    } catch (error) {
        console.error('Error:', error);
        // Optionally, handle the error
    }

    const newFieldRow = document.createElement('div');
    newFieldRow.className = 'field-row';
    newFieldRow.innerHTML = `
        <ul>
            <li>${field}</li>
            <li>${selectedSportText}</li>
            <li>${openTime}-${closeTime}</li>
            <li>${price}€</li>
            <li>${datetime}</li>
            <li>${datetime}</li>
            <li>
                <button class="edit-btn"><i class='bx bxs-edit'></i></button>
                <button class="trash-btn"><i class='bx bxs-trash'></i></button>
            </li>
        </ul>
    `;

    document.getElementById('addcontent').appendChild(newFieldRow);

    // Re-attach event listeners for the new buttons
    newFieldRow.querySelector('.trash-btn').addEventListener('click', handleDelete);
    newFieldRow.querySelector('.edit-btn').addEventListener('click', editFieldRow);

    document.getElementById('addNewForm').style.display = 'none';
    document.getElementById('newFieldRowForm').reset();

    
});


//DELETE FIELD BUTTON
// Function to handle deleting a field row
function handleDelete(event) {
    var modal = document.getElementById('modal');
    var confirmDeleteBtn = document.getElementById('confirmDelete');
    var cancelDeleteBtn = document.getElementById('cancelDelete');
    var targetFieldRow = event.target.closest('.field-row');

    modal.style.display = 'block';

    confirmDeleteBtn.addEventListener('click', function() {
        if (targetFieldRow) {
            targetFieldRow.parentNode.removeChild(targetFieldRow);
            modal.style.display = 'none';
        }
    });

    cancelDeleteBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close the modal when the close button (×) is clicked
    var closeModalBtn = document.querySelector('.close');
    closeModalBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
}

// Event delegation for delete buttons
document.addEventListener('click', function(event) {
    if (event.target.closest('.trash-btn')) {
        handleDelete(event);
    }
});





// Function to handle editing a field row
function editFieldRow(event) {
    var editForm = document.getElementById('editForm');
    var fieldRow = event.target.closest('.field-row');
    editForm.style.display = 'flex';

    // Get current values from the field row
    var field = fieldRow.querySelector('ul li:nth-child(1)').textContent;
    var imageUrl = fieldRow.querySelector('ul li:nth-child(2) img').src;
    var sport = fieldRow.querySelector('ul li:nth-child(3)').textContent;
    var price = fieldRow.querySelector('ul li:nth-child(4)').textContent.replace('€', '');
    // Get current date and time
    var now = new Date();
    var datetime = now.toLocaleString();

    // Pre-fill the edit form with current values
    document.getElementById('editfieldName').value = field;
    document.getElementById('editimageUrl').value = imageUrl;
    document.getElementById('editsport').value = sport;
    document.getElementById('editprice').value = price;
    document.getElementById('editdatetime').value = datetime;

    // Remove any existing submit event listeners
    var newForm = document.getElementById('editFieldRowForm');
    newForm.removeEventListener('submit', saveChanges);

    // Function to handle saving changes
    function saveChanges(event) {
        event.preventDefault();

        // Update the field row with new values
        fieldRow.querySelector('ul li:nth-child(1)').textContent = document.getElementById('editfieldName').value;
        fieldRow.querySelector('ul li:nth-child(2) img').src = document.getElementById('editimageUrl').value;
        fieldRow.querySelector('ul li:nth-child(3)').textContent = document.getElementById('editsport').value;
        fieldRow.querySelector('ul li:nth-child(4)').textContent = document.getElementById('editprice').value +"€";
        fieldRow.querySelector('ul li:nth-child(5)').textContent = document.getElementById('editdatetime').value;

        // Hide the edit form
        editForm.style.display = 'none';
    }

    // Add the new submit event listener
    newForm.addEventListener('submit', saveChanges);
}

// Attach event listener to edit button on DOM load
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', editFieldRow);
    });

    // Handle the cancel button click for the edit form
    document.getElementById('editcancelBtn').onclick = function() {
        document.getElementById('editForm').style.display = 'none';
    };
});



/////////////////////  SCRIPT FOR TIME     ////////////////////////

// document.addEventListener('DOMContentLoaded', function() {
//     const openingTimeInput = document.getElementById('openingTime');
//     const incrementHourBtn = document.getElementById('incrementHourBtn');
//     const decrementHourBtn = document.getElementById('decrementHourBtn');

//     // Initialize with default time
//     let currentTime = new Date();
//     currentTime.setMinutes(0); // Set initial minutes to 0
//     updateInputField(currentTime);

//     // Function to update the input field
//     function updateInputField(time) {
//         const hours = `${time.getHours()}`.padStart(2, '0');
//         const minutes = `${time.getMinutes()}`.padStart(2, '0');
//         openingTimeInput.value = `${hours}:${minutes}`;
//     }

//     // Function to increment the hour by one
//     function incrementHour() {
//         currentTime.setMinutes(currentTime.getMinutes() + 30);
//         updateInputField(currentTime);
//     }

//     // Function to decrement the hour by one
//     function decrementHour() {
//         currentTime.setMinutes(currentTime.getMinutes() - 30);
//         updateInputField(currentTime);
//     }

//     // Attach event listeners to buttons
//     incrementHourBtn.addEventListener('click', incrementHour);
//     decrementHourBtn.addEventListener('click', decrementHour);
// });





// document.addEventListener('DOMContentLoaded', function() {
//     const closingTimeInput = document.getElementById('closingTime');
//     const incrementHourBtn = document.getElementById('incrementHourBtn2');
//     const decrementHourBtn = document.getElementById('decrementHourBtn2');

//     // Initialize with default time
//     let currentTime = new Date();
//     currentTime.setMinutes(60); // Set initial minutes to 0
//     updateInputField(currentTime);

//     // Function to update the input field
//     function updateInputField(time) {
//         const hours = `${time.getHours()}`.padStart(2, '0');
//         const minutes = `${time.getMinutes()}`.padStart(2, '0');
//         closingTimeInput.value = `${hours}:${minutes}`;
//     }

//     // Function to increment the hour by one
//     function incrementHour() {
//         currentTime.setMinutes(currentTime.getMinutes() + 30);
//         updateInputField(currentTime);
//     }

//     // Function to decrement the hour by one
//     function decrementHour() {
//         currentTime.setMinutes(currentTime.getMinutes() - 30);
//         updateInputField(currentTime);
//     }

//     // Attach event listeners to buttons
//     incrementHourBtn2.addEventListener('click', incrementHour);
//     decrementHourBtn2.addEventListener('click', decrementHour);
// });

document.addEventListener('DOMContentLoaded', function() {
            const timeFields = document.querySelectorAll('.time-field');
            const incrementHourBtns = document.querySelectorAll('.incrementHourBtn');
            const decrementHourBtns = document.querySelectorAll('.decrementHourBtn');

            timeFields.forEach((timeField, index) => {
                let currentTime = new Date();
                currentTime.setMinutes(0); // Set initial minutes to 0
                updateInputField(currentTime, timeField);

                // Function to update the input field
                function updateInputField(time, field) {
                    const hours = `${time.getHours()}`.padStart(2, '0');
                    const minutes = `${time.getMinutes()}`.padStart(2, '0');
                    field.value = `${hours}:${minutes}`;
                }

                // Function to increment the hour by one
                function incrementHour() {
                    currentTime.setMinutes(currentTime.getMinutes() + 30);
                    updateInputField(currentTime, timeField);
                }

                // Function to decrement the hour by one
                function decrementHour() {
                    currentTime.setMinutes(currentTime.getMinutes() - 30);
                    updateInputField(currentTime, timeField);
                }

                // Attach event listeners to buttons
                incrementHourBtns[index].addEventListener('click', incrementHour);
                decrementHourBtns[index].addEventListener('click', decrementHour);
            });
});