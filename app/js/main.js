document.addEventListener("DOMContentLoaded",function(){
    document.querySelector(".hub_module_container").click(function(){ window.location.reload(true) })
    APP = new App();
})

window.onerror = function(msg, url, linenumber) {
    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
}

/*  ======================
          APPLICATION
    ======================  */

class App {

    constructor(){
        this.storage = new Storage();
        this.modules = new ModuleMangager(this.storage.getPointer("modules"))
        this.view = new View(this.modules);
    }

}

class View {

    constructor(modules){
        this.modules = modules
        this.tiles = []
        this.getTiles()
    }

    getTiles(){
        var tiles = document.querySelectorAll(".hub_module_container .hub_module[data-module]");
        for(var i = 0; i < tiles.length; i++){ 
            this.tiles.push(tiles[i]); 
            this.modules.load(this.tiles[this.tiles.length-1])
        }
    }

}

/*  ======================
            MODULES
    ======================  */

class ModuleMangager {

    constructor(storage){
        this.available = {ClockModule,PublicTransportModule,NewsModule,WeatherModule,SpotifyModule}
        this.storage = storage
        this.modules = []
        
    }

    load(tile){
        var name = tile.getAttribute("data-module");
        if(!this.isAvailable(name)){ return false; }
        var m = this.getClass(name)
        console.log(name+"Module loaded")
        this.modules.push(new m(tile,this.storage))
    }

    isAvailable(name){
        return !(this.available[this.getClassName(name)] === undefined)
    }

    getClassName(name){
        return name+"Module"
    }

    getClass(name){
        var m = this.getClassName(name)
        return this.available[m];
    }

}


class Module {

    constructor(tile,storage){
        this.name = tile.getAttribute("data-module")
        this.storage = storage.getPointer(this.name);
        this.root = tile
        this.path = window.location.pathname+"modules/"+this.name.toLowerCase()+"/"
        this._cache = {}
        this.setupCheck();
    }

    setupCheck(){
        if(!this.storage.exists("setup")){  this.setup() }
    }

    setup(){} //DEFAULT

    setupFinished(){ this.storage.set("setup",true) } //DEFAULT

    init(){} //DEFAULT

    fetch(uri,headers){
        console.log(`[${this.name.toUpperCase()}] Requesting ${uri}`)
        return fetch(uri,headers)
        
        /*
        return new Promise((resolve,reject) => {
            fetch(uri,headers).then(response => {
                this._cache[encodeURI(uri)] = response
                return resolve(response)
            }).catch(e => {
                if(navigator.online){ return reject(e) }
                if(!this._cache.hasOwnProperty(encodeURI(uri))){ return reject(e) }
                return resolve(this._cache[encodeURI(uri)])
            })
        })
        */
    }

}

/*  ======================
            STORAGE
    ======================  */

class Storage {

    constructor(){

        this.name = "smadisStorage"
        this.data = {}
        this.pointers = []

    }

    get(path,defaultValue){
        this.pull()
        if(!this.exists(path)){ return defaultValue }
        return this.data[Storage.path2name(path)]
    }

    set(path,value){
        this.pull()
        this.data[Storage.path2name(path)] = value
        this.push()
    }

    remove(path){
        this.pull()
        if(!this.exists(path)){ return false }
        delete this.data[Storage.path2name(path)]
        this.push()
        return true
    }
    
    exists(path){
        this.pull()
        return this.data.hasOwnProperty(Storage.path2name(path))
    }

    pull(){
        try {
            this.init()
            this.data = JSON.parse(localStorage.getItem(this.name))
            return true
        } catch(e) {
            console.warn("Storage was reset, because it was corrupted")
            this.data = {}
            return false
        }
    }

    push(){
        localStorage.setItem(this.name,JSON.stringify(this.data))
    }

    init(){
        if(localStorage.getItem(this.name) == null){ 
            this.push()
        }
    }

    getPointer(path){
        return new StoragePointer(this,path)
    }
    
    static path2name(path){
        return "/"+path.toLowerCase().replace(/[\/]+/g,"/").replace(/(^\/|\/$)/g,"")
    }

}

class StoragePointer {
    
    constructor(storage, root){
        this.storage = storage
        this.root = root
        this.pointers = []
    }

    get(path,defaultValue){
        return this.storage.get(`${this.root}/${path}`,defaultValue)
    }

    set(path, value){
        return this.storage.set(`${this.root}/${path}`,value)
    }

    exists(path){
        return this.storage.exists(`${this.root}/${path}`)
    }

    remove(path){
        return this.storage.remove(`${this.root}/${path}`)
    }

    getPointer(path){
        return new StoragePointer(this.storage,`${this.root}/${path}`)
    }

}

function dbl(n){
    if(n < 10){ return "0"+n; }
    return n.toString();
}