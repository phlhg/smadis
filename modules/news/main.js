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
        this.interval = setInterval(this.loadAPI.bind(this),1000*60*30)
        this.stepper = setInterval(this.nextStep.bind(this),1000*20)
    }

    update(){
        if(this.new == false){ return; }
        for(var i = 0; i < this.sites*4; i++){
            var pageID = Math.floor(i/4)
            var article = this.storage.get("data")[i]
            var d = new Date(article.publishedAt)
            this.pages[pageID].innerHTML += 
            `<article>
                <div class="image" style="background-image: url(`+article.urlToImage+`)"></div>
                <span class="center">
                    <span class="title">`+article.title.split(" - ")[0]+`</span>
                    `+dbl(d.getHours())+`:`+dbl(d.getMinutes())+`
                </span>
            </article>`
        }
        this.new = false;
    }

    loadAPI(){
        if(Date.now() < this.storage.get("next")){ this.update(); return; }
        fetch("https://newsapi.org/v2/top-headlines?country=ch&apiKey="+this.key).then(function(response){
            if(!response.ok){ return false; }
            return response.json();
        }).then(function(data){
            this.new = true;
            this.storage.set("data",data.articles)
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