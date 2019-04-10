class FlightWidget extends Widget {

    constructor(id, app) {

        super(id, FlightModel, FlightView, FlightController, app);
    }

    setUp() {
        super.setUp();
        this.header = true;
        this.footer = true;
        this.sizeX = 8;
        this.sizeY = 6;
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

        this.try.header.innerHTML = "Flights in this week ";
        SS.style(this.try.header, {"fontSize": "20px"});
        this.try.stage.appendChild(this.try.header);



        this.div = HH.create("div");
        SS.style(this.div, {"margin-top": "20px", "margin-bottom": "25px"});
        this.stage.appendChild(this.div);

        this.link = HH.create("a");
        SS.style(this.link, {"fontSize": "22px", "textDecoration": "none", "color" : "blue" });
        this.div.appendChild(this.link);


        this.list = HH.create("ul");
        this.stage.appendChild(this.list);





        this.try.footer.innerHTML = "";
        SS.style(this.try.footer, {"userSelect": "none", "cursor": "pointer"});
        Events.on(this.try.footer, "click", event => this.mvc.controller.socketClick());
        this.try.stage.appendChild(this.try.footer);

    }

    update(title, item ) {

        this.link.innerHTML = "Click here to see the site";
        HH.attr(this.link , {"href":  "https://www.omio.com/flights/france#flightsfrom", "target": "_blank"});


        this.listItem = HH.create("li");
        SS.style(this.listItem, {"fontSize": "18px", "margin": "18px" });
        this.list.appendChild(this.listItem);

        this.linkItem = HH.create("a");
        SS.style(this.linkItem , {"fontSize": "18px", "textDecoration": "none", "color" : "blue","margin-top": "10px" });
        this.listItem.appendChild(this.linkItem);

        this.linkItem.innerHTML =  title ;
        HH.attr(this.linkItem , {"href":  item, "target": "_blank"});




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

        let link = "https://www.omio.com/flights/france#flightsfrom";
        let result = await this.mvc.main.dom(link);                     // load web page
        let domstr = _atob(result.response.dom);                        // decode result
        let parser = new DOMParser();                                   // init dom parser
        let dom = parser.parseFromString(domstr, "text/html");    // inject result
        let article = new xph().doc(dom).ctx(dom).craft('//*[@id="table1"]').allResults; // find interesting things


       for(let i = 0; i < article.length; i += 2)
       {
           let headTitle = article[i].textContent + "  "+ article[i+1].textContent;
           let url = article[i+1].getAttribute("href");
           this.mvc.view.update(headTitle, url );
       }

       let secondLink = "https://www.omio.com/flights/paris";
        result = await this.mvc.main.dom(secondLink);
        domstr = _atob(result.response.dom);
        parser = new DOMParser();
        dom = parser.parseFromString(domstr, "text/html");
        article = new xph().doc(dom).ctx(dom).craft('//*[@id="LpsContent-SmartLinkboxeyJ0eXBlIjoiU21hcnRMaW5rYm94IiwiYmFzaWNDb250ZW50IjpmYWxzZSwicGFyYW1ldGVycyI6eyJtYXhOdW1iZXJPZkxpbmtzIjozMCwic21hcnRMaW5rYm94UHJvdmlkZXIiOiJtb2RlVG9Qb3NpdGlvblBhZ2VWZXJ0aWNhbFNtYXJ0TGlua2JveFByb3ZpZGVyIn19"]/div/div/div/div/div[1]/div').firstResult;

        trace(article);
        trace(article.article.textContent);


    }



}
