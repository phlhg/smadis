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
        this.pointer = this.storage.getPointer("")
        this.modules = new ModuleMangager(this.pointer)
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
        this.storage = storage.getPointer("modules")
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
        this.setupCheck();
    }

    setupCheck(){
        if(!this.storage.exists("setup")){  this.setup() }
    }

    setup(){} //DEFAULT

    setupFinished(){ this.storage.set("setup",true) } //DEFAULT

    init(){} //DEFAULT

}

/*  ======================
            STORAGE
    ======================  */

class Storage {

    constructor(){
        this.root = []
        this.loaded = false
        this.data = {
            "storage": {
                "lastaccess": 0,
                "laststore": 0
            },
            "app": {

            },
            "modules": {

            }
        }
        this.load()
    }

    get(location){
        var pointer = this.data
        for(var i = 0; i < location.length-1; i++){
            pointer = pointer[location[i]]  
        }
        return pointer[location[location.length-1]];
    }

    exists(location){
        var pointer = this.data
        for(var i = 0; i < location.length-1; i++){ 
            if(!pointer.hasOwnProperty(location[i])){ return false; }
            pointer = pointer[location[i]]; 
        }
        return true;
    }

    set(location, value){
        var pointer = this.data
        for(var i = 0; i < location.length-1; i++){ 
            if(!pointer.hasOwnProperty(location[i])){ pointer[location[i]] = {}; }
            pointer = pointer[location[i]]; 
        }
        pointer[location[location.length-1]] = value
        this.store()
    }

    load(){
        if(localStorage.getItem(Storage.name) == null){ this.init() }
        this.data = {...this.data, ...JSON.parse(localStorage.getItem(Storage.name))}
        this.set("storage/lastaccess".split("/"),Date.now())
        this.loaded = true
    }

    store(){
        this.data.storage.laststore = Date.now()
        localStorage.setItem(Storage.name,JSON.stringify(this.data));
    }

    getPointer(location){
        return new StoragePointer(this,this.root.concat(location.split("/").filter(l => l != "")))
    }

    init(){
        this.store()
    }

}

Storage.name = "phub_storage"

class StoragePointer {
    
    constructor(storage, location){
        if(storage == undefined){ return false; }
        this.storage = storage
        this.root = this.storage.root.concat(location)
        this.pointers = []
    }

    get(location){
        return this.storage.get(this.root.concat(location.split("/")))
    }

    exists(location){
        return this.storage.exists(this.root.concat(location.split("/")))
    }

    set(location, value){
        return this.storage.set(this.root.concat(location.split("/")),value)
    }

    getPointer(location){
        this.pointers.push(new StoragePointer(this.storage,this.root.concat(location.split("/").filter(l => l != ""))))
        return this.pointers[this.pointers.length-1]
    }

}

function dbl(n){
    if(n < 10){ return "0"+n; }
    return n.toString();
}