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

        tbody.innerHTML = "";

        data.logs.forEach(function(log){

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
