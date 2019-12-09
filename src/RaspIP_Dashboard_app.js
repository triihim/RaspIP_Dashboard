const express = require("express");
const bodyParser = require("body-parser");
const data = require("./data-api");
const supplicant = require("./supplicant-api");
const sysfunc = require("./sysfunc");

const supplicantFp = "/etc/wpa_supplicant/wpa_supplicant.conf";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
	res.send("index.html");
	res.end();
});

app.get("/temperature", (req, res) => {
	data.getTemp().then(temp => {
		res.send(temp);
		res.end();
	});
});

app.get("/memusage", (req, res) => {
	data.getMemUsageObj().then(obj => {
		res.send(JSON.stringify(obj));
		res.end();
	});
});

app.get("/sdusage", (req, res) => {
	data.getSdUsageObj().then(obj => {
		res.send(JSON.stringify(obj));
		res.end();
	});
});

app.get("/reboot", (req, res) => {
	sysfunc.reboot();
	res.end("reboot");
});

app.get("/shutdown", () => {
	sysfunc.shutdown();
	res.end("shutdown");
});

app.get("/networks", (req, res) => {
	supplicant.getSupplicantConfObj(supplicantFp).then(obj => {
		var networks = obj.networks;
		var cleaned = Object.keys(networks).map(nkey => {
			var secureNetwork = networks[nkey];
			delete secureNetwork["psk"];
			return secureNetwork;
		});
		res.end(JSON.stringify(cleaned));
	}).catch(err => {
		res.end("0");
	});
});

app.get("/forgetnetwork", (req, res) => {
	var ssid = req.query.ssid;
	supplicant.getSupplicantConfObj(supplicantFp).then(obj => {
		var confObj = obj;
		supplicant.removeNetworkFromConfObj(ssid, confObj);
		supplicant.updateSupplicantFile(confObj, supplicantFp).then(() => {
			res.end("1");
		}).catch(err => res.end("0"));
	}).catch(err => res.end("0"));
});

app.post("/addnetwork", (req, res) => {
	let ssid = req.body.ssid;
	let pwd = req.body.pwd;
	let prio = req.body.priority;
	if(ssid.length > 1 && pwd.length > 1) {
		supplicant.getSupplicantConfObj(supplicantFp).then(obj => {
			let confObj = obj;
			supplicant.addNetworkToConfObj(ssid, pwd, parseInt(prio), confObj);
			supplicant.updateSupplicantFile(confObj, supplicantFp).then(() => {
				res.end("1");
			});
		}).catch(err => { console.log(err); res.end("0"); });
	} else {
		res.end("0");
	}
});

app.listen(port, () => console.log("RaspIP Dashboard listening port " + port));
