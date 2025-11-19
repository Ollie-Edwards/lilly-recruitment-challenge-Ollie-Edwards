window.onload = function() {
    loadMedicines();
};

function loadMedicines(){
    fetch('http://localhost:8000/medicines')
    .then(response => {
        if (!response.ok){
            throw new Error(`responce status: ${response.status}`)
        }
        return response.json();
    })
    .then(data => {
        console.log("API result:", data);

        if (!Array.isArray(data.medicines)) {
        console.error("Expected data.medicines to be an array");
        return;
        }

        renderTable(data);
    })
}

function normaliseMedicine(data){
    if (!data || typeof data !== "object") {
        return {"price": 0, "name": "Unknown" }
    }

    const name = data.name || "Unknown"
    const price = data.price || 0

    return { "price": price, "name": name }
}

function renderTable(data){
    document.querySelectorAll("#medicinesTable tbody tr").forEach(row => row.remove());

    data.medicines.forEach((data) => {
        renderTableRow(normaliseMedicine(data))
    })
}

function renderTableRow(item) {
    const tbody = document.querySelector('#medicinesTable tbody');
    const tr = document.createElement('tr');

    const nameTd = document.createElement('td');
    const priceTd = document.createElement('td');

    const icon1Td = document.createElement('td');
    const icon2Td = document.createElement('td');

    if (item.name === "Unknown" || item.price === 0) {
        tr.classList.add("error-row");
        nameTd.title = "Invalid medicine data detected"
        priceTd.title = "Invalid medicine data detected"
    }

    nameTd.textContent = item.name;
    priceTd.textContent = "£" + Number(item.price).toFixed(2);

    // --- Delete Icon ---
    const delIcon = document.createElement('td');
    delIcon.innerHTML = '<span><i class="icon fa-solid fa-trash"></i></span>';

    const editIcon = document.createElement('td');
    editIcon.innerHTML = '<span><i class="icon fa-solid fa-pen-to-square"></i></span>';

    delIcon.addEventListener("click", () => {
        deleteItem(item.name);
    });

    editIcon.addEventListener("click", () => {
        window.location.href = `./edit.html?name=${encodeURIComponent(item.name)}`;
    });
    
    tr.appendChild(nameTd);
    tr.appendChild(priceTd);
    tr.appendChild(delIcon);
    tr.appendChild(editIcon);

    tbody.appendChild(tr);
}

async function deleteItem(name){
    const formData = new FormData();
    formData.append("name", name);

    const response = await fetch(`http://localhost:8000/delete`, {
        method: "DELETE",
        body: formData
    });

    loadMedicines()
}
