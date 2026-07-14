window.addEventListener("message", function(event){

    const data = event.data;

    if(data.type === "waiting"){

        document.getElementById("cameraPlaceholder").innerHTML = `
            <h2>📷 Camera is ON</h2>
            <p>Please present your Student QR Code.</p>
        `;

        return;

    }

    if(data.type === "cameraOff"){

        document.getElementById("cameraPlaceholder").innerHTML = `
            <h2>📷 Camera is OFF</h2>
            <p>Please wait for the security guard.</p>
        `;

        return;

    }

});
