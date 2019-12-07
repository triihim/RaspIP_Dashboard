const fs = require("fs");
const readline = require("readline");

function readHeader(supplicantFp) {
    return new Promise((resolve, reject) => {

        let header = []
        const fstream = fs.createReadStream(supplicantFp);
        const readInterface = readline.createInterface(fstream);

        let continueReading = true;

        readInterface.on("line", line => {
            line = line.trim();
            if(continueReading) {
                if(line.toLowerCase().includes("network=")) {
                    continueReading = false;
                } else {
                    if(line !== "") header.push(line);
                }
            }
        });

        readInterface.on("close", () => {
            resolve(header);
        });
    });
}

function readNetworks(supplicantFp) {
    return new Promise((resolve, reject) => {

        let networks = {};

        const fstream = fs.createReadStream(supplicantFp);
        const readInterface = readline.createInterface(fstream);

        let read = false;
        let networkIndex = -1;
        readInterface.on("line", line => {
            line = line.trim();
            if(line.toLowerCase().includes("network=")) {
                // We're past header portion and only networks follow.
                read = true;
                networkIndex += 1;
                networks["network" + networkIndex] = {};
            }
            if(read) {
                let key = "network" + networkIndex;
                if(line.startsWith("ssid")) 
                    networks[key]["ssid"] = line.split("=")[1].substring(1, line.split("=")[1].length - 1); // Remove "" from string
                if(line.startsWith("psk")) 
                    networks[key]["psk"] = line.split("=")[1].substring(1, line.split("=")[1].length - 1); // Remove "" from string
                if(line.startsWith("key_mgmt")) networks[key]["key_mgmt"] = line.split("=")[1];
                if(line.startsWith("priority")) networks[key]["priority"] = line.split("=")[1];
            }
        });

        readInterface.on("close", () => {
            resolve(networks);
        });
    });
}

function writeSupplicantFile(supplicantConfObj, supplicantFp) {
    return new Promise((resolve, reject) => {
        let configStr = "";
        configStr += supplicantConfObj.header.join("\n")
        configStr += "\n\n"

        Object.keys(supplicantConfObj.networks).forEach(n => {
            let element = supplicantConfObj.networks[n];
            configStr += `network={
    ssid="${element["ssid"]}"
    psk="${element["psk"]}"
    key_mgmt=${element["key_mgmt"]}
    priority=${element["priority"]}
}\n
` 
        });

        fs.writeFile(supplicantFp, configStr, () => {
            resolve();
        })

    });
}

function getSupplicantConfObj(supplicantFp) {
    return new Promise((resolve, reject) => {
        
        let supplicantConfig = {};

        readHeader(supplicantFp).then(header => {
            supplicantConfig["header"] = header;
            readNetworks(supplicantFp).then(networks => {
                supplicantConfig["networks"] = networks;
                resolve(supplicantConfig);
            });
        })

    });  
}

function addNetwork(ssid, psk, priority, supplicantConfObj) {
    let networkKeys = Object.keys(supplicantConfObj.networks);
    let newKey = "network" + networkKeys.length + 1;
    supplicantConfObj.networks[newKey] = {
        ssid: ssid.toString(),
        psk: psk.toString(),
        key_mgmt: "WPA-PSK",
        priority: priority
    }
}

function removeNetwork(ssid, supplicantConfObj) {
    let keys = Object.keys(supplicantConfObj.networks);
    let toRemove = "";
    keys.forEach(k => {
        if(toRemove === "" && supplicantConfObj.networks[k]["ssid"] === ssid) {
            toRemove = k.toString();
        }
    });
    delete supplicantConfObj.networks[toRemove];
}

module.exports = {
    getSupplicantConfObj: getSupplicantConfObj,
    updateSupplicantFile: writeSupplicantFile,
    addNetworkToConfObj: addNetwork,
    removeNetworkFromConfObj: removeNetwork
}
