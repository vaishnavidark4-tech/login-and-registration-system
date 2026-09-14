const registerForm = document.getElementById("registerForm");

const message = document.getElementById("message");

const registerButton =
    document.getElementById("registerButton");


registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const fullName =
        document.getElementById("fullName").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    message.textContent = "";
    registerButton.disabled = true;
    registerButton.textContent = "Creating Account...";


    try {

        const response = await fetch(
            "https://login-and-registration-system-new.onrender.com/api/auth/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    fullName: fullName,
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        if (response.ok) {

            message.textContent =
                "Account created successfully!";

            message.style.color = "green";

            registerForm.reset();

            setTimeout(function () {

                window.location.href = "login.html";

            }, 1500);

        } else {

            message.textContent =
                data.message ||
                data.error ||
                "Registration failed.";

            message.style.color = "red";
        }


    } catch (error) {

        console.error("Registration error:", error);

        message.textContent =
            "Unable to connect to the server.";

        message.style.color = "red";

    } finally {

        registerButton.disabled = false;
        registerButton.textContent = "Create Account";

    }

});