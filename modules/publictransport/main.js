/**
 * Displays upcoming connections
 * @author Philippe Hugo <info@phlhg.ch>
 * @extends Module
 */
class PublicTransportModule extends Module {
    
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