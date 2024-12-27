(function () {
    document.addEventListener("DOMContentLoaded", function () {
        const loginForm = document.getElementById("loginForm");

        // if (!loginForm) {
        //     console.error("Login form not found on the page.");
        //     return;
        // }

        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const usernameField = document.getElementById("username");
            const passwordField = document.getElementById("password");

            const username = usernameField.value.trim();
            const password = passwordField.value.trim();

            // Input validation
            if (!username || !password) {
                alert("Both username and password are required.");
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
                alert("Login successful!");
                localStorage.setItem("loggedIn", "true"); // Set loggedIn flag
                window.location.href = "index.html"; // Redirect to main app
            } else {
                alert("Invalid username or password.");
            }
        });

        // Function to validate credentials (Mock function for simplicity)
        function validateCredentials(username, password) {
            // Replace this with server-side validation in production
            const validUsername = "Fidel365";
            const validPassword = "11335678";

            return username === validUsername && password === validPassword;
        }
    });
})();
