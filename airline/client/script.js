
const socket = io();
socket.emit('flights', 'Hello from the client!');

let flightId;
let flagAuth;

socket.on("auth", function(message) {
    regWindow(message);
})

socket.on("register", function(message) {

    regWindow(message);
})

function regWindow(message) {
    if(message) {
        document.getElementById('warning').style.display = "block";
        document.getElementById('warning').innerText = message;
        document.getElementById('auth-reg').style.display = "none";
    } else {
        document.getElementById('auth-reg').style.display = "block";

        if (flagAuth) {
            document.getElementById('auth-reg').innerText = "The user is registered";
        } else {
            
            document.getElementById('auth-reg').innerText = "The user is logged in";
        }

        document.getElementById('warning').style.display = "none";

        document.getElementById('passwordField').value = "";
        document.getElementById('emailField').value = "";
    }
}


socket.on("flights", function(data) {
    for (let i = 0; i < data.length; i++) {
        getCard(data[i]);
    }
})

socket.on("updateFlight", function(response) {
    // if (response.message === "Unauthorized user"){
    //     alert("Ошибка 401, пользователь не авторизован");
    // } else {
        const elem = document.getElementsByClassName(flightId.toString())[0];
        const elements = document.getElementsByClassName("pilot-card-fxv");
    
        for (let i = 0; i < elements.length; i++){
            if (elements[i] === elem){
                getCard(response, i);
            }
        }
    // }
})

socket.on("addFlights", function(response) {
    getCard(response);
    
    // const response = await clientRequest("/api/flights", "POST", flight);
    // if (response.message === "Unauthorized user"){
    //     alert("Ошибка 401, пользователь не авторизован");
    // } else {
    //     getCard(response);
    // }
})

socket.on("deleteFlight", function(response) {
    if (response.message !== "Unauthorized user")
        document.getElementsByClassName(flightId.toString())[0].remove();
    else {
        alert("Ошибка 401, пользователь не авторизован");
    }
})

window.onload = async function() {

    document.getElementById("btnID").onclick = async function () {
        let flight = {};
        flight.destination = document.getElementById("destination").value;
        flight.date = document.getElementById("date").value;
        flight.file = "";
        flight.price = document.getElementById("price").value;
        socket.emit('addFlights', flight);
   };
}

document.getElementById("updateData").onclick = async function () {
    let flight = {};

    flight._id = flightId;
    flight.destination = document.getElementById("destinationUpdate").value;
    flight.date = document.getElementById("dateUpdate").value;
    flight.file = "";
    flight.price = document.getElementById("priceUpdate").value;

    socket.emit('updateFlight', flightId, flight);
};

function get_cookie ( cookie_name ) {
    let results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );

    if ( results )
        return ( unescape ( results[2] ) );
    else
        return null;
}

async function auth(email, password, flag = false) {
    const user = {};
    user.email = email;
    user.password = password;

    console.log(user);
    let response;
    flagAuth = flag
    if (flag) {
        console.log("reg")
        socket.emit("register", user);
        document.getElementById('reg-auth-Modal').modal = "hide";
    } else {
        console.log("auth")
        // socket.emit('flights', 'Hello from the client!');
        socket.emit("auth", user);
    }
}

async function Delete(id){
    flightId = id;
    socket.emit('deleteFlight', id);
}

function Update(id, destination, date, price) {
    flightId = id;
    document.getElementById("destinationUpdate").value = destination;
    document.getElementById("dateUpdate").value = date;
    document.getElementById("priceUpdate").value = price;
}

function getCard(flight, position = null) {
    if (position === null) {
        const x = ` <div class="col-6 py-md-2 ${flight._id} pilot-card-fxv">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title" id="destination">${flight.destination}</h5>
                                <h6 class="card-subtitle mb-2 text-muted" id="date">${flight.date}</h6>
                                <div id="price">Price(USD): ${flight.price}</div>
                                <hr>
                                <button type="button" class="btn btn-danger" id="deleteBtn" onclick="Delete('${flight._id}')">Delete</button>
                                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal" id="putBtn" onclick="Update('${flight._id}','${flight.destination}','${flight.date}', '${flight.price}')">Update</button>
                            </div>
                        </div> 
                    </div>`;
        document.getElementById('flights').innerHTML = document.getElementById('flights').innerHTML + x;
    } else {
        document.getElementsByClassName('pilot-card-fxv')[position].innerHTML = `<div class="card">
                            <div class="card-body">
                                <h5 class="card-title" id="destination">${flight.destination}</h5>
                                <h6 class="card-subtitle mb-2 text-muted" id="date">${flight.date}</h6>
                                <div id="price">Price(USD): ${flight.price}</div>
                                <hr>
                                <button type="button" class="btn btn-danger" id="deleteBtn" onclick="Delete('${flight._id}')">Delete</button>
                                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal" id="putBtn" onclick="Update('${flight._id}','${flight.destination}','${flight.date}', '${flight.price}')">Update</button>
                            </div>
                        </div>`;
    }
}