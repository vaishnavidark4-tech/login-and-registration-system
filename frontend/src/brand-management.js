
const API_URL = "http://localhost:8080/api/brands";
const CHAINS_API_URL = "http://localhost:8080/api/chains";

const brandForm = document.getElementById("brandForm");
const brandId = document.getElementById("brandId");
const brandName = document.getElementById("brandName");
const chainId = document.getElementById("chainId");
const isActive = document.getElementById("isActive");
const brandTableBody = document.getElementById("brandTableBody");
const filterChain = document.getElementById("filterChain");
const message = document.getElementById("message");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

let brands = [];
let chains = [];

document.addEventListener("DOMContentLoaded", async () => {
    await loadChains();
    await loadBrands();
});

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// Load chains from backend
async function loadChains() {
    try {
        const response = await fetch(CHAINS_API_URL);

        if (!response.ok) {
            throw new Error("Unable to load chains");
        }

        chains = await response.json();

        chainId.innerHTML = '<option value="">Select Chain</option>';
        filterChain.innerHTML = '<option value="">All Chains</option>';

        chains.forEach(chain => {
            const option = document.createElement("option");
            option.value = chain.id;
            option.textContent = chain.companyName;
            chainId.appendChild(option);

            const filterOption = document.createElement("option");
            filterOption.value = chain.id;
            filterOption.textContent = chain.companyName;
            filterChain.appendChild(filterOption);
        });

    } catch (error) {
        showMessage(error.message, true);
    }
}

// Load brands from backend
async function loadBrands() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to load brands");
        }

        brands = await response.json();
        displayBrands();

    } catch (error) {
        brandTableBody.innerHTML =
            '<tr><td colspan="5">Unable to load brands.</td></tr>';
        showMessage(error.message, true);
    }
}

// Display brand records
function displayBrands() {
    const selectedChain = filterChain.value;

    const filteredBrands = brands.filter(brand => {
        return !selectedChain ||
            String(brand.chain?.id) === selectedChain;
    });

    brandTableBody.innerHTML = "";

    if (filteredBrands.length === 0) {
        brandTableBody.innerHTML =
            '<tr><td colspan="5">No brands found.</td></tr>';
        return;
    }

    filteredBrands.forEach(brand => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(brand.brandId)}</td>
            <td>${escapeHTML(brand.brandName)}</td>
            <td>${escapeHTML(brand.chain?.companyName || "N/A")}</td>
            <td>${brand.isActive ? "Active" : "Inactive"}</td>
            <td>
                <button class="edit-btn"
                    onclick="editBrand(${Number(brand.brandId)})">
                    Edit
                </button>
                <button class="delete-btn"
                    onclick="deleteBrand(${Number(brand.brandId)})">
                    Delete
                </button>
            </td>
        `;

        brandTableBody.appendChild(row);
    });
}

// Add or update brand
brandForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = brandName.value.trim();
    const selectedChain = chainId.value;

    if (!name) {
        showMessage("Brand name is required.", true);
        return;
    }

    if (!selectedChain) {
        showMessage("Please select a chain.", true);
        return;
    }

    const brandData = {
        brandName: name,
        chain: {
            id: Number(selectedChain)
        },
        isActive: isActive.value === "true"
    };

    try {
        const id = brandId.value;

        const response = await fetch(
            id ? `${API_URL}/${id}` : API_URL,
            {
                method: id ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(brandData)
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Unable to save brand.");
        }

        showMessage(
            id ? "Brand updated successfully!" :
                 "Brand added successfully."
        );

        resetForm();
        await loadBrands();

    } catch (error) {
        showMessage(error.message, true);
    }
});

// Edit brand
async function editBrand(id) {
    const brand = brands.find(item => item.brandId === id);

    if (!brand) {
        showMessage("Brand not found.", true);
        return;
    }

    brandId.value = brand.brandId;
    brandName.value = brand.brandName;
    chainId.value = brand.chain?.id ?? "";
    isActive.value = String(brand.isActive);

    formTitle.textContent = "Edit Brand";
    submitBtn.textContent = "Update Brand";
    cancelBtn.hidden = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Delete brand
async function deleteBrand(id) {
    if (!confirm("Are you sure you want to delete this brand?")) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Unable to delete brand.");
        }

        showMessage("Brand deleted successfully.");
        await loadBrands();

    } catch (error) {
        showMessage(error.message, true);
    }
}

// Filter brands by chain
filterChain.addEventListener("change", displayBrands);

// Reset form
function resetForm() {
    brandForm.reset();
    brandId.value = "";
    formTitle.textContent = "Add New Brand";
    submitBtn.textContent = "Add Brand";
    cancelBtn.hidden = true;
}

cancelBtn.addEventListener("click", resetForm);

// Display messages
function showMessage(text, isError = false) {
    message.textContent = text;
    message.style.color = isError ? "red" : "green";
}
