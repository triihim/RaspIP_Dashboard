const exec = require("child_process").exec;

function get_temp() {
	return new Promise((resolve, reject) => {
		let cmd = "/opt/vc/bin/vcgencmd measure_temp";
		exec(cmd, (err, stdout, stderr) => {
			if(err) reject(err);
			if(stderr) reject(stderr);
			resolve(stdout);
		});
	});
};

function get_mem_usage() {
	return new Promise((resolve, reject) => {
		let cmd = "free -h";
		exec(cmd, (err, stdout, stderr) => {
			if(err) reject(err);
			if(stderr) reject(err);
			resolve(stdout);
		});
	});
};

function get_sd_usage() {
	return new Promise((resolve, reject) => {
		let cmd = "df -h";
		exec(cmd, (err, stdout, stderr) => {
			if(err) reject(err);
			if(stderr) reject(stderr);
			resolve(stdout);
		});
	});
};

module.exports = {
	get_temp: get_temp,
	get_mem_usage: get_mem_usage,
	get_sd_usage: get_sd_usage
};
