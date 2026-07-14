const API =
"https://script.google.com/macros/s/AKfycby9seIKNWXwU4guOG6VM6AIK9SJmIIrub5dYXyCIxL8F5xCEG0A5nzyj6Bq7zOqqQOu2Q/exec";

let allRecords = [];

function loadAttendance(){

    fetch(API + "?action=attendance")

    .then(response => response.json())

    .then(data => {

        allRecords = data;

        renderTable();

    })

    .catch(console.error);

}

function renderTable(){

    const tbody = document.querySelector("#attendanceTable tbody");

    tbody.innerHTML = "";

    allRecords.forEach(function(record){

        tbody.innerHTML += `
            <tr>
                <td>${record.time}</td>
                <td>${record.studentID}</td>
                <td>${record.name}</td>
                <td>${record.course}</td>
                <td>${record.year}</td>
                <td>${record.action}</td>
            </tr>
        `;

    });

}

loadAttendance();

function loadCourses(){

    fetch(API + "?action=courses")

    .then(response => response.json())

    .then(courses => {

        const select =
            document.getElementById("course");

        courses.forEach(function(course){

            select.innerHTML +=
                `<option value="${course}">
                    ${course}
                </option>`;

        });

    });

}

loadCourses();
