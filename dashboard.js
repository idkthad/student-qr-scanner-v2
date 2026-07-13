const API =
"https://script.google.com/macros/s/AKfycby9seIKNWXwU4guOG6VM6AIK9SJmIIrub5dYXyCIxL8F5xCEG0A5nzyj6Bq7zOqqQOu2Q/exec";

function loadDashboard(){

const fromDate = document.getElementById("fromDate").value;
const toDate = document.getElementById("toDate").value;

fetch(
    API +
    "?action=dashboard" +
    "&fromDate=" + encodeURIComponent(fromDate) +
    "&toDate=" + encodeURIComponent(toDate)
)
    .then(response => response.json())

    .then(data => {

        document.getElementById("entries").innerText = data.entries;
        document.getElementById("exits").innerText = data.exits;
        document.getElementById("inside").innerText = data.inside;
        document.getElementById("inactive").innerText = data.inactive;

        const tbody = document.querySelector("#logsTable tbody");

        const search = document
            .getElementById("searchBox")
            .value
            .toLowerCase();

        tbody.innerHTML = "";

        // Latest 20 logs
        data.logs = data.logs.slice(0,20);

        const filteredLogs = data.logs.filter(function(log){

            return (
                log.studentID.toLowerCase().includes(search) ||
                log.name.toLowerCase().includes(search)
            );

        });

if(filteredLogs.length === 0){

    const from =
        document.getElementById("fromDate").value;

    const to =
        document.getElementById("toDate").value;

    tbody.innerHTML = `
        <tr>
            <td colspan="4">

                <div class="empty-state">

                    <div class="empty-icon">📋</div>

                    <h2>No Logs Found</h2>

                    <p>
                        No attendance records were found
                        from <strong>${from}</strong>
                        to <strong>${to}</strong>.
                    </p>

                    <small>
                        Try selecting another date range.
                    </small>

                </div>

            </td>
        </tr>
    `;

    return;

}
        
        filteredLogs.forEach(function(log){

            tbody.innerHTML += `
                <tr>
                    <td>${log.time}</td>
                    <td>${log.studentID}</td>
                    <td>${log.name}</td>
                    <td>${log.action}</td>
                </tr>
            `;

        });

    })

    .catch(console.error);

}

const today = new Date().toISOString().split("T")[0];

document.getElementById("fromDate").value = today;
document.getElementById("toDate").value = today;

// Load immediately
loadDashboard();

setInterval(loadDashboard,5000);

function updateClock(){

    const now = new Date();

    document.getElementById("currentDate").innerHTML =
        now.toLocaleDateString(undefined,{
            weekday:"long",
            year:"numeric",
            month:"long",
            day:"numeric"
        });

    document.getElementById("currentTime").innerHTML =
        now.toLocaleTimeString();

}

updateClock();

setInterval(updateClock,1000);

document
.getElementById("searchBox")
.addEventListener("keyup", loadDashboard);

document
.getElementById("filterBtn")
.addEventListener("click", loadDashboard);

document
.getElementById("generateExcel")
.addEventListener("click", function(){

    alert("Generate Excel clicked!");

});

document
.getElementById("generatePDF")
.addEventListener("click", function(){

    alert("Generate PDF clicked!");

});

const reportModal = document.getElementById("reportModal");

document
.getElementById("exportExcel")
.addEventListener("click", function(){

    reportModal.style.display = "block";

});

document
.querySelector(".close")
.addEventListener("click", function(){

    reportModal.style.display = "none";

});

window.addEventListener("click", function(e){

    if(e.target === reportModal){

        reportModal.style.display = "none";

    }

});
