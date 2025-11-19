window.onload = function() {
    loadMedicineForm();
};

async function loadMedicineForm(){
    // Load data from URL
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    
    const data = await loadMedicine(name)
    console.log(data)

    // Set title
    const title = document.querySelector('.editTitle');
    title.textContent = "Editing '"+name+"'";
    title.className = "title"

    // Fill in default values
    const medicineNameInput = document.querySelector('#name');
    medicineNameInput.value = name

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