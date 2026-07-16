const API =
"https://script.google.com/macros/s/AKfycby9seIKNWXwU4guOG6VM6AIK9SJmIIrub5dYXyCIxL8F5xCEG0A5nzyj6Bq7zOqqQOu2Q/exec";

let lastTimestamp = "";

function loadLatestStudent(){

    fetch(API + "?action=latestScan")

    .then(response => response.json())

    .then(student => {

        if(!student) return;

        // Prevent updating the same scan repeatedly
        
        if(student.timestamp == lastTimestamp){

            return;

        }

lastTimestamp = student.timestamp;

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
    student.status == "ACTIVE"
        ? "✅ ACCESS GRANTED"
        : "❌ ACCESS DENIED";

document.getElementById("studentStatus").style.background =
    student.status == "ACTIVE"
        ? "#28a745"
        : "#dc3545";
    
    setTimeout(function(){

        document.getElementById("studentCard").style.display = "none";

        document.getElementById("cameraPlaceholder").style.display = "block";

    },5000);

}

setInterval(loadLatestStudent,1000);

loadLatestStudent();

function loadSystem(){

    fetch(API + "?action=system")

    .then(r => r.json())

    .then(system => {

        if(system.camera == "OFF"){

            document.getElementById("cameraPlaceholder").style.display = "block";

            document.getElementById("studentCard").style.display = "none";

            return;

        }

        if(system.display == "WAITING"){

            document.getElementById("cameraPlaceholder").style.display = "block";

            document.getElementById("studentCard").style.display = "none";

        }

    })

    .catch(console.error);

}

setInterval(loadSystem,500);

loadSystem();
