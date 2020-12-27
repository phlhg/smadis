/**
 * Displays the current time and date
 * @author Philippe Hugo <info@phlhg.ch>
 * @extends Module
 */
class ClockModule extends Module {
    
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
        var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
        var months = ["January","Feburary","March","April","May","June","July","August","September","October","November","December"]
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