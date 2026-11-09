
const BACKEND_URL = "http://localhost:8080";

const USERS_API_URL = `${BACKEND_URL}/api/users`;
const GROUPS_API_URL = `${BACKEND_URL}/api/groups`;



document.addEventListener("DOMContentLoaded", function () {

    loadDashboardData();

    // User Management navigation
    document.getElementById("userManagementButton")
        ?.addEventListener("click", function () {
            window.location.href = "user-management.html";
        });

    // Group Management navigation
    document.getElementById("groupManagementButton")
        ?.addEventListener("click", function () {
            window.location.href = "group-management.html";
        });

    // Chain Management navigation
    document.getElementById("chainManagementButton")
        ?.addEventListener("click", function () {
            window.location.href = "chain-management.html";
        });

    // Brand Management navigation
    document.getElementById("brandManagementButton")
        ?.addEventListener("click", function () {
            window.location.href = "brand-management.html";
        });

    // Logout
    document.getElementById("logoutButton")
        ?.addEventListener("click", function () {
            localStorage.removeItem("loggedInUser");
            window.location.href = "login.html";
        });

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

        const activeUsersElement =
            document.getElementById("activeUsers");

        const activeGroupsElement =
            document.getElementById("activeGroups");

        if (totalUsersElement) {
            totalUsersElement.textContent = users.length;
        }

        if (totalGroupsElement) {
            totalGroupsElement.textContent = groups.length;
        }

        // Update active counts
        if (activeUsersElement) {
            activeUsersElement.textContent =
                users.filter(user =>
                    user.isActive === true ||
                    user.status === "Active"
                ).length;
        }

        if (activeGroupsElement) {
            activeGroupsElement.textContent =
                groups.filter(group =>
                    group.status === "Active"
                ).length;
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
