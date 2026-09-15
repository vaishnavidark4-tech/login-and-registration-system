const API_URL = "http://localhost:8080/api/groups";
const USERS_API_URL = "http://localhost:8080/api/users";


/* =========================
   PAGE ELEMENTS
   ========================= */

const groupsContainer =
    document.getElementById("groupsContainer");

const loadingMessage =
    document.getElementById("loadingMessage");

const errorMessage =
    document.getElementById("errorMessage");

const addGroupButton =
    document.getElementById("addGroupButton");

const groupFormContainer =
    document.getElementById("groupFormContainer");

const groupForm =
    document.getElementById("groupForm");

const cancelGroupButton =
    document.getElementById("cancelGroupButton");

const formTitle =
    document.getElementById("formTitle");

const groupId =
    document.getElementById("groupId");

const groupName =
    document.getElementById("groupName");

const groupDescription =
    document.getElementById("groupDescription");

const groupStatus =
    document.getElementById("groupStatus");

const logoutButton =
    document.getElementById("logoutButton");


/* =========================
   MEMBER MODAL ELEMENTS
   ========================= */

const memberModal =
    document.getElementById("memberModal");

const closeMemberModal =
    document.getElementById("closeMemberModal");

const memberModalTitle =
    document.getElementById("memberModalTitle");

const memberModalSubtitle =
    document.getElementById("memberModalSubtitle");

const membersList =
    document.getElementById("membersList");

const userSelect =
    document.getElementById("userSelect");

const addMemberButton =
    document.getElementById("addMemberButton");

const memberMessage =
    document.getElementById("memberMessage");

let currentGroupId = null;


/* =========================
   LOAD GROUPS
   ========================= */

async function loadGroups() {

    loadingMessage.classList.remove("hidden");

    errorMessage.classList.add("hidden");

    try {

        const response =
            await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                "Unable to load groups"
            );
        }

        const groups =
            await response.json();

        displayGroups(groups);

    } catch (error) {

        console.error(error);

        errorMessage.textContent =
            "Unable to load groups. Please make sure the backend is running.";

        errorMessage.classList.remove(
            "hidden"
        );

    } finally {

        loadingMessage.classList.add(
            "hidden"
        );
    }
}


/* =========================
   DISPLAY GROUPS
   ========================= */

function displayGroups(groups) {

    groupsContainer.innerHTML = "";

    if (groups.length === 0) {

        groupsContainer.innerHTML = `
            <div class="message">
                No groups found. Create your first group.
            </div>
        `;

        return;
    }

    groups.forEach(group => {

        const memberCount =
            group.members
                ? group.members.length
                : 0;

        const statusClass =
            group.status === "Active"
                ? "status-active"
                : "status-inactive";

        const card =
            document.createElement("div");

        card.className =
            "group-card";

        card.innerHTML = `
            <h3>
                ${escapeHtml(group.name)}
            </h3>

            <p class="group-description">
                ${escapeHtml(
                    group.description ||
                    "No description"
                )}
            </p>

            <div class="group-info">

                <span>
                    Members: ${memberCount}
                </span>

                <span class="${statusClass}">
                    ${escapeHtml(
                        group.status ||
                        "Unknown"
                    )}
                </span>

            </div>

            <div class="group-actions">

                <button
                    class="view-button"
                    onclick="viewGroup(${group.id})">
                    View
                </button>

                <button
                    class="edit-button"
                    onclick="editGroup(${group.id})">
                    Edit
                </button>

                <button
                    class="delete-button"
                    onclick="deleteGroup(${group.id})">
                    Delete
                </button>

                <button
                    class="member-button"
                    onclick="manageMembers(${group.id})">
                    Members
                </button>

            </div>
        `;

        groupsContainer.appendChild(card);
    });
}


/* =========================
   CREATE GROUP BUTTON
   ========================= */

addGroupButton.addEventListener(
    "click",
    () => {

        formTitle.textContent =
            "Create Group";

        groupForm.reset();

        groupId.value = "";

        groupStatus.value =
            "Active";

        groupFormContainer.classList.remove(
            "hidden"
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
);


/* =========================
   CANCEL GROUP FORM
   ========================= */

cancelGroupButton.addEventListener(
    "click",
    () => {

        groupForm.reset();

        groupId.value = "";

        groupFormContainer.classList.add(
            "hidden"
        );
    }
);


/* =========================
   CREATE / UPDATE GROUP
   ========================= */

groupForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const id =
            groupId.value;

        const groupData = {

            name:
                groupName.value.trim(),

            description:
                groupDescription.value.trim(),

            status:
                groupStatus.value,

            createdAt:
                new Date()
                    .toISOString()
                    .split("T")[0]
        };


        try {

            let response;


            /* UPDATE */

            if (id) {

                response =
                    await fetch(
                        `${API_URL}/${id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    groupData
                                )
                        }
                    );

            }


            /* CREATE */

            else {

                response =
                    await fetch(
                        API_URL,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    groupData
                                )
                        }
                    );
            }


            if (!response.ok) {

                throw new Error(
                    id
                        ? "Failed to update group"
                        : "Failed to create group"
                );
            }


            alert(
                id
                    ? "Group updated successfully!"
                    : "Group created successfully!"
            );


            groupForm.reset();

            groupId.value = "";

            groupFormContainer.classList.add(
                "hidden"
            );


            await loadGroups();

        } catch (error) {

            console.error(error);

            alert(error.message);
        }
    }
);


/* =========================
   VIEW GROUP
   ========================= */

async function viewGroup(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/${id}`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to get group"
            );
        }


        const group =
            await response.json();


        const memberCount =
            group.members
                ? group.members.length
                : 0;


        alert(
            `Group Details\n\n` +
            `ID: ${group.id}\n` +
            `Name: ${group.name}\n` +
            `Description: ${
                group.description ||
                "N/A"
            }\n` +
            `Status: ${
                group.status ||
                "N/A"
            }\n` +
            `Members: ${memberCount}`
        );

    } catch (error) {

        console.error(error);

        alert(
            "Unable to load group details."
        );
    }
}


/* =========================
   EDIT GROUP
   ========================= */

async function editGroup(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/${id}`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to get group"
            );
        }


        const group =
            await response.json();


        formTitle.textContent =
            "Edit Group";


        groupId.value =
            group.id;


        groupName.value =
            group.name || "";


        groupDescription.value =
            group.description || "";


        groupStatus.value =
            group.status ||
            "Active";


        groupFormContainer.classList.remove(
            "hidden"
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        console.error(error);

        alert(
            "Unable to load group for editing."
        );
    }
}


/* =========================
   DELETE GROUP
   ========================= */

async function deleteGroup(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this group?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to delete group"
            );
        }


        alert(
            "Group deleted successfully!"
        );


        await loadGroups();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete group."
        );
    }
}


/* =========================
   OPEN MEMBER MANAGEMENT
   ========================= */

async function manageMembers(id) {

    currentGroupId = id;


    memberMessage.classList.add(
        "hidden"
    );


    memberModal.classList.remove(
        "hidden"
    );


    membersList.innerHTML = `
        <p class="member-empty">
            Loading members...
        </p>
    `;


    userSelect.innerHTML = `
        <option value="">
            Loading users...
        </option>
    `;


    /* Load current members */

    try {

        await loadGroupMembers(id);

    } catch (error) {

        console.error(
            "Member loading error:",
            error
        );


        membersList.innerHTML = `
            <p class="member-empty">
                Unable to load members.
            </p>
        `;
    }


    /* Load available users */

    try {

        await loadUsers(id);

    } catch (error) {

        console.error(
            "User loading error:",
            error
        );


        userSelect.innerHTML = `
            <option value="">
                Unable to load users
            </option>
        `;
    }
}


/* =========================
   LOAD GROUP MEMBERS
   ========================= */

async function loadGroupMembers(id) {

    const response =
        await fetch(
            `${API_URL}/${id}`
        );


    if (!response.ok) {

        throw new Error(
            "Unable to load group"
        );
    }


    const group =
        await response.json();


    memberModalTitle.textContent =
        `Members — ${group.name}`;


    memberModalSubtitle.textContent =
        `Manage members of ${group.name}`;


    displayMembers(
        group.members || []
    );
}


/* =========================
   DISPLAY MEMBERS
   ========================= */

function displayMembers(members) {

    membersList.innerHTML = "";


    if (members.length === 0) {

        membersList.innerHTML = `
            <p class="member-empty">
                No members in this group yet.
            </p>
        `;

        return;
    }


    members.forEach(user => {

        const memberCard =
            document.createElement("div");


        memberCard.className =
            "member-card";


        memberCard.innerHTML = `

            <div class="member-details">

                <h4>
                    ${escapeHtml(
                        user.fullName ||
                        "Unknown User"
                    )}
                </h4>

                <p>
                    ${escapeHtml(
                        user.email ||
                        "No email"
                    )}
                </p>

                <p>
                    Role:
                    ${escapeHtml(
                        user.role ||
                        "N/A"
                    )}
                    |
                    Status:
                    ${escapeHtml(
                        user.status ||
                        "N/A"
                    )}
                </p>

            </div>


            <button
                class="remove-member-button"
                onclick="removeMember(
                    ${currentGroupId},
                    ${user.id}
                )">

                Remove

            </button>
        `;


        membersList.appendChild(
            memberCard
        );
    });
}


/* =========================
   LOAD AVAILABLE USERS
   ========================= */

async function loadUsers(groupId) {

    /*
     * Get JWT token from login.
     */

   const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
const token = loggedInUser?.token;

if (!token) {
    throw new Error("Login session expired. Please login again.");
}

    /*
     * Get all users.
     *
     * /api/users requires JWT.
     */

    const response =
        await fetch(
            USERS_API_URL,
            {
                method: "GET",

                headers: {
                    "Authorization":
                        "Bearer " + token,

                    "Content-Type":
                        "application/json"
                }
            }
        );


    console.log(
        "Users API status:",
        response.status
    );


    if (!response.ok) {

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            throw new Error(
                "You are not authorized to load users. Please login again."
            );
        }


        throw new Error(
            "Unable to load users"
        );
    }


    const users =
        await response.json();


    console.log(
        "Users loaded:",
        users
    );


    /*
     * Get current group.
     */

    const groupResponse =
        await fetch(
            `${API_URL}/${groupId}`
        );


    if (!groupResponse.ok) {

        throw new Error(
            "Unable to load group"
        );
    }


    const group =
        await groupResponse.json();


    /*
     * Get IDs of existing members.
     */

    const existingMemberIds =
        new Set(
            (group.members || [])
                .map(user => user.id)
        );


    /*
     * Reset dropdown.
     */

    userSelect.innerHTML = `
        <option value="">
            Select a user
        </option>
    `;


    let availableUsers = 0;


    /*
     * Add users who are not
     * already members.
     */

    users.forEach(user => {

        if (
            !existingMemberIds.has(
                user.id
            )
        ) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                user.id;


            option.textContent =
                `${user.fullName} (${user.email})`;


            userSelect.appendChild(
                option
            );


            availableUsers++;
        }
    });


    /*
     * No users available.
     */

    if (availableUsers === 0) {

        userSelect.innerHTML = `
            <option value="">
                No available users
            </option>
        `;
    }
}


/* =========================
   ADD MEMBER
   ========================= */

addMemberButton.addEventListener(
    "click",
    async () => {

        const userId =
            userSelect.value;


        if (!userId) {

            showMemberMessage(
                "Please select a user.",
                true
            );

            return;
        }


        try {

            addMemberButton.disabled =
                true;


            const response =
                await fetch(
                    `${API_URL}/${currentGroupId}/members/${userId}`,
                    {
                        method: "POST"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Failed to add member"
                );
            }


            showMemberMessage(
                "Member added successfully!",
                false
            );


            await loadGroupMembers(
                currentGroupId
            );


            await loadUsers(
                currentGroupId
            );


            await loadGroups();

        } catch (error) {

            console.error(error);


            showMemberMessage(
                error.message ||
                "Unable to add member.",
                true
            );

        } finally {

            addMemberButton.disabled =
                false;
        }
    }
);


/* =========================
   REMOVE MEMBER
   ========================= */

async function removeMember(
    groupId,
    userId
) {

    const confirmed =
        confirm(
            "Are you sure you want to remove this member?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${groupId}/members/${userId}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to remove member"
            );
        }


        showMemberMessage(
            "Member removed successfully!",
            false
        );


        await loadGroupMembers(
            groupId
        );


        await loadUsers(
            groupId
        );


        await loadGroups();

    } catch (error) {

        console.error(error);


        showMemberMessage(
            error.message ||
            "Unable to remove member.",
            true
        );
    }
}


/* =========================
   MEMBER MESSAGE
   ========================= */

function showMemberMessage(
    message,
    isError
) {

    memberMessage.textContent =
        message;


    memberMessage.classList.remove(
        "hidden"
    );


    if (isError) {

        memberMessage.classList.add(
            "error"
        );

    } else {

        memberMessage.classList.remove(
            "error"
        );
    }
}


/* =========================
   CLOSE MEMBER MODAL
   ========================= */

closeMemberModal.addEventListener(
    "click",
    () => {

        memberModal.classList.add(
            "hidden"
        );


        currentGroupId = null;
    }
);


/* =========================
   CLOSE MODAL OUTSIDE
   ========================= */

memberModal.addEventListener(
    "click",
    (event) => {

        if (
            event.target === memberModal
        ) {

            memberModal.classList.add(
                "hidden"
            );


            currentGroupId = null;
        }
    }
);


/* =========================
   ESCAPE HTML
   ========================= */

function escapeHtml(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value;


    return div.innerHTML;
}


/* =========================
   LOGOUT
   ========================= */

logoutButton.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "token"
        );


        window.location.href =
            "login.html";
    }
);


/* =========================
   INITIAL LOAD
   ========================= */

loadGroups();