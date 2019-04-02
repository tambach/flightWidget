class FlightWidget extends Widget {

    constructor(id, app) {
        trace("don't panic");
        super(id, FlightModel, FlightView, FlightController, app);
    }

    setUp() {
        super.setUp();
        this.header = true;
        this.footer = true;
        this.sizeX = 4;
        this.sizeY = 4;
        this.radius = 20;

        this.defaultSize = 100;
    }

    async ready() {
        super.ready();
        SocketIO.initialize();
        trace(this);

        SocketIO.on("msg", this.mvc.controller.onMessage.bind(this));
        this.mvc.controller.load();
    }
}

class FlightModel extends WidgetModel {

    constructor() {
        super();
    }

    setUp() {
        super.setUp();

    }

}

class FlightView extends WidgetView {

    constructor() {

        super();
    }

    setUp() {

        super.setUp();

    }

    draw() {
        super.draw();

        this.try.header.innerHTML = "header sample";
        this.try.stage.appendChild(this.try.header);

        this.link = HH.create("a");
        SS.style(this.link, {"fontSize": "14px", "textDecoration": "none", "color" : "red"});
        this.stage.appendChild(this.link);




        this.try.footer.innerHTML = "footer for flight widget";
        SS.style(this.try.footer, {"userSelect": "none", "cursor": "pointer"});
        Events.on(this.try.footer, "click", event => this.mvc.controller.socketClick());
        this.try.stage.appendChild(this.try.footer);
    }

    update(title, link) {
        this.link.innerHTML = title;

        HH.attr(this.link, {"href": "https://www.lemonde.fr" + link, "target": "_blank"});
    }

}

class FlightController extends WidgetController {

    constructor() {
        super();
    }

    setUp() {
        super.setUp();

    }

    onMessage(data) {
        trace("received socket msg", data);
    }

    socketClick(event) {
        trace("test socket");
        SocketIO.send("msg", {test: "message"});
    }

    async load() {
        let result = await this.mvc.main.dom("https://lemonde.fr"); // load web page
        let domstr = _atob(result.response.dom); // decode result
        let parser = new DOMParser(); // init dom parser
        let dom = parser.parseFromString(domstr, "text/html"); // inject result
        let article = new xph().doc(dom).ctx(dom).craft('//*[@id="en-continu"]/div/ul/li[1]/a').firstResult; // find interesting things
        this.mvc.view.update(article.textContent, article.getAttribute("href"));
    }



}

