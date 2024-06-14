




document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the form from submitting the default way

        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;

        try {
            const response = await fetch('http://192.168.1.142:8000/owner/login', {
                mode: "cors",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    
                },
                body: JSON.stringify({ username: username, password: password })
            });

            if (response.ok) {
                const auth=response.headers.get("Authorization");
                localStorage.setItem("AthToken",auth);
            
                const htmlContent = await response.text(); // Get response as text
                // Extract the URL from the response text (assuming the URL is provided as plain text)
                const requestOptions = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${auth}`
                }
                };

                fetch(url, requestOptions)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    // Redirect after successful fetch
                    window.location.href = url;
                })
                .catch(error => console.error('Error fetching data:', error));
            } else {
                console.log('Network response was not ok.');
                // Display an error message in the DOM
                document.getElementById('message').textContent = 'Invalid credentials. Please try again.';
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            // Display a generic error message in the DOM
            document.getElementById('message').textContent = 'There was a problem with the login operation. Please try again later.';
        }
    });
});
