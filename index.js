    document.addEventListener("DOMContentLoaded", function() {
            const NUM_OF_ROWS = 8;
            const ROW_NAMES = [
                "Safety Training", "Health & First Aid", "Admin Procedures",
                "Child Nutrition & Hygiene", "Child Development / Observation", "Child Activity Supervision",
                "Consultation Techniques", "Professionalism"
            ];

            const monthSelect = document.getElementById("month-select");
            const daySelect = document.getElementById("day-select");
            const tableHead = document.getElementById("table-head");
            const tableBody = document.getElementById("table-body");
            const printBtn = document.getElementById("print-button");
            const distributeBtn = document.getElementById('distribute-button');
            const singleDayHoursInput = document.getElementById('single-day-hours');

            const currentYear = new Date().getFullYear();
            let currentMonth = new Date().getMonth();

            function initialize() {
                monthSelect.value = currentMonth;
                generateTable();
                
                monthSelect.addEventListener('change', (e) => {
                    currentMonth = parseInt(e.target.value, 10);
                    generateTable();
                });
                tableBody.addEventListener('input', hourInput);
                printBtn.addEventListener('click', () => window.print());
                distributeBtn.addEventListener('click', timeDistribution);
            }
            
            function populateDaySelect(daysInMonthValue) {
                daySelect.innerHTML = '<option value="">--Please choose an option--</option>';
                for (let i = 1; i <= daysInMonthValue; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = i;
                    daySelect.appendChild(option);
                }
            }

            function generateTable() {
                const daysInMonthValue = new Date(currentYear, currentMonth + 1, 0).getDate();
                populateDaySelect(daysInMonthValue);
                tableHead.innerHTML = '';
                tableBody.innerHTML = '';

                generateHeader();
                daysInMonth(daysInMonthValue);
                generateTotalRows();
                calculateAll();
            }
            
            function generateHeader() {
                const headerRow = document.createElement('tr');
                let headerHTML = `<th>Day</th>`;
                ROW_NAMES.forEach(name => {
                    headerHTML += `<th>${name}</th>`;
                });
                headerHTML += `<th>Daily Total Hours</th>`;
                headerHTML += `<th>Daily Total Mins</th>`;
                headerRow.innerHTML = headerHTML;
                tableHead.appendChild(headerRow);
            }

            function daysInMonth(daysInMonthValue) {
                for (let day = 1; day <= 31; day++) {
                    const isInactive = day > daysInMonthValue;
                    const row = document.createElement('tr');
                    if (isInactive) row.classList.add('inactive-row');

                    let rowHTML = `<td>${day}</td>`;
                    for (let i = 0; i < NUM_OF_ROWS; i++) {
                        rowHTML += `<td class="${isInactive ? 'inactive-cell' : ''}"><input type="number" min="0" ${isInactive ? 'disabled' : ''} data-day="${day}" data-activity="${i}"></td>`;
                    }
                    rowHTML += `<td id="day-hour-total-${day}">0.00</td>`;
                    rowHTML += `<td id="get-min-total-${day}">0</td>`;
                    row.innerHTML = rowHTML;
                    tableBody.appendChild(row);
                }
            }
            
            function generateTotalRows() {
                const minRow = document.createElement('tr');
                minRow.classList.add('total-row-bg');
                let minHTML = `<td>Activity Total (Mins)</td>`;
                for (let i = 0; i < NUM_OF_ROWS; i++) {
                    minHTML += `<td id="activity-min-total-${i}">0</td>`;
                }
                minHTML += `<td id="grand-hr-total">0.00</td>`;
                minHTML += `<td id="grand-min-total">0</td>`;
                minRow.innerHTML = minHTML;
                tableBody.appendChild(minRow);

                const hourRow = document.createElement('tr');
                hourRow.classList.add('total-row-bg');
                let hourHTML = `<td>Activity Total (Hrs)</td>`;
                for (let i = 0; i < NUM_OF_ROWS; i++) {
                    hourHTML += `<td id="activity-hr-total-${i}">0.00</td>`;
                }
                hourHTML += `<td></td><td></td>`;
                hourRow.innerHTML = hourHTML;
                tableBody.appendChild(hourRow);
            }

            function hourInput(event) {
                if (event.target.matches('input[type="number"]')) {
                    calculateAll();
                }
            }

            function calculateAll() {
                const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                let totalMins = 0;

                for (let day = 1; day <= daysInMonth; day++) {
                    let dayMinuteTotal = 0;
                    for (let activity = 0; activity < NUM_OF_ROWS; activity++) {
                        const input = tableBody.querySelector(`input[data-day="${day}"][data-activity="${activity}"]`);
                        dayMinuteTotal += parseInt(input.value, 10) || 0;
                    }
                    document.getElementById(`get-min-total-${day}`).textContent = dayMinuteTotal;
                    document.getElementById(`day-hour-total-${day}`).textContent = (dayMinuteTotal / 60).toFixed(2);
                }

                for (let activity = 0; activity < NUM_OF_ROWS; activity++) {
                    let activityMinuteTotal = 0;
                    for (let day = 1; day <= daysInMonth; day++) {
                        const input = tableBody.querySelector(`input[data-day="${day}"][data-activity="${activity}"]`);
                        activityMinuteTotal += parseInt(input.value, 10) || 0;
                    }
                    
                    // The custom math logic is removed from here. This section now only performs a simple sum.
                    let displayMinutes = activityMinuteTotal;
                    
                    totalMins += activityMinuteTotal;

                    document.getElementById(`activity-min-total-${activity}`).textContent = displayMinutes;
                    document.getElementById(`activity-hr-total-${activity}`).textContent = (displayMinutes / 60).toFixed(2);
                }
                
                document.getElementById('grand-min-total').textContent = totalMins;
                document.getElementById('grand-hr-total').textContent = (totalMins / 60).toFixed(2);

                for (let day = daysInMonth + 1; day <= 31; day++) {
                    document.getElementById(`get-min-total-${day}`).textContent = '0';
                    document.getElementById(`day-hour-total-${day}`).textContent = '0.00';
                }
            }
            
            function timeDistribution() {
                const day = parseInt(daySelect.value, 10);
                const totalHours = parseFloat(singleDayHoursInput.value);
                
                daySelect.classList.remove('form-input-error');
                singleDayHoursInput.classList.remove('form-input-error');

                if (!day) {
                    daySelect.classList.add('form-input-error');
                    daySelect.focus();
                    return;
                }
                if (isNaN(totalHours) || totalHours <= 0) {
                    singleDayHoursInput.classList.add('form-input-error');
                    singleDayHoursInput.focus();
                    return;
                }
                
                const totalMinutes = Math.round(totalHours * 60);
                const minuteValues = [];

                for (let activity = 0; activity < NUM_OF_ROWS; activity++) {
                    const activityName = ROW_NAMES[activity];
                    let ratio = 0;

                    if (activityName === "Safety Training") {
                        ratio = 0.0125;
                    } else if (activityName === "Health & First Aid") {
                        ratio = 0.05;
                    } else if (activityName === "Admin Procedures") {
                        ratio = 0.005;
                    } else if (activityName === "Child Nutrition & Hygiene") {
                        ratio = 0.25;
                    } else if (activityName === "Child Development / Observation") {
                        ratio = 0.275;
                    } else if (activityName === "Child Activity Supervision") {
                        ratio = 0.3625;
                    } else if (activityName === "Consultation Techniques") {
                        ratio = 0.02;
                    } else if (activityName === "Professionalism") {
                        ratio = 0.025;
                    }
                    minuteValues.push(totalMinutes * ratio);
                }

                const roundedMinutesArray = minuteValues.map(mins => Math.floor(mins));
                const sumOfRounded = roundedMinutesArray.reduce((sum, current) => sum + current, 0);
                let remainingMinutes = totalMinutes - sumOfRounded;

                for (let activity = 0; activity < NUM_OF_ROWS; activity++) {
                    const input = tableBody.querySelector(`input[data-day="${day}"][data-activity="${activity}"]`);
                    if (input) {
                        let minutesForThisSlot = roundedMinutesArray[activity];
                        if (remainingMinutes > 0) {
                            minutesForThisSlot++;
                            remainingMinutes--;
                        }
                        input.value = minutesForThisSlot;
                    }
                }
                calculateAll();
            }

            initialize();
        });