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

    data.medicines.forEach((data) => {
        renderTableRow(normaliseMedicine(data))
    })
})

function normaliseMedicine(data){
    if (!data || typeof data !== "object") {
        return {"price": 0, "name": "Unknown" }
    }

    const name = data.name || "Unknown"
    const price = data.price || 0

    return { "price": price, "name": name }
}

function renderTableRow(item) {
    const tbody = document.querySelector('#medicinesTable tbody');
    const tr = document.createElement('tr');

    const nameTd = document.createElement('td');
    const priceTd = document.createElement('td');

    if (item.name === "Unknown" || item.price === 0) {
        tr.classList.add("error-row");
        nameTd.title = "Invalid medicine data detected"
        priceTd.title = "Invalid medicine data detected"
    }

    nameTd.textContent = item.name;
    priceTd.textContent = "£" + Number(item.price).toFixed(2);

    tr.appendChild(nameTd);
    tr.appendChild(priceTd);

    tr.appendChild(priceTd);

    tbody.appendChild(tr);
}