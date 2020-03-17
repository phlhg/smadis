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
        this.sites = 4;
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
            var article = this.storage.get("data")[i]
            var split = article.title.split(" - ")
            split.pop()
            var title = split.join(" - ")
            this.pages[pageID].innerHTML += 
            `<article>
                <div class="image" style="background-image: url(`+article.urlToImage+`)"></div>
                <span class="meta">`+article.source.name.toLowerCase().replace("www.","")+`</span>
                <span class="title">`+title.slice(0,120)+`</span>
            </article>`
        }
        this.new = false;
    }

    loadAPI(){
        if(Date.now() < this.storage.get("next")){ this.update(); return; }
        this.fetch("https://newsapi.org/v2/top-headlines?country=ch&apiKey="+this.key).then(function(response){
            if(!response.ok){ return false; }
            return response.json();
        }).then(function(data){
            this.new = true;
            this.storage.set("data",data.articles.filter(function(article){
                return (!article.title.toLowerCase().includes("fussball") && !article.title.toLowerCase().includes("?"))
            }))
            this.storage.set("next",Date.now()+1000*60*30)
            this.update()
        }.bind(this)).catch(function(error){
            console.log("[NEWS] "+error)
        })
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