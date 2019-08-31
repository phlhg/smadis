/*  ======================
            CLOCK
    ======================  */

class ModuleClock extends Module {
    
    constructor(...v){
        super(...v)
        this.interval;
        this.init()
    }

    init(){
        this.root.innerHTML = `<div class="hub_center"><div class="hub_time"><span>1</span><span>2</span><span>3</span><span>4</span></div><div class="hub_date">1 Januar 2000</div></div>`;
        this.times = Array.prototype.slice.call(this.root.querySelectorAll(".hub_time > span"))
        this.date = this.root.querySelector(".hub_date")
        this.update();
        this.interval = setInterval(this.update.bind(this),1000)
    }

    update(){
        var days = ["So","Mo","Di","Mi","Do","Fr","Sa"]
        var months = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"]
        var d = new Date();
        var time = this.dbl(d.getHours())+this.dbl(d.getMinutes())
        for(var i = 0; i < this.times.length; i++){ this.times[i].innerHTML = time.charAt(i) }
        this.date.innerHTML = days[d.getDay()]+" "+d.getDate()+" "+months[d.getMonth()]+" "+d.getFullYear();
    }

    dbl(n){
        if(n < 10){ return "0"+n; }
        return n.toString();
    }

    setup(){
        this.setupFinished();
    }
}

/*  ======================
        Public Transport
    ======================  */

class ModulePublictransport extends Module {
    
    constructor(...v){
        super(...v)
        this.interval;
        this.stations = [
            {
                "name": "Thalwil, Aubrigstrasse",
                "distance": 6,
                "connections": [
                    { "name": "145", "type": "bus", "time": 17, "heading": "Thalwil, Zentrum"},
                    { "name": "145", "type": "bus", "time": 47, "heading": "Thalwil, Zentrum"}
                ]
            },
            {
                "name": "Thalwil, Gewerbestrasse",
                "distance": 5,
                "connections": [
                    { "name": "142", "type": "bus", "time": 3, "heading": "Thalwil, Zentrum"},
                    { "name": "142", "type": "bus", "time": 33, "heading": "Thalwil, Zentrum"}
                ]
            },
            {
                "name": "Thalwil, Schützenhaus",
                "distance": 8,
                "connections": [
                    { "name": "140", "type": "bus", "time": 13, "heading": "Thalwil, Zentrum"},
                    { "name": "140", "type": "bus", "time": 43, "heading": "Thalwil, Zentrum"}
                ]
            },
            {
                "name": "Thalwil",
                "distance": 18,
                "connections": [
                    { "name": "S2", "type": "s", "time": 29, "heading": "Zürich &#x2708;"},
                    { "name": "S2", "type": "s", "time": 59, "heading": "Zürich &#x2708;"},
                    { "name": "S8", "type": "s", "time": 6, "heading": "Winterthur"},
                    { "name": "S8", "type": "s", "time": 36, "heading": "Winterthur"},
                    { "name": "S 24", "type": "s", "time": 21, "heading": "Weinfelden"},
                    { "name": "S 24", "type": "s", "time": 51, "heading": "Weinfelden"},
                    { "name": "RE", "type": "re", "time": 39, "heading": "Zürich HB"},
                    { "name": "IR 70", "type": "ir", "time": 46, "heading": "Zürich HB"},
                    { "name": "IR 75", "type": "ir", "time": 14, "heading": "Konstanz"},
                ]
            }
        ]
        this.connections = [];
        this.getConnections()
        this.init()
    }

    init(){
        this.root.innerHTML = ``;
        this.update();
        this.interval = setInterval(() => this.update(),1000*60)
    }

    getConnections(){
        this.stations.forEach(s => {
            s.connections.forEach(c => {
                this.connections.push({
                    "name": c.name,
                    "type": c.type,
                    "station": s.name,
                    "heading": c.heading,
                    "time": c.time,
                    "distance": s.distance,
                    "rtime":  (c.time - s.distance < 0 ? 60+c.time-s.distance : c.time - s.distance)
                })
            })
        })
        console.log(this.connections)
    }

    update(){
        var d = new Date()
        var m = d.getMinutes();
        this.connections = this.connections.sort(function(a,b){
            var at = (a.rtime <= m ? a.rtime+60 : a.rtime)
            var bt = (b.rtime <= m ? b.rtime+60 : b.rtime)
            return at - bt
        })
        this.root.innerHTML = '';
        this.connections.slice(0,9).forEach(c => {
            this.root.innerHTML = this.root.innerHTML + '<div class="phub_connection"><span class="phub_connection_name '+c.type+'">'+c.name+'</span>'+c.heading+'<span style="float: right">'+dbl((c.rtime < m || c.time < m ? (d.getHours()+1) : d.getHours()))+':'+dbl(c.time)+'</span><span class="phub_connection_meta">'+c.station+' <span style="float: right">> '+(c.rtime - m < 0 ? 60 + c.rtime - m : c.rtime - m)+'\'</span></span></div>'; 
        })
    }

    setup(){
        this.setupFinished();
    }
}

/*  ======================
            NEWS
    ======================  */

class ModuleNews extends Module {
    
    constructor(...v){
        super(...v)
        this.key = ""
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

/*  ======================
            WEATHER
    ======================  */

class ModuleWeather extends Module {
    
    constructor(...v){
        super(...v)
        this.key = ""
        this.lat = 47.2949167
        this.lon = 8.5648018
        this.new = true;
        this.interval;
        this.init()
    }

    init(){
        this.root.innerHTML = 
        `<div class="icon" style="background-image: url(/img/weather/01d.svg);"></div>
        <svg preserveAspectRatio="none" viewBox="0 0 800 80" class="forecast_temp">
            <path d=""/>
        </svg>
        <svg preserveAspectRatio="none" viewBox="0 0 800 80" class="forecast_rain">
            <path d=""/>
        </svg>
        <div class="forecast_timeline"></div>
        <span class="temp">23°C</span>`
        this.icon = this.root.querySelector(".icon");
        this.temp = this.root.querySelector(".temp");
        this.temppol = this.root.querySelector(".forecast_temp path");
        this.rainpol = this.root.querySelector(".forecast_rain path");
        this.timeline = this.root.querySelector(".forecast_timeline");
        this.loadAPI();
        this.interval = setInterval(this.loadAPI.bind(this),1000*60)
    }

    update(){
        if(!this.new){ return; }
        var data = this.storage.get("data")
        var current = this.storage.get("current")
        this.icon.style.backgroundImage = 'url(/img/weather/'+current.weather[0].icon+'.svg)'
        this.temp.innerHTML = this.toCelcius(current.main.temp)+'°C'
        this.timeline.innerHTML = ""
        var fore_temp = "M 850 81 L -50 81 L -50 "+(40-this.toCelcius(current.main.temp))
        var fore_rain = "M 850 81 L -50 81 "
        for(var i = 0; i < 9; i++){
            if(i < 8){ this.timeline.innerHTML+= '<span><img src="/img/weather/'+data.list[i].weather[0].icon+'.svg"/><span>'+this.toCelcius(data.list[i].main.temp)+'°</span>'+dbl(new Date(data.list[i].dt*1000).getHours())+'00</span>';}
            fore_temp += "L "+(i*100+50)+" "+(40-this.toCelcius(data.list[i].main.temp))+" "
            var x = (80-Math.round((data.list[i].rain ? data.list[i].rain["3h"] : 0)*5))
            fore_rain += "L "+(i*100+10)+" 80 L "+(i*100+10)+" "+x+" L "+(i*100+90)+" "+(x+4)+" L "+(i*100+90)+" 80 "
        }
        this.temppol.setAttribute("d", fore_temp)
        this.rainpol.setAttribute("d", fore_rain)
        this.new = false;
    }

    loadAPI(){
        if(Date.now() < this.storage.get("next")){ this.update(); return; }
        fetch('http://api.openweathermap.org/data/2.5/forecast?lat='+this.lat+'&lon='+this.lon+'&appid='+this.key).then(function(response){
            if(!response.ok){ return false; }
            return response.json();
        }).then(function(data){
            this.new = true;
            this.storage.set("data",data)
            this.loadAPI2()
        }.bind(this)).catch(function(error){
            console.log("[WEATHER] "+error)
        })
    }

    loadAPI2(){
        if(Date.now() < this.storage.get("next")){ this.update(); return; }
        fetch('http://api.openweathermap.org/data/2.5/weather?lat='+this.lat+'&lon='+this.lon+'&appid='+this.key).then(function(response){
            if(!response.ok){ return false; }
            return response.json();
        }).then(function(data){
            this.new = true;
            this.storage.set("current",data)
            this.storage.set("next",Date.now()+1000*60*10)
            this.update()
        }.bind(this)).catch(function(error){
            console.log("[WEATHER] "+error)
        })
    }

    toCelcius(n){
        return Math.round(n-273.15);
    }

    setup(){
        this.storage.set("next",0)
        this.storage.set("data",[])
        this.setupFinished();
    }
}

/*  ======================
            Spotify
    ======================  */

class ModuleSpotify extends Module {

    constructor(...v){
        super(...v)
        this.clientID = ""
        this.clientSecret = ""
        this.new = false;
        this.interval;
        this.init()
    }

    init(){
        this.root.innerHTML = '<div class="bg"></div><div class="center"><div class="img" style="background-image: url();"></div><span class="name"></span><span class="artist"></span></div><div class="progress"><div></div></div>'
        this.img = this.root.querySelector(".img")
        this.bg = this.root.querySelector(".bg")
        this.name = this.root.querySelector(".name")
        this.artist = this.root.querySelector(".artist")
        this.progress = this.root.querySelector(".progress > div")
        if(!this.authenticate()){
            this.img.onclick = this.openSpotify.bind(this)
            return;
        }
        this.loadAPI()
        this.interval = setInterval(this.loadAPI.bind(this),1000)
    }

    
    loadAPI(){
        if(Date.now() < parseInt(this.storage.get("next")) || this.storage.get("authenticated") == false){ this.update(); return; }
        fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            'headers': { 'Authorization': 'Bearer ' + this.storage.get("code").access_token }
        }).then(function(response){
            if(response.status == 401){ this.storage.set("authenticated",false); this.img.onclick = this.openSpotify.bind(this); clearInterval(this.interval); return; }
            if(response.status != 200){ this.apiloaded(""); return false; }
            return response.json();
        }.bind(this)).then(function(data){
            this.new = data.is_playing
            this.apiloaded(data)
        }.bind(this)).catch(function(error){
            console.log("[SPOTIFY] "+error)
        })
    }

    apiloaded(data){
        this.storage.set("current",data)
        this.storage.set("next",Date.now()+1000*5)
        this.update()
    }
    
    update(){
        var current = this.storage.get("current")
        if(!this.new && current.progress_ms){ current.progress_ms = current.progress_ms+1000;  } else { this.new = false; }
        if(current.item){
            if(current.item.album.images[0]){
                this.img.style.backgroundImage = "url("+current.item.album.images[0].url+")"
                this.bg.style.backgroundImage = "url("+current.item.album.images[0].url+")"
            } else {
                this.img.style.backgroundImage = "/img/spotify/icon.png"
                this.bg.style.backgroundImage = ""
            }
            this.name.innerHTML = current.item.name
            this.artist.innerHTML = ""
            for(var i = 0; i < current.item.artists.length; i++){ 
                if(i > 0){ this.artist.innerHTML += ", " }
                this.artist.innerHTML += current.item.artists[i].name
            }
            if(current.progress_ms){ this.progress.style.width = ((current.progress_ms/current.item.duration_ms)*100)+"%" }
        } else {
            this.img.style.backgroundImage = "/img/spotify/icon.png"
            this.bg.style.backgroundImage = ""
            this.name.innerHTML = ""
            this.artist.innerHTML = ""
            this.progress.style.width = 0
        }

    }d

    authenticate(){
        if(this.storage.get("authenticated")){ return true; }
        if(window.location.hash != ""){
            var data = window.location.hash.substr(1).split("&").reduce(function(result, item){
                var parts = item.split('=');
                result[parts[0]] = parts[1];
                return result;
            }, {})
            window.location.hash = "#";
            this.storage.set("code",data)
            this.storage.set("authenticated",true)
            return true;
        }
        return false;
    }

    openSpotify(){
        window.location.href = 'https://accounts.spotify.com/authorize?client_id='+this.clientID+'&redirect_uri=http://localhost&response_type=token'
    }

    setup(){
        this.storage.set("next",0);
        this.storage.set("auth",false)
        this.storage.set("code","")
        this.setupFinished()
    }
}
