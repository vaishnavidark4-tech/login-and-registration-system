const BACKEND_URL =
    "https://login-and-registration-system-1-rhcn.onrender.com";

const USERS_API_URL =
    `${BACKEND_URL}/api/users`;

const GROUPS_API_URL =
    `${BACKEND_URL}/api/groups`;


document.addEventListener("DOMContentLoaded", function () {
    loadDashboardData();
});


async function loadDashboardData() {

    const loggedInUser =
        JSON.parse(localStorage.getItem("loggedInUser"));

    const token = loggedInUser?.token;

    if (!token) {
        console.error("No login token found.");
        return;
    }

    try {

        // Load Users
        const usersResponse = await fetch(USERS_API_URL, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });

        if (!usersResponse.ok) {
            throw new Error("Unable to load users");
        }

        const users = await usersResponse.json();

        // Load Groups
        const groupsResponse = await fetch(GROUPS_API_URL, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });

        if (!groupsResponse.ok) {
            throw new Error("Unable to load groups");
        }

        const groups = await groupsResponse.json();


        // Update dashboard counts
        const totalUsersElement =
            document.getElementById("totalUsers");

        const totalGroupsElement =
            document.getElementById("totalGroups");


        if (totalUsersElement) {
            totalUsersElement.textContent = users.length;
        }

        if (totalGroupsElement) {
            totalGroupsElement.textContent = groups.length;
        }


        console.log("Users loaded:", users);
        console.log("Groups loaded:", groups);

    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );
    }
}