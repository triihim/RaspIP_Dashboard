function ajaxGet(route, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("load", callback);
    xhttp.open("GET", "http://" + location.hostname + ":3000/" + route);
    xhttp.send();
}

function ajaxJsonPost(route, jsonString, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("load", callback);
    xhttp.open("POST", "http://" + location.hostname + ":3000/" + route);
    xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xhttp.send(jsonString);
}

function forgetNetwork(ssid) {
    ajaxGet("forgetnetwork?ssid=" + ssid, function() {
    if(this.responseText === "1") updateNetworks();
});
}

function updateNetworks() {
    ajaxGet("networks", function() {
        if (this.responseText === "0") {
            console.log("Error fetching networks");
        } else {
            printNetworks(this.responseText);
        }
    });
}

function printNetworks(networksJsonString) {
    var networks = JSON.parse(networksJsonString);

    document.getElementById("networks").innerHTML = "";

    Object.keys(networks).forEach(nkey => {
        var ssid = networks[nkey].ssid;
        var identifier = nkey;

        var li = document.createElement("li");
        li.classList.add("list-group-item");
        var span = document.createElement("span");
        span.innerText = ssid;
        li.appendChild(span);
    
        var button = document.createElement("button");
        button.classList.add("btn");
        button.classList.add("btn-sm");
        button.classList.add("btn-danger");
        button.classList.add("float-right");
        button.innerHTML = "Forget";
        button.value = identifier;
        li.appendChild(button);

        button.addEventListener("click", function() {
            forgetNetwork(ssid);
        });

        document.getElementById("networks").appendChild(li);
    });
}

function buildMemTable(memResponse) {
    memResponse = JSON.parse(memResponse);
    // thead
    var thead = document.createElement("thead");
    thead.classList.add("thead-light")
    var tr = document.createElement("tr");
    var emptyFirst = document.createElement("th");
    tr.appendChild(emptyFirst);
    memResponse["header"].forEach(x => {
        var th = document.createElement("th");
        th.textContent = x;
        tr.appendChild(th);
    });
    thead.appendChild(tr);

    var oldThead = document.querySelector("#memusage thead");
    if(oldThead != undefined) oldThead.remove();

    document.getElementById("memusage").appendChild(thead);

    // tbody
    var tbody = document.createElement("tbody");
    var rowIndex = 1;
    while(memResponse["row" + rowIndex] !== undefined) {
        var tr = document.createElement("tr");
        for(var i = 0; i < memResponse["row" + rowIndex].length; i++) {
            var td = document.createElement("td");
            td.textContent = memResponse["row" + rowIndex][i];
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
        rowIndex += 1;
    }

    oldTbody = document.querySelector("#memusage tbody");
    if(oldTbody != undefined) oldTbody.remove();
  
    document.getElementById("memusage").appendChild(tbody);

}

function buildSdTable(sdResponse) {
    sdResponse = JSON.parse(sdResponse);
    // thead
    var thead = document.createElement("thead");
    thead.classList.add("thead-light")
    var tr = document.createElement("tr");
    sdResponse["header"].forEach(x => {
        var th = document.createElement("th");
        th.textContent = x;
        tr.appendChild(th);
    });
    thead.appendChild(tr);

    if(document.querySelector("#sdusage thead")) document.querySelector("#sdusage thead").remove();

    document.getElementById("sdusage").appendChild(thead);

    // tbody
    var tbody = document.createElement("tbody");
    var rowIndex = 1;
    while(sdResponse["row" + rowIndex] !== undefined) {
        var tr = document.createElement("tr");
        for(var i = 0; i < sdResponse["row" + rowIndex].length; i++) {
            var td = document.createElement("td");
            td.textContent = sdResponse["row" + rowIndex][i];
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
        rowIndex += 1;
    }

    if(document.querySelector("#sdusage tbody")) document.querySelector("#sdusage tbody").remove();

    document.getElementById("sdusage").appendChild(tbody);
}

function updateTemperature() {
    ajaxGet("temperature", function() {
        document.getElementById("temp").innerHTML = this.responseText.split("'")[0] + "&deg" + "C";
    });
}

function updateMemUsage() {
    ajaxGet("memusage", function() {
        buildMemTable(this.responseText);
    });
}

function updateSdUsage() {
    ajaxGet("sdusage", function() {
        buildSdTable(this.responseText);
    });
}

