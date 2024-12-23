document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "password123") {
        alert("Login successful!");
        window.location.href = "index.html"; // Redirect to the main application
    } else {
        alert("Invalid username or password");
    }
});
