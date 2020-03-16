/**
 * Displays the current time and date
 * @author Philippe Hugo <info@phlhg.ch>
 * @extends Module
 */
class WeatherModule extends Module {
    
    constructor(...v){
        super(...v)
        this.key = __CONFIG["openweather_key"]
        this.lat = 47.2949167
        this.lon = 8.5648018
        this.new = true;
        this.interval;
        this.init()
    }

    init(){
        this.root.innerHTML = 
        `<div class="icon" style="background-image: url(`+this.path+`img/01d.svg);"></div>
        <svg preserveAspectRatio="none" viewBox="0 0 800 80" class="forecast_temp"><path d=""/></svg>
        <svg preserveAspectRatio="none" viewBox="0 0 8000 800" class="forecast_ind">
            <path d="M 0 700 L 8500 700"/>
            <path d="M 0 600 L 8500 600"/>
            <path d="M 0 500 L 8500 500"/>
            <path d="M 0 400 L 8500 400"/>
            <path d="M 0 300 L 8500 300"/>
            <path d="M 0 200 L 8500 200"/>
            <path d="M 0 100 L 8500 100"/>
        </svg>
        <svg preserveAspectRatio="none" viewBox="0 0 800 80" class="forecast_rain"><path d=""/></svg>
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
        this.icon.style.backgroundImage = 'url('+this.path+'img/'+current.weather[0].icon+'.svg)'
        this.temp.innerHTML = this.toCelcius(current.main.temp)+'°C'
        this.timeline.innerHTML = ""
        var fore_temp = "M 850 81 L -50 81 L -50 "+(40-this.toCelcius(current.main.temp))
        var fore_rain = "M 850 81 L -50 81 "
        for(var i = 0; i < 9; i++){
            if(i < 8){ this.timeline.innerHTML+= '<span><img src="'+this.path+'img/'+data.list[i].weather[0].icon+'.svg"/><span>'+this.toCelcius(data.list[i].main.temp)+'°</span>'+dbl(new Date(data.list[i].dt*1000).getHours())+'00</span>';}
            fore_temp += "S "+(i*100)+" "+(40-this.toCelcius(data.list[i].main.temp))+", "+(i*100+50)+" "+(40-this.toCelcius(data.list[i].main.temp))+" "
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