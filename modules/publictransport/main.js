/**
 * Displays upcoming connections
 * @author Philippe Hugo <info@phlhg.ch>
 * @extends Module
 */
class PublicTransportModule extends Module {
    
    constructor(...v){
        super(...v)
        this.interval;
        this.connections = [];
        this.init()
    }

    init(){
        this.root.innerHTML = ``;
        this.generateConnections()
    }

    generateConnections(){
        fetch(this.path+"stations.json").then(rspn => {
            if(!rspn.ok){ return false; }
            return rspn.json();
        }).then(function(stations){
            stations.forEach(s => {
                s.connections.forEach(c => {
                    for(var h = 0; h < 24; h++){
                        if(
                            (c.last > c.first && h >= c.first && h <= c.last) | 
                            (c.last < c.first && ((h >= c.first && h <= 23) | (h <= c.last && h >= 0))) |
                            c.last == c.first
                        ){
                            var utc = (h*60+c.time)*60*1000
                            this.connections.push({
                                "name": c.name,
                                "type": c.type,
                                "station": s.name,
                                "heading": c.heading,
                                "time": {
                                    "utc": utc,
                                    "r": utc - s.distance*60*1000,
                                    "h": h,
                                    "m": c.time          
                                }
                            })
                        }
                    }
                })
            })
            this.update();
            this.interval = setInterval(() => this.update(),1000*60)
        }.bind(this))
    }

    getConnections(amount){
        var time = this.gettime();

        this.connections = this.connections.sort(function(a,b){
            var at = a.time.r;
            var bt = b.time.r;
            var atime = (at < time ? at+24*60*60*1000 : at)
            var btime = (bt < time ? bt+24*60*60*1000 : bt)
            return atime - btime;
        })

        return this.connections.slice(0,amount);
    
    }

    update(){
        this.root.innerHTML = '';
        var time = this.gettime();
        this.getConnections(9).forEach(c => {
            var walk = Math.ceil((c.time.r-time < 0 ? c.time.r+24*60*60*1000-time : c.time.r-time)/1000/60);
            var walkh = Math.max(Math.floor(walk/60),0);
            var walkm = walk-walkh*60;
            this.root.innerHTML += '<div class="phub_connection"><span class="phub_connection_name '+c.type+'">'+c.name+'</span>'+c.heading+'<span style="float: right">'+dbl(c.time.h)+':'+dbl(c.time.m)+'</span><span class="phub_connection_meta">'+c.station+' <span style="float: right">'+(walk > 0 ? (walkh > 0 ? walkh+"h " : "")+walkm+'\'' : "> ")+'</span></span></div>'; 
        })
    }

    setup(){
        this.setupFinished();
    }

    gettime(){
        var d = new Date();
        return ((d.getHours()*60+d.getMinutes())*60+d.getSeconds())*1000;
    }
}