const CITIES = [
    {name: "Los Angeles", index: "LAX"},
    {name: "New York", index: "NYC"},
    {name: "Chicago", index: "CHI"},
    {name: "Washington", index: "WAS"},
    {name: "Las Vegas", index: "LAS"},
    {name: "Miami", index: "MIA"},
    {name: "Boston", index: "BOS"},
    {name: "San Francisco", index: "SFO"},
    {name: "Atlanta", index: "ATL"},
    {name: "Seattle", index: "SEA"}
];

class FlightWidget extends Widget {

    constructor(id, app) {

        super(id, FlightModel, FlightView, FlightController, app);
    }


    setUp() {

        super.setUp();
        this.header = true;
        this.footer = true;
        this.sizeX = 8;
        this.sizeY = 7;
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

        // header
        this.try.header.innerHTML = "";
        SS.style(this.try.header, {"height": "32px"});
        this.try.stage.appendChild(this.try.header);
        this.headerLink = HH.create("a");
        this.headerLink.innerHTML = "Click here to see the full site";
        SS.style(this.headerLink, {"color": "black", "textDecoration": "none", "font-size": "20px"});
        HH.attr(this.headerLink , {"href":  "https://skiplagged.com/", "target": "_blank"});
        this.try.header.appendChild(this.headerLink);


        // select
        this.explainDiv = HH.create("div");
        this.explainDiv.innerHTML = "Choose your city";
        SS.style(this.explainDiv, {"font-size": "20px", "margin-top": "10px", "color": "black", "margin-left":"20px"});
        this.stage.appendChild(this.explainDiv);

        this.select = HH.create("select");
        SS.style(this.select, {"margin": "20px", "width": "150px", "height": "30px","background": "transparent", "font-size": "14px"});
        this.stage.appendChild(this.select);

        // button
        this.button = HH.create("button");
        SS.style(this.button, {"width": "100px", "height": "34px", "font-size": "14px", "background": "dodgerblue", "cursor": "pointer", "border": "none", "border-radius": "7px"})
        this.button.innerHTML = "Search ";
        Events.on(this.button, "click", event => this.mvc.controller.myClick(this.select));
        this.stage.appendChild(this.button);


        // for result
        this.div = HH.create("div");
        SS.style(this.div, {"margin": "20px", "font-size": "20px", });
        this.div.innerHTML = "Top Flight Routes ";
        this.stage.appendChild(this.div);

        this.list = HH.create("ul");
        this.div.appendChild(this.list);


        // footer
        this.try.footer.innerHTML = "";
        SS.style(this.try.footer, {"userSelect": "none", "cursor": "pointer"});
        Events.on(this.try.footer, "click", event => this.mvc.controller.socketClick());
        this.try.stage.appendChild(this.try.footer);

    }

    /**
     * puts content for main page
     * images, text and links
     * @param href
     * @param alt
     * @param src
     */
    update(href, alt, src ) {

        this.listItem = HH.create("li");
        SS.style(this.listItem, {"fontSize": "18px", "margin": "12px" });
        this.list.appendChild(this.listItem);

        this.image = HH.create("img");
        HH.attr(this.image, {"src": src, "alt": alt});
        SS.style(this.image, {"width": "80px", "height": "50px", "margin-right": "20px"});
        this.listItem.appendChild(this.image);

        this.linkItem = HH.create("a");
        SS.style(this.linkItem , {"fontSize": "18px", "textDecoration": "none", "color" : "blue","margin-top": "10px" });
        this.listItem.appendChild(this.linkItem);

        this.linkItem.innerHTML =  alt ;
        HH.attr(this.linkItem , {"href":  href, "target": "_blank"});
    }

    /**
     * adds options into select item
     */
    addOptions()
    {
        for( let i=0; i < CITIES.length; i++)
        {
            this.option = HH.create("option");
            this.option.innerHTML = CITIES[i].name;
            HH.attr(this.option, { "value": i });
            this.select.appendChild(this.option);
        }
    }

    /**
     * changes title after request
     * @param city
     */
    updateTitle (city)
    {
        this.div.innerHTML = "Results for city " + city;
    }

    /**
     * puts contect for result
     * text and links
     * @param title
     * @param href
     */
    updateContent( title, href)
    {
        this.linkDiv = HH.create("div");
        SS.style(this.linkDiv,{"margin": "20px", "font-size": "20px"});
        this.div.appendChild(this.linkDiv);

        this.linkItem = HH.create("a");
        SS.style(this.linkItem , {"fontSize": "18px", "textDecoration": "none", "color" : "blue","margin": "20px" });
        this.linkDiv.appendChild(this.linkItem);

        this.linkItem.innerHTML =  title ;
        HH.attr(this.linkItem , {"href":  href, "target": "_blank"});
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
        SocketIO.send("msg", {test: "message"});
    }

    /**
     * event on mouse click
     * @param event
     */
    myClick(event)
    {
        let id = event.value;
        let name = CITIES[id].name;
        let index = CITIES[id].index;

        this.mvc.view.updateTitle(name);

        for(let i = 0; i< CITIES.length; i++)
        {
            if(id != i)
            {
                let link = "https://skiplagged.com/flights/" + index + "/" + CITIES[i].index ;
                let title = "Flights from " + name + " to " + CITIES[i].name;
                this.mvc.view.updateContent( title, link);
            }
        }

    }

    async getDataFromSkiplagged(){
        let link = "https://skiplagged.com/";
        let result = await this.mvc.main.dom(link);
        let domstr = _atob(result.response.dom);
        let parser = new DOMParser();
        let dom = parser.parseFromString(domstr, "text/html");

        let contentArray = [
            {href: "", text: "", src: ""}
        ];

        for(let i = 1; i <= 7; i++)
        {
            let articleUrl = new xph().doc(dom).ctx(dom).craft('//*[@id="home-container"]/div[3]/div/ul/li['+ i +']/a').firstResult;
            let href   = link + articleUrl.getAttribute("href");
            let imageUrl   = new xph().doc(dom).ctx(dom).craft('//*[@id="home-container"]/div[3]/div/ul/li['+ i +']/a/img').firstResult;
            let src = imageUrl.getAttribute("src");
            let alt = imageUrl.getAttribute("alt");
            let moreInfo   = new xph().doc(dom).ctx(dom).craft('//*[@id="home-container"]/div[3]/div/ul/li['+ i +']/a/div/div[1]/h4[2]').firstResult;
            moreInfo = moreInfo.textContent;
            let text = alt + " " + moreInfo;
            this.mvc.view.update( href, text, src );
        }
    }


    async load() {

        this.getDataFromSkiplagged();
        this.mvc.view.addOptions();

    }

}
