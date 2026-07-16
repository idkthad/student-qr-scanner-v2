const API =
"https://script.google.com/macros/s/AKfycby9seIKNWXwU4guOG6VM6AIK9SJmIIrub5dYXyCIxL8F5xCEG0A5nzyj6Bq7zOqqQOu2Q/exec";

let lastTime = "";

function loadLatestStudent(){

    fetch(API + "?action=latestScan")

    .then(response => response.json())

    .then(student => {

        if(!student) return;

        // Prevent updating the same scan repeatedly
        if(student.time == lastTime){

            return;

        }

        lastTime = student.time;

        showStudent(student);

    })

    .catch(console.error);

}

function showStudent(student){

    document.getElementById("cameraPlaceholder").style.display = "none";

    document.getElementById("studentCard").style.display = "block";

    document.getElementById("studentPhoto").src =
        "https://drive.google.com/thumbnail?id=" +
        student.photo.match(/\/d\/(.*?)\//)[1] +
        "&sz=w1000";

    document.getElementById("studentName").innerHTML =
        student.name;

    document.getElementById("studentCourse").innerHTML =
        student.course;

    document.getElementById("studentYear").innerHTML =
        "Year " + student.year;

    document.getElementById("studentSection").innerHTML =
        student.section;

    document.getElementById("studentStatus").innerHTML =
        student.action;

    setTimeout(function(){

        document.getElementById("studentCard").style.display = "none";

        document.getElementById("cameraPlaceholder").style.display = "block";

    },5000);

}

setInterval(loadLatestStudent,1000);

loadLatestStudent();
