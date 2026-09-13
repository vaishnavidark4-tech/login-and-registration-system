const API_URL = "http://localhost:8080/api/users";

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
const token = loggedInUser?.token;


// ===============================
// LOAD USERS
// ===============================

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

            cell.colSpan = 6;
            cell.textContent = "No users found.";

            row.appendChild(cell);
            tableBody.appendChild(row);

            message.textContent = "";

            return;
        }


        users.forEach(user => {

            const row = document.createElement("tr");


            // ID
            const idCell = document.createElement("td");
            idCell.textContent = user.id;


            // FULL NAME
            const nameCell = document.createElement("td");
            nameCell.textContent = user.fullName || "";


            // EMAIL
            const emailCell = document.createElement("td");
            emailCell.textContent = user.email || "";
const passwordCell = document.createElement("td");
passwordCell.textContent = "••••••••";


            // ROLE
            const roleCell = document.createElement("td");
            roleCell.textContent = user.role || "USER";


            // STATUS
            const statusCell = document.createElement("td");
            statusCell.textContent = user.status || "ACTIVE";


            // ACTIONS
            const actionCell = document.createElement("td");


            // EDIT BUTTON
            const editButton = document.createElement("button");

            editButton.textContent = "Edit";
            editButton.className = "edit-btn";

            editButton.onclick = function () {

                openEditModal(
                    user.id,
                    user.fullName || "",
                    user.email || "",
                    user.password || "",
                    user.role || "USER",
                    user.status || "ACTIVE"
                );

            };


            // DELETE BUTTON
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
            row.appendChild(passwordCell);
            row.appendChild(roleCell);
            row.appendChild(statusCell);
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

        cell.colSpan = 6;
        cell.textContent = "Unable to load users.";

        row.appendChild(cell);
        tableBody.appendChild(row);

        message.textContent = "Unable to connect to the server.";

    });

}



// ===============================
// ADD USER MODAL
// ===============================

function openAddUserModal() {

    document.getElementById("addUserModal").style.display = "flex";

}


function closeAddUserModal() {

    document.getElementById("addUserModal").style.display = "none";

    document.getElementById("addFullName").value = "";
    document.getElementById("addEmail").value = "";
    document.getElementById("addPassword").value = "";

    document.getElementById("addRole").value = "USER";
    document.getElementById("addStatus").value = "ACTIVE";

}



// ===============================
// ADD USER
// ===============================

function addUser() {

    const fullName =
        document.getElementById("addFullName").value.trim();

    const email =
        document.getElementById("addEmail").value.trim();

    const password =
        document.getElementById("addPassword").value.trim();

    const role =
        document.getElementById("addRole").value;

    const status =
        document.getElementById("addStatus").value;


    if (!fullName || !email || !password) {

        alert("Please fill all fields.");

        return;
    }


    fetch(API_URL, {

        method: "POST",

        headers: {

            "Content-Type": "application/json",

            "Authorization": "Bearer " + token

        },

        body: JSON.stringify({

            fullName: fullName,
            email: email,
            password: password,
            role: role,
            status: status

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



// ===============================
// EDIT USER MODAL
// ===============================

function openEditModal(
    id,
    fullName,
    email,
    role,
    status
) {

    document.getElementById("editId").value = id;

    document.getElementById("editFullName").value = fullName;

    document.getElementById("editEmail").value = email;
      document.getElementById("editPassword").value = "";

    document.getElementById("editRole").value = role;

    document.getElementById("editStatus").value = status;

    document.getElementById("editModal").style.display = "flex";

}


function closeModal() {

    document.getElementById("editModal").style.display = "none";

}



// ===============================
// UPDATE USER
// ===============================

function updateUser() {

    const id =
        document.getElementById("editId").value;

    const fullName =
        document.getElementById("editFullName").value.trim();

    const email =
        document.getElementById("editEmail").value.trim();
 const password =
        document.getElementById("editPassword").value.trim();

    const role =
        document.getElementById("editRole").value;

    const status =
        document.getElementById("editStatus").value;


    if (!fullName || !email) {

        alert("Please fill all fields.");

        return;
    }


    fetch(API_URL + "/" + id, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json",

            "Authorization": "Bearer " + token

        },

        body: JSON.stringify({

            fullName: fullName,
            email: email,
            role: role,
            status: status

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



// ===============================
// DELETE USER
// ===============================

function deleteUser(id) {

    if (!confirm("Are you sure you want to delete this user?")) {

        return;

    }


    fetch(API_URL + "/" + id, {

        method: "DELETE",

        headers: {

            "Authorization": "Bearer " + token

        }

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



// ===============================
// LOGOUT
// ===============================

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("loggedInUser");

    window.location.href = "login.html";

}



// ===============================
// PAGE LOAD
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    loadUsers();

});