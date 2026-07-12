const API =
"https://script.google.com/macros/s/AKfycby9seIKNWXwU4guOG6VM6AIK9SJmIIrub5dYXyCIxL8F5xCEG0A5nzyj6Bq7zOqqQOu2Q/exec";

function loadDashboard(){

    fetch(API + "?action=dashboard")

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
