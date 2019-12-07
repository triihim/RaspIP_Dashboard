const exec = require("child_process").exec;

module.exports = {
	shutdown: function() {
		exec("sudo shutdown -h now", (err, stdout, stderr) => {
			if(err) console.log(err);
			if(stdout) console.log(stdout);
			if(stderr) console.log(stderr);
		});
	},
	reboot: function() {
		exec("sudo reboot", (err, stdout, stderr) => {
			if(err) console.log(err);
			if(stdout) console.log(stdout);
			if(stderr) console.log(stderr);
		});
	},
};
