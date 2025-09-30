document.addEventListener("DOMContentLoaded", function() {
    // 8 categories // 
    const NUM_OF_ROWS = 8;
    const ROW_NAMES = [
        "Safety Training",
        "Health & First Aid",
        "Admin Procedures",
        "Child Nutrition & Hygiene",
        "Child Development / Observation",
        "Child Activity Supervision",
        "Consultation Techniques"
    ];

    // Distribute Hours and Print Button //
    const distributeBtn = document.getElementById("distribute-button");
    const printBtn = document.getElementById("print-button");

    // Month and Day Selectors //
    const monthSelect = document.getElementById("month-select");
    const daySelect = document.getElementById("day-select");

    // Table Elements //
    const tableContainer = document.getElementById("table-container");
    const mainTable = document.getElementById("main-table");
    const tableHead = document.getElementById("table-head");
    const tableBody = document.getElementById("table-body");


    // Event Listeners //
    
    distributeBtn.addEventListener("click", timeDistribution);
    tableBody.addEventListener("input", generateTable)
    printBtn.addEventListener("click", () => window.print());


});