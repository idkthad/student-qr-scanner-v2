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

    const from =
        document.getElementById("fromDate").value;

    const to =
        document.getElementById("toDate").value;

    const course =
        document.getElementById("course").value;

    const year =
        document.getElementById("year").value;

    const action =
        document.getElementById("action").value;

    const keyword =
        document
        .getElementById("searchStudent")
        .value
        .toLowerCase();

    const filtered = allRecords.filter(function(record){

    const recordDate =
        new Date(record.date)
        .toISOString()
        .split("T")[0];

    const matchDate =
        (!from || recordDate >= from) &&
        (!to || recordDate <= to);

    const matchCourse =
        !course || record.course == course;

    const matchYear =
        !year || String(record.year) == year;

    const matchAction =
        !action || record.action == action;

    const matchStudent =
        !keyword ||
        record.name.toLowerCase().includes(keyword) ||
        record.studentID.toLowerCase().includes(keyword);

    return (
        matchDate &&
        matchCourse &&
        matchYear &&
        matchAction &&
        matchStudent
    );

});

filtered.forEach(function(record){

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

document
.getElementById("searchBtn")
.addEventListener("click", function(){

    if(allRecords.length === 0){

        loadAttendance();

    }else{

        renderTable();

    }

});

document
.getElementById("resetBtn")
.addEventListener("click", function(){

    document.getElementById("fromDate").value = "";

    document.getElementById("toDate").value = "";

    document.getElementById("course").value = "";

    document.getElementById("year").value = "";

    document.getElementById("action").value = "";

    document.getElementById("searchStudent").value = "";

    renderTable();

});
