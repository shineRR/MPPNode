let flightId;
let flagAuth;

window.onload = async function(){
    loadData();
}

async function loadData() {
    let elements = document.getElementsByClassName("pilot-card-fxv");
    while (elements.length != 0) {
        for (let i = 0; i < elements.length; i++){
            elements[i].remove();
        }
        elements = document.getElementsByClassName("pilot-card-fxv");
    }

    let body = {query: `
                {
                    flights {
                        _id
                        destination
                        date
                        file
                        price
                    }
                }
                `};

    const data = await clientRequest("/", "POST", body);
    let flights = data.data.flights;

    for(let i = 0; i < flights.length; i++) {
    getCard(flights[i])
    }
}

document.getElementById("flightsData").onclick = async function () {
    loadData();
};

document.getElementById("updateData").onclick = async function () {
    let flight = {};

    flight._id = flightId;
    flight.destination = document.getElementById("destinationUpdate").value;
    flight.date = document.getElementById("dateUpdate").value;
    flight.file = "";
    flight.price = document.getElementById("priceUpdate").value;

    let body = {query:`
                mutation {
                    updateFlight(input:{
                        _id: "${flight._id}"
                        destination: "${flight.destination}"
                        date: "${flight.date}"
                        file: "${flight.file}"
                        price: ${flight.price}
                    })
                    {
                        _id
                        destination
                        date
                        file
                        price
                    }
                }`};

    const data = await clientRequest("/", "POST", body);
    console.log(data)

    const updatedFlight = data.data.updateFlight
    if (updatedFlight == null) {
        alert("Ошибка 401, пользователь не авторизован");
    } else {
        const elem = document.getElementsByClassName(flightId.toString())[0];
        const elements = document.getElementsByClassName("pilot-card-fxv");
    
        for (let i = 0; i < elements.length; i++) {
            if (elements[i] === elem) {
                getCard(updatedFlight, i);
            }
        }
    }
};

document.getElementById("btnID").onclick = async function () {
    let flight = {}
    flight.destination = document.getElementById("destination").value;
    flight.date = document.getElementById("date").value;
    flight.file = "";
    flight.price = document.getElementById("price").value;

    let body = {query:`
                    mutation {
                        createFlight(input:{
                            destination: "${flight.destination}"
                            date: "${flight.date}"
                            file: "${flight.file}"
                            price: ${flight.price}
                        })
                        {
                            _id
                            destination
                            date
                            file
                            price
                        }
                    }`};

    const data = await clientRequest("/", "POST", body);
    console.log(data);
    let newFlight = data.data.createFlight;

    if (newFlight === null){
        alert("Ошибка 401, пользователь не авторизован");
    }else {
        getCard(newFlight);
    }
};

function Update(id, destination, date, price) {
    flightId = id;
    document.getElementById("destinationUpdate").value = destination;
    document.getElementById("dateUpdate").value = date;
    document.getElementById("priceUpdate").value = price;
}

async function Delete(id){
    flightId = id;
    let body = {query: `
                mutation {
                    deleteFlight(input: {
                        _id: "${id}"
                    })
                    {
                        _id
                    }
                }
            `};

    const response = await clientRequest(`/`, "POST", body);
    let deleteFlight = response.data.deleteFlight._id;
    console.log(response);

    if (deleteFlight == null)
        alert("Ошибка 401, пользователь не авторизован");
    else {
        console.log(deleteFlight)
        document.getElementsByClassName(deleteFlight.toString())[0].remove();
    } 
}

async function auth(email, password, flag = false) {
    const user = {};
    user.email = email;
    user.password = password;

    console.log(user);

    if (flag) {
        console.log("reg");

        let body = {query: `
            mutation {
                registerUser( input: {
                    email: "${user.email}"
                    password: "${user.password}"
                })
                {
                    message
                }
            }
        `};

        let response = await clientRequest("/", "POST", body);

        document.getElementById('reg-auth-Modal').modal = "hide";
        console.log(response)
        data = response.data.registerUser;

    } else {
        console.log("auth");
        let body = {query: `
            mutation {
                loginUser( input: {
                    email: "${user.email}"
                    password: "${user.password}"
                })
                {
                    message
                    token
                }
            }
        `};

        let response = await clientRequest("/", "POST", body);
        console.log(response);

        data = response.data.loginUser;
    }

    if(data.message !== null) {
        document.getElementById('warning').style.display = "block";
        document.getElementById('warning').innerText = data.message;
        document.getElementById('auth-reg').style.display = "none";
    } else {
        document.getElementById('auth-reg').style.display = "block";

        if (flag)
            document.getElementById('auth-reg').innerText = "The user is registered";
        else {
            document.getElementById('auth-reg').innerText = "The user is logged in";
            if (data.token !== null){
                token = data.token;
            }

            let date = new Date(Date.now() + 3600e3);
            date = date.toUTCString();
            document.cookie = "Token" + '=' + token + "; path=/; expires="+ date;
        }

        document.getElementById('warning').style.display = "none";

        document.getElementById('passwordField').value = "";
        document.getElementById('emailField').value = "";user
    }

}

function get_cookie ( cookie_name )
{
    let results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );

    if ( results )
        return ( unescape ( results[2] ) );
    else
        return null;
}

async function clientRequest(url, method, data = null) {
    try {
        let headers = {};
        if (get_cookie("Token")){
            headers['Authorization'] = get_cookie("Token");
        }

        let body;

        if (data) {
            headers['Content-type'] = 'application/json';
            body = JSON.stringify(data);
        }

        const response = await fetch(url, {
            method: method,
            headers: headers,
            body: body
        });

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