const API_URL = "http://localhost:8080/api/users";

const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;
function loadUsers() {
    const tableBody = document.getElementById("userTableBody");
    const message = document.getElementById("message");

    message.textContent = "Loading users...";

    fetch(API_URL, {
    method: "GET",
    headers: {
        "Authorization": "Bearer " + token
    }
})
        .then(response => {
            if (!response.ok) {
                throw new Error("Unable to load users");
            }
            return response.json();
        })
        .then(users => {
            tableBody.innerHTML = "";

            if (users.length === 0) {
                const row = document.createElement("tr");
                const cell = document.createElement("td");

                cell.colSpan = 4;
                cell.textContent = "No users found.";

                row.appendChild(cell);
                tableBody.appendChild(row);

                message.textContent = "";
                return;
            }

            users.forEach(user => {
                const row = document.createElement("tr");

                const idCell = document.createElement("td");
                idCell.textContent = user.id;

                const nameCell = document.createElement("td");
                nameCell.textContent = user.fullName || "";

                const emailCell = document.createElement("td");
                emailCell.textContent = user.email || "";

                const actionCell = document.createElement("td");

                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.className = "edit-btn";

                editButton.onclick = function () {
                    openEditModal(
                        user.id,
                        user.fullName || "",
                        user.email || ""
                    );
                };

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.className = "delete-btn";

                deleteButton.onclick = function () {
                    deleteUser(user.id);
                };

                actionCell.appendChild(editButton);
                actionCell.appendChild(deleteButton);

                row.appendChild(idCell);
                row.appendChild(nameCell);
                row.appendChild(emailCell);
                row.appendChild(actionCell);

                tableBody.appendChild(row);
            });

            message.textContent = "";
        })
        .catch(error => {
            console.error("Load users error:", error);

            tableBody.innerHTML = "";

            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 4;
            cell.textContent = "Unable to load users.";

            row.appendChild(cell);
            tableBody.appendChild(row);

            message.textContent = "Unable to connect to the server.";
        });
}

function openAddUserModal() {
    document.getElementById("addUserModal").style.display = "flex";
}

function closeAddUserModal() {
    document.getElementById("addUserModal").style.display = "none";

    document.getElementById("addFullName").value = "";
    document.getElementById("addEmail").value = "";
    document.getElementById("addPassword").value = "";
}

function addUser() {
    const fullName = document.getElementById("addFullName").value.trim();
    const email = document.getElementById("addEmail").value.trim();
    const password = document.getElementById("addPassword").value.trim();

    if (!fullName || !email || !password) {
        alert("Please fill all fields.");
        return;
    }

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fullName: fullName,
            email: email,
            password: password
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Add user failed");
            }

            return response.json();
        })
        .then(() => {
            alert("User added successfully!");
            closeAddUserModal();
            loadUsers();
        })
        .catch(error => {
            console.error("Add user error:", error);
            alert("Unable to add user.");
        });
}

function openEditModal(id, fullName, email) {
    document.getElementById("editId").value = id;
    document.getElementById("editFullName").value = fullName;
    document.getElementById("editEmail").value = email;

    document.getElementById("editModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("editModal").style.display = "none";
}

function updateUser() {
    const id = document.getElementById("editId").value;
    const fullName = document.getElementById("editFullName").value.trim();
    const email = document.getElementById("editEmail").value.trim();

    if (!fullName || !email) {
        alert("Please fill all fields.");
        return;
    }

    fetch(API_URL + "/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fullName: fullName,
            email: email
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Update user failed");
            }

            return response.json();
        })
        .then(() => {
            alert("User updated successfully!");
            closeModal();
            loadUsers();
        })
        .catch(error => {
            console.error("Update user error:", error);
            alert("Unable to update user.");
        });
}

function deleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) {
        return;
    }

    fetch(API_URL + "/" + id, {
        method: "DELETE"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Delete user failed");
            }

            return response.text();
        })
        .then(() => {
            alert("User deleted successfully!");
            loadUsers();
        })
        .catch(error => {
            console.error("Delete user error:", error);
            alert("Unable to delete user.");
        });
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function () {
    loadUsers();
});