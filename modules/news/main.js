/**
 * Displays the latest news 
 * @author Philippe Hugo <info@phlhg.ch>
 * @extends Module
 */
class NewsModule extends Module {
    
    constructor(...v){
        super(...v)
        this.key = __CONFIG["newsapi_key"]
        this.new = true;
        this.step = 0;
        this.sites = 6;
        this.interval;
        this.init()
    }

    init(){
        for(var i = 0; i < this.sites; i++){
            this.root.innerHTML += '<div class="page"></div>';
        }
        this.pages = this.root.querySelectorAll(".page")
        this.loadAPI();
        this.nextStep()
        this.interval = setInterval(this.loadAPI.bind(this),1000*60)
        this.stepper = setInterval(this.nextStep.bind(this),1000*30)
    }

    update(){
        if(this.new == false){ return; }
        for(var i = 0; i < this.sites*4; i++){
            if(this.storage.get("data").length > i){
                var pageID = Math.floor(i/4)
                if(i%4 == 0){ this.pages[pageID].innerHTML = "" }
                var article = this.storage.get("data")[i];
                console.log((Date.now() - article.date));
                this.pages[pageID].innerHTML += 
                `<article `+((Date.now() - article.date) < 3*60*60*1000 ? `class="breaking"` : '')+`>
                    <div class="image" style="background-image: url(`+article.img+`)"></div>
                    <span class="meta">srf.ch</span>
                    <span class="break">`+(Math.round((Date.now() - article.date)/(1000*60*60)) < 1 ? 'Kürzlich' : Math.round((Date.now() - article.date)/(1000*60*60))+`h`) + `</span>
                    <span class="content"> 
                        <span class="title">`+article.title+`</span>
                        <span class="description">`+article.description+`</span>
                    </span>
                </article>`
            }
        }
        this.new = false;
    }

    loadAPI(){
        if(Date.now() < this.storage.get("next")){ this.update(); return; }
        this.fetch("rss.php")
            .then(response => response.text())
            .then(str => new DOMParser().parseFromString(str, "text/xml"))
            .then(data => {
                var articles = {};
                var items = Array.from(data.querySelectorAll("item"));
                var i = 0;
                while(Object.values(articles).length < this.sites*4 && i < items.length){

                    let item = items[i];
                    let title = item.querySelector("title").textContent;
                    let description = item.querySelector("description").textContent;
                    let link = item.querySelector("link").textContent;
                    let date = Date.parse(item.querySelector("pubDate").textContent);
                    let img = "";

                    let span = document.createElement("span");
                    span.innerHTML = description;

                    description = span.innerText;
                    img = span.querySelector("img").getAttribute("src");

                    if(!articles.hasOwnProperty(link)){
                        articles[link] = {
                            "title": title,
                            "description": description,
                            "img": img,
                            "date": date
                        };
                    }

                    i++;
                    
                }
                
                this.new = true;
                
                var list = Object.values(articles);
                list = list.sort((a,b) => b.date - a.date);
                list.slice(0,this.sites*4);

                this.storage.set("data",list);
                this.storage.set("next",Date.now()+1000*60*30)
                this.update();
            });
    }

    nextStep(){
        this.pages.forEach(p=>{ p.classList.remove("active"); p.classList.remove("next"); })
        this.pages[this.step%3].classList.add("active");
        this.pages[(this.step+1)%3].classList.add("next");
        this.step++
    }

    setup(){
        this.storage.set("next",0)
        this.storage.set("data",[])
        this.setupFinished();
    }
}