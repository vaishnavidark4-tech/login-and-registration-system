
async function login() {

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value.trim();

    const message =
        document.getElementById("message");

    const loginButton =
        document.getElementById("loginButton");


    if (email === "") {

        message.textContent =
            "Please enter your email.";

        return;
    }


    if (password === "") {

        message.textContent =
            "Please enter your password.";

        return;
    }


    loginButton.disabled = true;

    loginButton.textContent =
        "Logging in...";


    try {
const response = await fetch(
    "https://login-and-registration-system-new.onrender.com/api/auth/login",
      
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


        const data = await response.json();


        if (!response.ok) {

            message.textContent =
                typeof data === "string"
                    ? data
                    : "Login failed.";

            loginButton.disabled = false;

            loginButton.textContent =
                "Login";

            return;
        }


       localStorage.setItem(
    "loggedInUser",
    JSON.stringify(data)
);

localStorage.setItem(
    "token",
    data.token
);


        window.location.href =
            "user-management.html";


    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        message.textContent =
            "Cannot connect to server.";

        loginButton.disabled = false;

        loginButton.textContent =
            "Login";
    }
}
