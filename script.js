// Load records from localStorage on page load
document.addEventListener('DOMContentLoaded', loadRecords);

// Get elements
const form = document.getElementById('attendanceForm');
const tableBody = document.querySelector('#recordsTable tbody');
const clearBtn = document.getElementById('clearRecords');

// Handle form submission
form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const studentName = document.getElementById('student-name').value.trim();
    const date = document.getElementById('date').value;
    const status = document.getElementById('status').value;
    
    if (!studentName || !date || !status) {
        alert('Please fill in all fields.');
        return;
    }
    
    // Create record object
    const record = { studentName, date, status, id: Date.now() };
    
    // Save to localStorage
    saveRecord(record);
    
    // Add to table
    addRecordToTable(record);
    
    // Update summary
    updateSummary();
    
    // Clear form
    form.reset();
});

// Add record to table
function addRecordToTable(record) {
    const row = document.createElement('tr');
    row.setAttribute('data-id', record.id);
    row.innerHTML = `
        <td>${record.studentName}</td>
        <td>${record.date}</td>
        <td>${record.status.charAt(0).toUpperCase() + record.status.slice(1)}</td>
        <td><button class="delete-btn" onclick="deleteRecord(${record.id})">Delete</button></td>
    `;
    tableBody.appendChild(row);
}

// Save record to localStorage
function saveRecord(record) {
    const records = getRecords();
    records.push(record);
    localStorage.setItem('attendanceRecords', JSON.stringify(records));
}

// Get records from localStorage
function getRecords() {
    return JSON.parse(localStorage.getItem('attendanceRecords')) || [];
}

// Load and display records
function loadRecords() {
    const records = getRecords();
    records.forEach(addRecordToTable);
    updateSummary();
}

// Delete a record
function deleteRecord(id) {
    if (confirm('Are you sure you want to delete this record?')) {
        // Remove from localStorage
        let records = getRecords();
        records = records.filter(record => record.id !== id);
        localStorage.setItem('attendanceRecords', JSON.stringify(records));
        
        // Remove from table
        const row = document.querySelector(`tr[data-id="${id}"]`);
        if (row) row.remove();
        
        // Update summary
        updateSummary();
    }
}

// Clear all records
clearBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all records?')) {
        localStorage.removeItem('attendanceRecords');
        tableBody.innerHTML = '';
        updateSummary();
    }
});

// Update summary counts
function updateSummary() {
    const records = getRecords();
    const total = records.length;
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    
    document.getElementById('totalRecords').textContent = total;
    document.getElementById('presentCount').textContent = present;
    document.getElementById('absentCount').textContent = absent;
}