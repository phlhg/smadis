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
            var pageID = Math.floor(i/4)
            if(i%4 == 0){ this.pages[pageID].innerHTML = "" }
            var article = this.storage.get("data")[i];
            this.pages[pageID].innerHTML += 
            `<article>
                <div class="image" style="background-image: url(`+article.img+`)"></div>
                <span class="meta">srf.ch</span>
                <span class="content">
                    <span class="title">`+article.title+`</span>
                    <span class="description">`+article.description+`</span>
                </span>
            </article>`
        }
        this.new = false;
    }

    loadAPI(){
        if(Date.now() < this.storage.get("next")){ this.update(); return; }
        this.fetch("rss.php")
            .then(response => response.text())
            .then(str => new DOMParser().parseFromString(str, "text/xml"))
            .then(data => {
                var articles = [];
                var items = Array.from(data.querySelectorAll("item")).slice(0,this.sites*4);
                var i = 0;
                while(articles.length < this.sites*4 && i < items.length){

                    let item = items[i];
                    let title = item.querySelector("title").textContent;
                    let description = item.querySelector("description").textContent;
                    let img = "";

                    let span = document.createElement("span");
                    span.innerHTML = description;

                    description = span.innerText;
                    img = span.querySelector("img").getAttribute("src");

                    if(!title.includes("fussball")){
                        articles.push({
                            "title": title,
                            "description": description,
                            "img": img
                        });
                    }

                    i++;
                    
                };
                
                this.new = true;
                this.storage.set("data",articles)
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