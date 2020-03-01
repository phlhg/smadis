/**
 * Shows the song the user is currently listening to
 * @author Philippe Hugo <info@phlhg.ch>
 * @extends Module
 */
class SpotifyModule extends Module {

    constructor(...v){
        super(...v)
        this.clientID = __CONFIG["spotify_clientid"]
        this.clientSecret = __CONFIG["spotify_clientsecret"]
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
            this.storage.set("authenticated",false);
            if(confirm("Bei Spotify anmelden?")){ this.openSpotify(); }
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
            if(response.status == 401){ this.storage.set("authenticated",false); this.openSpotify(); return; }
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
            this.root.classList.remove("inactive")
            if(current.item.album.images[0]){
                this.img.style.backgroundImage = "url("+current.item.album.images[0].url+")"
                this.bg.style.backgroundImage = "url("+current.item.album.images[0].url+")"
            } else {
                this.img.style.backgroundImage = ""
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
            this.root.classList.add("inactive")
            this.img.style.backgroundImage = ""
            this.bg.style.backgroundImage = ""
            this.name.innerHTML = ""
            this.artist.innerHTML = ""
            this.progress.style.width = 0
        }

    }

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
        window.location.href = 'https://accounts.spotify.com/authorize?client_id='+this.clientID+'&redirect_uri=http://'+location.hostname+DIR+'&response_type=token'
    }

    setup(){
        this.storage.set("next",0);
        this.storage.set("auth",false)
        this.storage.set("code","")
        this.setupFinished()
    }
}
