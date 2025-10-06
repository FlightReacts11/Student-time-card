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
        "Consultation Techniques",
        "Professionalism"
    ];

    // Distribute Hours and Print Button //
    const distributeBtn = document.getElementById("distribute-button");
    const printBtn = document.getElementById("print-button");

    // Month and Day Selectors //
    const monthSelect = document.getElementById("month-select");
    const daySelect = document.getElementById("day-select");

    // Pulls the day from my HTML select tag since its not using a loop for that //
    let selectedDay = daySelect.value;

    // Table Elements //
    const tableContainer = document.getElementById("table-container");
    const mainTable = document.getElementById("main-table");
    const tableHead = document.getElementById("table-head");
    const tableBody = document.getElementById("table-body");


    // Event Listeners //
    
    distributeBtn.addEventListener("click", timeDistribution);
    tableBody.addEventListener("input", updateValues);
    printBtn.addEventListener("click", () => window.print());


    // Table generation for .innerHTML //

    function generateTable() {
        tableHead.innerHTML = '';
        tableBody.innerHTML = '';

        const selectedMonth = monthSelect.value;

        generateHeader();
        daysInMonth(daySelect);
        monthsInYear(monthSelect);
        updateValues();
    }

    // Geneerate Header // 

    function generateHeader() {
        const headerRow = document.createElement('tr');
        let headerHTML = `<th class="p-2 border border-light text-left font-semibold text-label">Day</th>`;
        ACTIVITY_NAMES.forEach(name => {
            headerHTML += `th class="p-2 border border-light font-semibold text-label text-center">${name}</th>`;
        });
        headerHTML += `<th class="p-2 border border-light font-semibold text-total-hours">Daily Total Hours</th>`;
        headerHTML += `<th class="p-2 border border-light font-semibold text-total-mins">Daily Total Mins</th>`;

        headerRow.innerHTML = headerHTML;
         tableHead.appendChild(headerRow);
    }

    // For Loop that determines number of days in the month. 31 is set as a normal month //
    function daysInMonth() {
        for (let day = 1; day <= 31; day++) {
            const shortMonth = day > daysInMonth;
            const row = document.createElement('tr');
            row.classList.add('border-b', 'border-light');
            if (isInactive) row.classList.add('inactive-row', 'text-disabled');

            let rowHTML = `<td class="p-2 border border-light font-medium">${day}</td>`;

            for (let i = 0; i < NUM_ACTIVITY_ROWS; i++) {
            rowHTML += `<td class="p-1 border border-light ${isInactive ? 'inactive-cell' : ''}">
             <input type="number" min="0" class="w-full text-center bg-transparent focus:outline-none focus-highlight table-cell-input p-1" ${isInactive ? 'disabled' : ''} data-day="${day}" data-activity="${i}">
             </td>`;
            }

            rowHTML += `<td class="p-2 border border-light font-bold text-center text-total-hours" id="day-hr-total-${day}">0.00</td>`;
            rowHTML += `<td class="p-2 border border-light font-bold text-center text-total-mins" id="day-min-total-${day}">0</td>`;
            row.innerHTML = rowHTML;
            tableBody.appendChild(row);

            generateTotalRows();

        }
    }
    

    // Bottom Row For Totals. Minutes first then hours //
    function generateTotalRows() {
    const bottomRow = document.createElement('tr');
    bottomRow.classList.add('font-bold', 'total-row-bg', 'print-total-row');
    let activityMinHTML = `<td class="p-2 border border-medium text-left">Activity Total (Mins)</td>`;
    for (let i = 0; i < NUM_ACTIVITY_ROWS; i++) {
        activityMinHTML += `<td class="p-2 border border-medium text-center" id="activity-hr-total-${i}">0.00</td>`;
    }
    activityMinHTML += `<td class="p-2 border border-medium text-center grand-total-hours" id="grand-hr-total">0.00</td>`;
    activityMinHTML += `<td class="p-2 border border-medium text-center grand-total-mins" id="grand-min-total">0</td>`;
    activityMinRow.innerHTML = activityMinHTML;
    tableBody.appendChild(bottomRow);

    const activityHourRow = document.createElement('tr');
    activityHourRow.classList.add('font-bold', 'total-row-bg', 'print-total-row');
    let activityHourHTML = `<td class="p-2 border border-medium text-left">Activity Total (Hrs) </td>`;
    for (let i = 0; i < NUM_ACTIVITY_ROWS; i++) {
        activityHourHTML += `<td class="p-2 border border-medium text-center" id="activity-hr-total-${i}"> 0.00</td>`;
    }
    activityHourHTML += `<td class="total-row-bg"></td><td class="total-row-bg"</td>`;
    activityHourRow.innerHTML = activityHourHTML;

    }

    // Ensures box only accepts numbers //
    function hourInput(event) {
        if (event.target.matches('input[type="number"]')) {
            updateTotals();
        }
    }

    // Calculation logic //

    function calculateAll() {
        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
        let totalMins = 0;

        for (let day = 1; day <= daysInMonth; day++) {
            let dayMinuteTotal = 0;
            for (let activity = 0; activity < NUM_ACTIVITY_ROWS; activity++) {
                const input = tableBody.querySelector(`input[data-day="${day}"][data-activity"${activity}"]`);
                dayMinuteTotal += parseInt(input.value, 10) || 0;
            }
            document.getElementById(`get-min-total-${day}`).textContent = dayMinuteTotal;
            document.getElementById(`day-hour-total-${day}`).textContent = (dayHourTotal / 60).toFixed(2);
        }


        for (let activity = 0; activity < NUM_ACTIVITY_ROWS; activity++) {

            // Math for each activity upon user hour input //

            let displayMinutes = dayMinuteTotal;

            const individualActivity = ROW_NAMES[activity];
            if (individualActivity === "Safety Training") {
                let displayMinutes = Math.floor(dayMinuteTotal / 0.00125);

            } else if (individualActivity === "Health & First Aid") {
                let displayMinutes = Math.floor(dayMinuteTotal / 0.05);

            } else if (individualActivity === "Admin Procedures") {
                let displayMinutes = Math.floor(dayMinuteTotal / 0.005);

            } else if (individualActivity === "Child Nutrition & Hygiene") {
                let displayMinutes = Math.floor(dayMinuteTotal / 0.25);

            } else if (individualActivity === "Child Development / Observation") {
                let displayMinutes = Math.floor(dayMinuteTotal / 0.275);

            } else if (individualActivity === "Child Activity Supervision") {
                let displayMinutes = Math.floor(dayMinuteTotal / 0.3625);

            } else if (individualActivity === "Consultation Techniques") {
                let displayMinutes = Math.floor(dayMinuteTotal / 0.02);

            } else if (individualActivity === "Professionalism") {
                let displayMinutes = Math.floor(dayMinuteTotal / 0.025)
            }

            totalMins += dayMinuteTotal;

            document.
        }

    }

    


});