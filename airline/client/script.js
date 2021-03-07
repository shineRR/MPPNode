let addBtn;
let flightId;

window.onload = async function() {
    loadData()

    addBtn = document.getElementById("btnID").onclick = async function () {
        let flight = {};
        flight.destination = document.getElementById("destination").value;
        flight.date = document.getElementById("date").value;
        flight.file = "";
        flight.price = document.getElementById("price").value;

        console.log(flight)
        const response = await clientRequest("/api/flights", "POST", flight);
        if (response.message === "Unauthorized user"){
            alert("Ошибка 401, пользователь не авторизован");
        }else {
            getCard(response);
            console.log(response);
        }
   };
}

putBtn = document.getElementById("updateData").onclick = async function () {
    let flight = {};

    flight._id = flightId;
    flight.destination = document.getElementById("destinationUpdate").value;
    flight.date = document.getElementById("dateUpdate").value;
    flight.file = "";
    flight.price = document.getElementById("priceUpdate").value;

    const response = await clientRequest(`/api/flights/${flightId}`, "PUT", flight);

    if (response.message === "Unauthorized user"){
        alert("Ошибка 401, пользователь не авторизован");
    } else {
        const elem = document.getElementsByClassName(flightId.toString())[0];
        const elements = document.getElementsByClassName("pilot-card-fxv");
    
        for (let i = 0; i < elements.length; i++){
            if (elements[i] === elem){
                getCard(response, i);
            }
        }
    }
};

function get_cookie ( cookie_name )
{
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

    if (flag) {
        console.log("reg");
        response = await clientRequest("/register", "POST", user);
        document.getElementById('reg-auth-Modal').modal = "hide";
    } else {
        console.log("auth");
        response = await clientRequest("/auth", "POST", user);
        console.log(response);
        console.log(get_cookie("token"));
    }

    if(response.message) {
        document.getElementById('warning').style.display = "block";
        document.getElementById('warning').innerText = response.message;
        document.getElementById('auth-reg').style.display = "none";
    } else {
        document.getElementById('auth-reg').style.display = "block";

        if (flag)
            document.getElementById('auth-reg').innerText = "The user is registered";
        else
            document.getElementById('auth-reg').innerText = "The user is logged in";

        document.getElementById('warning').style.display = "none";

        document.getElementById('passwordField').value = "";
        document.getElementById('emailField').value = "";
    }
}

async function Delete(id){
    const response = await clientRequest(`/api/flights/${id}`, "DELETE");
    if (response.message !== "Unauthorized user")
        document.getElementsByClassName(id.toString())[0].remove();
    else {
        alert("Ошибка 401, пользователь не авторизован");
    }
}

async function loadData() {
    const data = await clientRequest("/api/flights", "GET");
    console.log(data);

    for (let i = 0; i < data.length; i++) {
        getCard(data[i])
    }
}

function Update(id, destination, date, price) {
    flightId = id;
    document.getElementById("destinationUpdate").value = destination;
    document.getElementById("dateUpdate").value = date;
    document.getElementById("priceUpdate").value = price;
}

async function clientRequest(url, method, data = null) {
    try {
        let headers = {};
        headers['Authorization'] = get_cookie("token");
        console.log(headers['Authorization']);

        let body;

        if (data) {
            headers['Content-type'] = 'application/json';
            body = JSON.stringify(data);
        }

        console.log(body)
        const response = await fetch(url, {
            method,
            headers,
            body
        });
        console.log(body)
        return await response.json();
    } catch (e) {
        console.warn(e.message);
    }
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