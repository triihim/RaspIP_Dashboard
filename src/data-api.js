const fs = require("fs");
const lookup = require("./lookup");
const parser = require("./parser");

function getSdUsageObj() {
	return new Promise((resolve, reject) => {
		lookup.get_sd_usage()
			.then(data => {
				fs.writeFile("temp/sd_usage", data, () => {
					parser.parseSdUsage("temp/sd_usage")
						.then(parsed => {
							resolve(parsed);
						});
			});
		});
	});
}

function getMemUsageObj() {
	return new Promise((resolve, reject) => {
		lookup.get_mem_usage()
			.then(data => {
				fs.writeFile("temp/mem_usage", data, () => {
					parser.parseMemUsage("temp/mem_usage")
						.then(parsed => {
							resolve(parsed);
						});
			});
		});
	});
}

function getTempObj() {
	return new Promise((resolve, reject) => {
		lookup.get_temp()
			.then(data => {
				resolve(data.split("=")[1]);
			});
	});
}

module.exports = {
	getTemp: getTempObj,
	getMemUsageObj: getMemUsageObj,
	getSdUsageObj: getSdUsageObj
}
