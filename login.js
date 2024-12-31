(function () {
    document.addEventListener("DOMContentLoaded", function () {
        const loginForm = document.getElementById("loginForm");

        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const usernameField = document.getElementById("username");
            const passwordField = document.getElementById("password");

            const username = usernameField.value.trim();
            const password = passwordField.value.trim();

            // Input validation
            if (!username || !password) {
                displayMessage("Both username and password are required.", "error");
                if (!username) usernameField.classList.add("error");
                if (!password) passwordField.classList.add("error");
                return;
            }

            // Clear error styles if fixed
            usernameField.classList.remove("error");
            passwordField.classList.remove("error");

            // Check credentials
            const isValid = validateCredentials(username, password);

            if (isValid) {
                displayMessage("Login successful! Redirecting...", "success");
                localStorage.setItem("loggedIn", "true"); // Set loggedIn flag

                // Redirect after 2 seconds
                setTimeout(() => {
                    window.location.href = "index.html"; // Redirect to main app
                }, 2000);
            } else {
                displayMessage("Invalid username or password.", "error");
            }
        });

        // Function to validate credentials (Mock function for simplicity)
        function validateCredentials(username, password) {
            // Replace this with server-side validation in production
            const validUsername = "Fidel365";
            const validPassword = "11335678";

            return username === validUsername && password === validPassword;
        }

        // Function to display messages without using alert()
        function displayMessage(message, type) {
            const messageContainer = document.createElement("div");
            messageContainer.textContent = message;
            messageContainer.className = `message ${type}`; // Add success or error class

            document.body.appendChild(messageContainer);

            // Remove the message after 3 seconds
            setTimeout(() => {
                messageContainer.remove();
            }, 3000);
        }
    });
})();
