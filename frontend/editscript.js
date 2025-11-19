window.onload = function() {
    loadMedicineForm();

    const form = document.querySelector('.form');
    form.addEventListener('submit', handleFormSubmit);
};

async function loadMedicineForm(){
    // Load data from URL
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    
    const data = await loadMedicine(name)

    // Set title
    const title = document.querySelector('.editTitle');
    title.textContent = "Editing '"+name+"'";
    title.className = "title"

    // Fill in default form value
    const medicinePriceInput = document.querySelector('#price');
    medicinePriceInput.value = data.price
}

function loadMedicine(name){
    // Fetch API data
    return fetch('http://localhost:8000/medicines/'+name)
    .then(response => {
        if (!response.ok){
            throw new Error(`responce status: ${response.status}`)
        }
        return response.json();
    })
    .then(data => {
        return normaliseMedicine(data)
    })
}

function normaliseMedicine(data){
    // Handle potentially invalid data from API
    if (!data || typeof data !== "object") {
        return {"price": 0, "name": "Unknown" }
    }

    const name = data.name || "Unknown"
    const price = data.price || 0

    return { "price": price, "name": name }
}

async function handleFormSubmit(e){
    // Load data from URL
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");

    // Get input price
    const priceInput = document.querySelector('#price');
    const price = priceInput.value.trim();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);

    // Send updated info to backend
    try {
        const response = await fetch('http://localhost:8000/update', {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Failed to update medicine");
        }

        alert("Medicine updated successfully");
        window.location.href = "index.html";

    } catch (err) {
        console.error(err);
        alert("Error updating medicine");
    }
}