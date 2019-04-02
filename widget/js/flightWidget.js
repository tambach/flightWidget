class FlightWidget extends Widget {

    constructor(id, app) {

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
        SS.style(this.link, {"fontSize": "18px", "textDecoration": "none", "color" : "green" });
        this.stage.appendChild(this.link);



        this.div = HH.create("div");
        this.div.innerHTML = "Blaah blah blaa blaaa ... ";
        SS.style(this.div, {"fontSize": "26px", "color" : "blue", "margin-top": "20px", "margin-bottom": "20px"});
        this.stage.appendChild(this.div);


        this.flightLink = HH.create("a");
        SS.style(this.flightLink, {"fontsize" : "22px", "color" : "green"});
        this.stage.appendChild(this.flightLink);



        this.try.footer.innerHTML = "footer example";
        SS.style(this.try.footer, {"userSelect": "none", "cursor": "pointer"});
        Events.on(this.try.footer, "click", event => this.mvc.controller.socketClick());
        this.try.stage.appendChild(this.try.footer);

    }

    update(title, link) {
        trace("happ here");
        this.link.innerHTML = title;
        HH.attr(this.link , {"href": "https://www.lemonde.fr" + link, "target": "_blank"});

        this.flightLink.innerHTML = "Title of this link";
        HH.attr(this.flightLink, {"href" : "https://www.airfrance.fr/", "target": "_blank"});
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

