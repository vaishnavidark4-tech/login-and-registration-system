
const USERS_API_URL = "http://localhost:8080/api/users";
const GROUPS_API_URL = "http://localhost:8080/api/groups";

// Get logged-in user
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
const token = loggedInUser?.token;


// Check login session
if (!token) {
    alert("Login session expired. Please login again.");
    window.location.href = "login.html";
}


// Elements
const totalUsers = document.getElementById("totalUsers");
const totalGroups = document.getElementById("totalGroups");
const activeUsers = document.getElementById("activeUsers");
const activeGroups = document.getElementById("activeGroups");

const userManagementButton =
    document.getElementById("userManagementButton");

const groupManagementButton =
    document.getElementById("groupManagementButton");

const logoutButton =
    document.getElementById("logoutButton");


// =========================
// LOAD DASHBOARD DATA
// =========================

async function loadDashboardData() {

    try {

        const usersResponse = await fetch(USERS_API_URL, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!usersResponse.ok) {
            throw new Error("Unable to load users");
        }

        const users = await usersResponse.json();


        const groupsResponse = await fetch(GROUPS_API_URL, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!groupsResponse.ok) {
            throw new Error("Unable to load groups");
        }

        const groups = await groupsResponse.json();


        // Total counts
        totalUsers.textContent = users.length;
        totalGroups.textContent = groups.length;


        // Active users
        const activeUserCount = users.filter(
            user =>
                user.status &&
                user.status.toLowerCase() === "active"
        ).length;

        activeUsers.textContent = activeUserCount;


        // Active groups
        const activeGroupCount = groups.filter(
            group =>
                group.status &&
                group.status.toLowerCase() === "active"
        ).length;

        activeGroups.textContent = activeGroupCount;


    } catch (error) {

        console.error("Dashboard loading error:", error);

        totalUsers.textContent = "!";
        totalGroups.textContent = "!";
        activeUsers.textContent = "!";
        activeGroups.textContent = "!";

        alert("Unable to load dashboard data.");
    }
}


// =========================
// NAVIGATION
// =========================

userManagementButton.addEventListener("click", () => {
    window.location.href = "user-management.html";
});


groupManagementButton.addEventListener("click", () => {
    window.location.href = "group-management.html";
});


// =========================
// LOGOUT
// =========================

logoutButton.addEventListener("click", () => {

    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");

    window.location.href = "login.html";
});


// =========================
// START DASHBOARD
// =========================

loadDashboardData();

