// Student QR Scanner Script

const scanner = document.getElementById("scanner");
const result = document.getElementById("result");
const startCameraBtn = document.getElementById("startCamera");

let lastScanned = "";
let qrScanner = null;

// =========================
// Search Student
// =========================
const API =
"https://script.google.com/macros/s/AKfycby9seIKNWXwU4guOG6VM6AIK9SJmIIrub5dYXyCIxL8F5xCEG0A5nzyj6Bq7zOqqQOu2Q/exec";

function searchStudent(studentID){

    studentID = studentID.trim();

    if(studentID === "") return;

    fetch(API + "?action=student&id=" + encodeURIComponent(studentID))
    .then(response => response.json())
    .then(student => {

        showStudent(student);

    })
    .catch(err => {

        console.error(err);

        alert("Unable to connect to Google Sheets.");

    });

}

// =========================
// Page Load
// =========================
window.onload = function () {

    scanner.focus();

    console.log("Page Loaded");

    console.log("Html5Qrcode =", typeof Html5Qrcode);

};

// =========================
// Keep scanner focused
// =========================
document.addEventListener("click", function () {

    scanner.focus();

});

// =========================
// Manual Student ID
// =========================
scanner.addEventListener("keydown", function(event){

    if(event.key !== "Enter") return;

    event.preventDefault();

    searchStudent(scanner.value);

    scanner.value = "";

});

// =========================
// Start Camera
// =========================
startCameraBtn.addEventListener("click", function(){

    console.log("Start Camera button clicked");

if (qrScanner) {

    qrScanner.stop().then(function () {

        qrScanner.clear();

        qrScanner = null;

        document.getElementById("reader").style.display = "none";

        startCameraBtn.textContent = "📷 Start Camera";
    });

    return;

}

    document.getElementById("reader").style.display = "block";

    qrScanner = new Html5Qrcode("reader");

Html5Qrcode.getCameras().then(function(cameras){

        console.log(cameras);

        if(!cameras.length){

            alert("No camera detected.");

            return;

        }

        return qrScanner.start(

            cameras[0].id,

            {
                fps:10,
                qrbox:250
            },

            function(decodedText){

                if(decodedText === lastScanned) return;

                lastScanned = decodedText;

                scanner.value = decodedText;

                searchStudent(decodedText);

                setTimeout(function(){

                    lastScanned = "";

                },3000);

            }

        );

    })

    .then(function(){

        console.log("Camera started successfully.");
        
        startCameraBtn.textContent = "🛑 Stop Camera";

    })

    .catch(function(err){

        console.error("Camera Error:", err);

    });

});

function successBeep() {

  const audio = new (window.AudioContext || window.webkitAudioContext)();

  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = "sine";
  osc.frequency.value = 900;

  osc.connect(gain);
  gain.connect(audio.destination);

  osc.start();

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    audio.currentTime + 0.15
  );

  osc.stop(audio.currentTime + 0.15);

}

function errorBeep() {

  const audio = new (window.AudioContext || window.webkitAudioContext)();

  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = "square";
  osc.frequency.value = 250;

  osc.connect(gain);
  gain.connect(audio.destination);

  osc.start();

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    audio.currentTime + 0.30
  );

  osc.stop(audio.currentTime + 0.30);

}

function resetScanner(){

    result.innerHTML = `
        <div class="waiting">
            <h2>📷 Ready for Next Student</h2>
            <p>Waiting for QR Scan...</p>
        </div>
    `;

    scanner.value = "";

    scanner.focus();

}

function showStudent(student) {

  // Student not found
  if (!student) {

    errorBeep();

    result.innerHTML = `
      <div style="text-align:center;color:red;">
        <h2>❌ Student Not Found</h2>
      </div>
    `;

    scanner.focus();
    return;

  }

    // Student exists but is inactive
    
  const status = String(student.status).trim().toUpperCase();

  if (status !== "ACTIVE") {

      errorBeep();

      result.innerHTML = `
        <div style="
          background:#ffebee;
          border:3px solid #dc3545;
          border-radius:15px;
          padding:25px;
          text-align:center;
          color:#dc3545;
        ">

          <h1>🚫 ACCESS DENIED</h1>

          <h2>${student.name}</h2>

<p>This student is currently <strong>INACTIVE</strong>.</p>

<div style="margin-top:20px;">

<button
onclick="resetScanner()"
style="
background:#dc3545;
color:white;
border:none;
padding:12px 30px;
font-size:18px;
font-weight:bold;
border-radius:8px;
cursor:pointer;
">

Continue

</button>

</div>

</div>
`;

      return;

    }

  result.innerHTML = `
  <div style="
      display:flex;
      align-items:center;
      gap:25px;
      background:#ffffff;
      border-radius:15px;
      padding:20px;
      box-shadow:0 8px 20px rgba(0,0,0,.15);
  ">

      <img
          src="https://drive.google.com/thumbnail?id=${student.photo.match(/\/d\/(.*?)\//)[1]}&sz=w1000"
          style="
              width:170px;
              height:170px;
              object-fit:cover;
              border-radius:12px;
              border:4px solid #1f4e79;
          ">

      <div style="flex:1;">

          <div style="
              display:flex;
              justify-content:space-between;
              align-items:center;
          ">

              <h2 style="margin:0;color:#1f4e79;">
                  ${student.name}
              </h2>

              <span style="
                  background:${student.status === "ACTIVE" ? "#28a745" : "#dc3545"};
                  color:white;
                  padding:8px 18px;
                  border-radius:20px;
                  font-weight:bold;
              ">
                  ${student.status}
              </span>

          </div>

          <hr>

          <p><strong>Student ID:</strong> ${student.studentID}</p>

          <p><strong>Course:</strong> ${student.course}</p>

          <p><strong>Year:</strong> ${student.year}</p>

          <p><strong>Section:</strong> ${student.section}</p>

          <p><strong>Scan Time:</strong> ${new Date().toLocaleTimeString()}</p>

      </div>

  <div style="text-align:center;margin-top:20px;">

    <button
    onclick="resetScanner()"
        style="
            background:#28a745;
            color:white;
            border:none;
            padding:12px 30px;
            font-size:18px;
            border-radius:8px;
            cursor:pointer;
            font-weight:bold;
        ">

        ✅ Done

    </button>

    </div>

</div>

`;

successBeep();

fetch(
    API +
    "?action=log" +
    "&studentID=" + encodeURIComponent(student.studentID) +
    "&name=" + encodeURIComponent(student.name)
)
.then(r => r.json())
.then(response => {

    console.log(response.message);

})
.catch(console.error);

}
