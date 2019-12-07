const fs = require("fs");
const readline = require("readline");

function parseMemUsage(fp) {
    return new Promise((resolve, reject) => {

        let result = {};
        const fstream = fs.createReadStream(fp);
        const readInterface = readline.createInterface(fstream);

        let lineIndex = 0;
        readInterface.on("line", line => {

            if(line.trim() !== "") {

                line = line.trim().replace(/\s+/g, ",");

                if(lineIndex === 0) {
                    // Header row
                    result["header"] = [];
                    line.split(",").map(x => result["header"].push(x));
                } else {
                    // Normal row
                    result["row" + lineIndex] = line.split(",");
                }

                lineIndex += 1;
            }
        });

        readInterface.on("close", () => {
            resolve(result);
        });

    });
};

function parseSdUsage(fp) {
    return new Promise((resolve, reject) => {

        let result = {};
        const fstream = fs.createReadStream(fp);
        const readInterface = readline.createInterface(fstream);

        let lineIndex = 0;
        readInterface.on("line", line => {

            if(line.trim() !== "") {
                line = line.trim().replace(/\s+/g, ",");     
                
                if(lineIndex === 0) {
                    // Header row
                    result["header"] = [];
                    line.split(",").map(x => {
                        if(x !== "on" && x !== "Mounted") // Hack to fix "Mounted on" from splitting into two headers
                            result["header"].push(x)
                        if(x === "Mounted")
                            result["header"].push("Mounted on");
                    });
                } else {
                    result["row" + lineIndex] = line.trim().split(",");
                }

                lineIndex += 1;
            }
        });

        readInterface.on("close", () => {
            resolve(result);
        });

    });
};

module.exports = {
    parseMemUsage: parseMemUsage,
    parseSdUsage: parseSdUsage
}
