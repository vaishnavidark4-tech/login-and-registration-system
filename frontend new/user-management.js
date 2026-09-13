// ==========================================
// USER MANAGEMENT - STEP 3
// CHECK LOGIN TOKEN
// ==========================================

const token = localStorage.getItem("token");

const loggedInUser =
    localStorage.getItem("loggedInUser");

const welcomeMessage =
    document.getElementById("welcomeMessage");


// ==========================================
// CHECK TOKEN
// ==========================================

if (!token) {

    // No token means user is not logged in

    window.location.href = "login.html";

}


// ==========================================
// SHOW LOGGED-IN USER
// ==========================================

if (loggedInUser) {

    welcomeMessage.textContent =
        "Welcome, " + loggedInUser;

}
// ==========================================
// GET ALL USERS
// ==========================================

const usersContainer =
    document.getElementById("usersContainer");


async function loadUsers() {

    try {

        const response = await fetch(
            "http://localhost:8080/api/users",
            {
                method: "GET",

                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            }
        );


        // Check backend response

        if (!response.ok) {

            throw new Error(
                "Unable to load users. Status: " +
                response.status
            );
        }


        // Convert response to JSON

        const users =
            await response.json();


        console.log("Users received:", users);


        // Display users

        usersContainer.innerHTML = "";

users.forEach(function (user) {

    const row =
        document.createElement("tr");


    row.innerHTML = `
        <td>${user.id}</td>

        <td>${user.fullName}</td>

        <td>${user.email}</td>

        <td>${user.role || "User"}</td>

        <td>${user.status || "Active"}</td>
    `;


    usersContainer.appendChild(row);

});
    } catch (error) {

        console.error(
            "User loading error:",
            error
        );

        usersContainer.textContent =
            error.message;
    }
}


// ==========================================
// LOAD USERS
// ==========================================

loadUsers();
// ==========================================
// ADD USER FORM - SHOW / HIDE
// ==========================================

const addUserButton =
    document.getElementById("addUserButton");

const userFormContainer =
    document.getElementById("userFormContainer");

const cancelUserButton =
    document.getElementById("cancelUserButton");


// ==========================================
// OPEN FORM
// ==========================================

addUserButton.addEventListener("click", function () {

    userFormContainer.style.display = "block";

});


// ==========================================
// CLOSE FORM
// ==========================================

cancelUserButton.addEventListener("click", function () {

    userFormContainer.style.display = "none";

});