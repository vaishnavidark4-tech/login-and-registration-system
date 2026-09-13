const loginForm =
    document.getElementById("loginForm");

console.log("Login JS loaded");
console.log("Login form:", loginForm);


loginForm.addEventListener("submit", async function (event) {

    console.log("LOGIN BUTTON CLICKED");

    event.preventDefault();


    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value.trim();


    console.log("Email:", email);
    console.log("Password:", password);


    const message =
        document.getElementById("message");

    const loginButton =
        document.getElementById("loginButton");


    message.textContent = "";
    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";


    try {

        console.log("Sending request to backend...");

        const response = await fetch(
            "http://localhost:8080/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        console.log("Backend response:", response);


        const data = await response.json();

        console.log("Backend data:", data);


        if (!response.ok) {

            throw new Error(
                data.message || "Login failed"
            );
        }


        localStorage.setItem(
            "token",
            data.token
        );


        localStorage.setItem(
            "loggedInUser",
            email
        );


        message.textContent =
            "Login successful!";


        console.log("LOGIN SUCCESS");


        window.location.href =
            "user-management.html";


    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        message.textContent =
            error.message ||
            "Unable to login.";


    } finally {

        loginButton.disabled = false;

        loginButton.textContent =
            "Login";
    }

});