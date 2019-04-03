class FlightWidget extends Widget {

    constructor(id, app) {

        super(id, FlightModel, FlightView, FlightController, app);
    }

    setUp() {
        super.setUp();
        this.header = true;
        this.footer = true;
        this.sizeX = 6;
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

        this.try.header.innerHTML = "Cheapest flights in this week";
        this.try.stage.appendChild(this.try.header);



        this.link = HH.create("a");
        SS.style(this.link, {"fontSize": "18px", "textDecoration": "none", "color" : "green" , "margin-bottom": "10px"});
        this.stage.appendChild(this.link);

        this.div1 = HH.create("div");
        SS.style(this.div1, {"fontSize": "16px",  "color" : "green" , "margin-top": "20px"});
        this.stage.appendChild(this.div1);



        this.try.footer.innerHTML = "footer example";
        SS.style(this.try.footer, {"userSelect": "none", "cursor": "pointer"});
        Events.on(this.try.footer, "click", event => this.mvc.controller.socketClick());
        this.try.stage.appendChild(this.try.footer);

    }

    update(title, price ) {

       /* this.flightLink.innerHTML = title;
        HH.attr(this.flightLink , {"href":  link, "target": "_blank"});
        */

        this.link.innerHTML = "Fly Tickets' link";
        HH.attr(this.link, {"href" : "https://www.cheapoair.com/deals/last-minute-travel", "target": "_blank"});

        this.div1.innerHTML = title[0] + ' ' + title[1] + ' ' + title[2] + ' ' + price;

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
trace("we are here");
        let result = await this.mvc.main.dom("https://www.cheapoair.com/deals/last-minute-travel"); // load web page
        let domstr = _atob(result.response.dom);                        // decode result
        let parser = new DOMParser();                                   // init dom parser
        let dom = parser.parseFromString(domstr, "text/html");    // inject result
        let article = [];
         article[0] = new xph().doc(dom).ctx(dom).craft('//*[@id="dynDeals"]/div[1]/div[2]/span[1]/span[1]').firstResult; // find interesting things
         article[1] = new xph().doc(dom).ctx(dom).craft('//*[@id="dynDeals"]/div[1]/div[2]/span[1]/span[2]').firstResult; // find interesting things
         article[2] = new xph().doc(dom).ctx(dom).craft('//*[@id="dynDeals"]/div[1]/div[2]/span[1]/span[4]').firstResult; // find interesting things

        let price = new xph().doc(dom).ctx(dom).craft('//*[@id="dynDeals"]/div[1]/div[2]/span[2]').firstResult; // find interesting things

        trace(article);
        article[0] = article[0].textContent;
        article[1] = article[1].textContent;
        article[2] = article[2].textContent;

        this.mvc.view.update(article, price.textContent);


    }



}
//  #page > section.module.module--promo > div > ul > li.media-list__item.media-list__item--1 > div > a