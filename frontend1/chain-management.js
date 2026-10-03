const API_URL = "http://localhost:8080/api/chains";
const GROUPS_API_URL = "http://localhost:8080/api/groups";

const addChainButton = document.getElementById("addChainButton");

const chainFormContainer =
    document.getElementById("chainFormContainer");

const chainForm =
    document.getElementById("chainForm");

const formTitle =
    document.getElementById("formTitle");

const chainId =
    document.getElementById("chainId");

const companyName =
    document.getElementById("companyName");

const gstn =
    document.getElementById("gstn");

const group =
    document.getElementById("group");

const groupFilter =
    document.getElementById("groupFilter");

const cancelButton =
    document.getElementById("cancelButton");

const chainsTableBody =
    document.getElementById("chainsTableBody");

const message =
    document.getElementById("message");


// ===============================
// Load page
// ===============================

document.addEventListener("DOMContentLoaded", async () => {
    await loadGroups();
    await loadChains();
});


// ===============================
// Show message
// ===============================

function showMessage(text, isError = false) {

    message.textContent = text;

    message.className =
        isError ? "error-message" : "success-message";

    setTimeout(() => {
        message.textContent = "";
        message.className = "";
    }, 3000);
}


// ===============================
// Load Groups
// ===============================

async function loadGroups() {

    try {

        const response = await fetch(GROUPS_API_URL);

        if (!response.ok) {
            throw new Error("Unable to load groups");
        }

        const groups = await response.json();

        group.innerHTML =
            `<option value="">Select Group</option>`;

        groupFilter.innerHTML =
            `<option value="">All Groups</option>`;

        groups.forEach(g => {

            const option = document.createElement("option");

            option.value = g.id;
            option.textContent = g.name;

            group.appendChild(option);


            const filterOption =
                document.createElement("option");

            filterOption.value = g.id;
            filterOption.textContent = g.name;

            groupFilter.appendChild(filterOption);

        });

    } catch (error) {
        showMessage("Error loading groups", true);
    }
}
async function loadChains() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to load chains");
        }

        const chains = await response.json();

        displayChains(chains);

    } catch (error) {
        console.error(error);
        showMessage("Unable to load chains.", true);
    }
}
function displayChains(chains) {

    chainsTableBody.innerHTML = "";

    if (chains.length === 0) {

        chainsTableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    No chain records found.
                </td>
            </tr>
        `;

        return;
    }

    chains.forEach(chain => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${chain.id}</td>
            <td>${chain.companyName}</td>
            <td>${chain.gstn}</td>
            <td>${chain.group ? chain.group.name : "-"}</td>
            <td>
                <button class="edit-btn" onclick="editChain(${chain.id})">
                    Edit
                </button>

                <button class="delete-btn" onclick="deleteChain(${chain.id})">
                    Delete
                </button>
            </td>
        `;

        chainsTableBody.appendChild(row);
    });
}
addChainButton.addEventListener("click", () => {

    formTitle.textContent = "Add Chain";

    chainId.value = "";

    companyName.value = "";

    gstn.value = "";

    group.value = "";

    chainFormContainer.classList.remove("hidden");
});
chainForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const company = companyName.value.trim();
    const gst = gstn.value.trim();
    const selectedGroup = group.value;

    // Validation
    if (!company) {
        showMessage("Company name is required.", true);
        return;
    }

    if (!gst) {
        showMessage("GSTN is required.", true);
        return;
    }

    if (!selectedGroup) {
        showMessage("Please select a group.", true);
        return;
    }

    // Data to send to backend
    const chainData = {
        companyName: company,
        gstn: gst,
        group: {
            id: Number(selectedGroup)
        }
    };

    try {

       let response;

if (chainId.value) {

    response = await fetch(`${API_URL}/${chainId.value}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(chainData)
    });

} else {

    response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(chainData)
    });
}

        if (!response.ok) {

            const errorText = await response.text();

            if (errorText.toLowerCase().includes("gstn already exists")) {
                showMessage("GSTN already exists.", true);
                return;
            }

            throw new Error("Unable to save chain.");
        }

        if (chainId.value) {
    showMessage("Chain updated successfully!");
} else {
    showMessage("Chain added successfully!");
}

        // Clear form
        chainForm.reset();
        chainId.value = "";

        // Hide form
        chainFormContainer.classList.add("hidden");

        // Refresh table
        await loadChains();

    } catch (error) {

        console.error(error);

        showMessage("Unable to save chain.", true);
    }
});
groupFilter.addEventListener("change", async function () {

    const selectedGroupId = this.value;
    console.log("Selected Group ID:", selectedGroupId);

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to load chains");
        }

        const chains = await response.json();
        console.log("Chains:", chains);

        // If All Groups is selected
        if (!selectedGroupId) {
            displayChains(chains);
            return;
        }

        // Filter chains by group
        const filteredChains = chains.filter(chain =>
            chain.group &&
            String(chain.group.id) === String(selectedGroupId)
        );

        displayChains(filteredChains);

    } catch (error) {

        console.error(error);

        showMessage("Unable to filter chains.", true);
    }
});async function editChain(id) {

    try {

        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
            throw new Error("Unable to load chain.");
        }

        const chain = await response.json();

        chainId.value = chain.id;
        companyName.value = chain.companyName;
        gstn.value = chain.gstn;
        group.value = chain.group ? chain.group.id : "";

        formTitle.textContent = "Edit Chain";

        chainFormContainer.classList.remove("hidden");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        console.error(error);

        showMessage("Unable to load chain.", true);
    }
}
async function deleteChain(id) {
    const confirmed = confirm("Are you sure you want to delete this chain?");

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete chain");
        }

        showMessage("Chain deleted successfully!");

        await loadChains();

    } catch (error) {
        console.error(error);
        showMessage("Unable to delete chain.", true);
    }
}