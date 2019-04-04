window.addEventListener("load", event => {
	window.Main = new Main();
	window.Main.load();
});

class Main {
	
	constructor() {

		this._name = "dash";
	}
	
	load() {
		//let widget = new LeMondeWidget(1, this);
		//document.body.appendChild(widget.mvc.view.stage);

		let flightWidget = new FlightWidget(2, this);
		document.body.appendChild(flightWidget.mvc.view.stage);

	}
	
	async get(url) {
		return await Comm.urlrequest("https://node.nicopr.fr/" + this._name + url, {});

	}
	
	async post(url, data) {
		trace("https://node.nicopr.fr/" + this._name + url);

		return await Comm.urlrequest("https://node.nicopr.fr/" + this._name + url, {"method": "POST", "data": data});
	}
	
	get appname() {
		return this._name;
	}
}
