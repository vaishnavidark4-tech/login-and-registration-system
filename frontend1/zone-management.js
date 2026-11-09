
const ZONE_API = "http://localhost:8080/api/zones";
const BRAND_API = "http://localhost:8080/api/brands";
const CHAIN_API = "http://localhost:8080/api/chains";
const GROUP_API = "http://localhost:8080/api/groups";

let zones = [];
let brands = [];
let chains = [];
let groups = [];
let editingZoneId = null;

// DOM Elements
const zoneForm = document.getElementById("zoneForm");
const zoneName = document.getElementById("zoneName");
const brandSelect = document.getElementById("brandSelect");
const tableBody = document.getElementById("zoneTableBody");
const message = document.getElementById("message");

const brandFilter = document.getElementById("brandFilter");
const companyFilter = document.getElementById("companyFilter");
const groupFilter = document.getElementById("groupFilter");
const submitBtn = document.getElementById("submitBtn");

// Display messages
function showMessage(text, type) {
    message.textContent = text;
    message.className = type;

    setTimeout(() => {
        message.textContent = "";
        message.className = "";
    }, 3000);
}

// Load all data
async function loadData() {
    try {
        const responses = await Promise.all([
            fetch(ZONE_API),
            fetch(BRAND_API),
            fetch(CHAIN_API),
            fetch(GROUP_API)
        ]);

        if (responses.some(response => !response.ok)) {
            throw new Error("Unable to load management data");
        }

        zones = await responses[0].json();
        brands = await responses[1].json();
        chains = await responses[2].json();
        groups = await responses[3].json();

        loadBrandDropdown();
        loadFilters();
        updateDashboard();
        displayZones();

    } catch (error) {
        console.error("Loading error:", error);
        tableBody.innerHTML =
            `<tr><td colspan="7">Unable to load data. Check backend connection.</td></tr>`;

        showMessage(error.message, "error");
    }
}

// Load brands into dropdown
function loadBrandDropdown() {
    brandSelect.innerHTML = '<option value="">Select Brand</option>';

    brands.forEach(brand => {
        const option = document.createElement("option");
        option.value = brand.brandId;
        option.textContent = brand.brandName;
        brandSelect.appendChild(option);
    });
}

// Load filter dropdowns
function loadFilters() {
    brandFilter.innerHTML = '<option value="">All Brands</option>';
    companyFilter.innerHTML = '<option value="">All Companies</option>';
    groupFilter.innerHTML = '<option value="">All Groups</option>';

    brands.forEach(brand => {
        const option = document.createElement("option");
        option.value = brand.brandId;
        option.textContent = brand.brandName;
        brandFilter.appendChild(option);
    });

    chains.forEach(chain => {
        const option = document.createElement("option");
        option.value = chain.companyName;
        option.textContent = chain.companyName;
        companyFilter.appendChild(option);
    });

    groups.forEach(group => {
        const option = document.createElement("option");
        option.value = group.id;
        option.textContent = group.name;
        groupFilter.appendChild(option);
    });
}

// Update dashboard counts
function updateDashboard() {
    document.getElementById("totalGroups").textContent = groups.length;
    document.getElementById("totalChains").textContent = chains.length;
    document.getElementById("totalBrands").textContent = brands.length;
    document.getElementById("totalZones").textContent = zones.length;
}

// Display zones
function displayZones() {
    tableBody.innerHTML = "";

    const selectedBrand = brandFilter.value;
    const selectedCompany = companyFilter.value;
    const selectedGroup = groupFilter.value;

    const filteredZones = zones.filter(zone => {
        const brand = zone.brand;
        const chain = brand?.chain;
        const group = chain?.group;

        const brandMatch =
            !selectedBrand ||
            String(brand?.brandId) === selectedBrand;

        const companyMatch =
            !selectedCompany ||
            chain?.companyName === selectedCompany;

        const groupMatch =
            !selectedGroup ||
            String(group?.id) === selectedGroup;

        return brandMatch && companyMatch && groupMatch;
    });

    if (filteredZones.length === 0) {
        tableBody.innerHTML =
            `<tr><td colspan="7">No zones found.</td></tr>`;
        return;
    }

    filteredZones.forEach((zone, index) => {
        const brand = zone.brand;
        const chain = brand?.chain;
        const group = chain?.group;

        const row = document.createElement("tr");

        const values = [
            index + 1,
            zone.zoneName,
            brand?.brandName || "N/A",
            chain?.companyName || "N/A",
            group?.name || "N/A"
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const editCell = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";
        editButton.addEventListener("click", () => editZone(zone));
        editCell.appendChild(editButton);
        row.appendChild(editCell);

        const deleteCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.addEventListener("click", () => deleteZone(zone.zoneId));
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);

        tableBody.appendChild(row);
    });
}

// Add or update zone
zoneForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = zoneName.value.trim();
    const brandId = brandSelect.value;

    if (!name || !brandId) {
        showMessage("Please enter zone name and select a brand.", "error");
        return;
    }

    const zoneData = {
        zoneName: name,
        brand: {
            brandId: Number(brandId)
        }
    };

    const isEditing = editingZoneId !== null;

    const url = isEditing
        ? `${ZONE_API}/${editingZoneId}`
        : ZONE_API;

    const method = isEditing ? "PUT" : "POST";

    try {
        submitBtn.disabled = true;

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(zoneData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Operation failed");
        }

        showMessage(
            isEditing ? "Zone updated successfully!" : "Zone added successfully!",
            "success"
        );

        resetForm();
        await loadData();

    } catch (error) {
        console.error("Save error:", error);
        showMessage(error.message, "error");
    } finally {
        submitBtn.disabled = false;
    }
});

// Edit zone
function editZone(zone) {
    editingZoneId = zone.zoneId;

    zoneName.value = zone.zoneName;
    brandSelect.value = zone.brand?.brandId || "";

    submitBtn.textContent = "Update Zone";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Delete zone
async function deleteZone(id) {
    if (!confirm("Are you sure you want to delete this zone?")) {
        return;
    }

    try {
        const response = await fetch(`${ZONE_API}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Unable to delete zone");
        }

        showMessage("Zone deleted successfully!", "success");

        if (editingZoneId === id) {
            resetForm();
        }

        await loadData();

    } catch (error) {
        console.error("Delete error:", error);
        showMessage(error.message, "error");
    }
}

// Reset form
function resetForm() {
    zoneForm.reset();
    editingZoneId = null;
    submitBtn.textContent = "Add Zone";
}

// Filter events
brandFilter.addEventListener("change", displayZones);
companyFilter.addEventListener("change", displayZones);
groupFilter.addEventListener("change", displayZones);

// Reset filters
document.getElementById("resetFilters").addEventListener("click", () => {
    brandFilter.value = "";
    companyFilter.value = "";
    groupFilter.value = "";
    displayZones();
});

// Initialize page
loadData();
