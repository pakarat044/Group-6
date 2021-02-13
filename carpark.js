
var array = []; //display each slot
var d = new Date();
array[0] = {'status':false,'timestampz':d.getTime()}
array[1] = {'status':false,'timestampz':d.getTime()}
array[2] = {'status':false,'timestampz':d.getTime()}
array[3] = {'status':false,'timestampz':d.getTime()}

//UpdateSlot(3,true,d.getTime()); //for testing
//UpdateSlot(2,true,d.getTime()); //for testing

function getData(){
//fetch('http://exceed6.cpsk-club.xyz/slot', {method: "GET", header: {"Content-Type": "application/json"}})
fetch("http://exceed6.cpsk-club.xyz/slot",{ //wait for backend URL
method:"GET",
headers:{"Content-Type":"application/json"},
})
.then((response)=>(response.json()))
.then((datas)=>
    datas["result"].forEach((data) => { 
       console.log(data)
        var isOccuped = true;
        if(data.status == "available"){
            isOccuped = false;
            if(isOccuped != array[data.slot_id-1].status){ //false -> true
                popUpCash(data.slot_id);
            }

        }
        array[data.slot_id-1].status = isOccuped;
        array[data.slot_id-1].timestampz = data.start*1000;
    })
    );
}

function popUpCash(num){
    var timez = myFunction(array[num-1].timestampz); //เวลาที่จอดรถ
    timez = timez.split(":");
     var money = 20*(timez[0]*60+timez[1])
    alert("pay: "+money);

    console.log("Slot "+num+ " have parked for "+timez[0]+"hr "+timez[1]+" min. Total cost is "+coin(num));
}

function myFunction(n) {
    var minutes = 1000 * 60;
	var hours = minutes * 60;
	var d = new Date();
	var t = d.getTime();
	var hour = Math.floor((t-n)/ hours);
	var min = Math.ceil(((t-n)%minutes)/10000);
    return hour+":"+min;
  }
  
  function coin(num){
    var timez = myFunction(array[num-1].timestampz) //เวลาที่จอดรถ
    timez = timez.split(":")
    var coinz = 20 * ((timez[0]*60)+timez[1])
    return coinz //return ออกมาเป็นเงินตามเวลาที่จอดรถไป
  }

function UpdateSlot(slot,stat,time){
    array[slot-1].status = stat;
    array[slot-1].timestampz = time;
    console.log("Received slot ",slot," status: ",array[slot-1].status," time:",array[slot-1].timestampz); //show received data
       //do function received : time update, calculate state per slot later
}

 //timer

function update_timer(num){
    var n = array[num-1].timestampz;
	var minutes = 1000 * 60;
	var hours = minutes * 60;
	var d = new Date();
	var t = d.getTime();
	var hour = Math.floor((t-n)/ hours);
	var min = Math.ceil(((t-n)%minutes)/10000);
	document.getElementById("timer"+num).innerHTML = hour + " hr " + min + " min";
	document.getElementById("slot"+num).innerHTML = "O C C U P I E D";
	document.getElementById("front"+num).style.backgroundColor = "crimson";
}
function freeSlot(num){
    document.getElementById("timer"+num).innerHTML = 0+ " hr " + 0 + " min";
	document.getElementById("slot"+num).innerHTML = "A V A I L A B L E";
	document.getElementById("front"+num).style.backgroundColor = "seagreen";
}



function update_all(){
    var i;
    for(i=0;i<4;i++){
        if(array[i].status==true){
            update_timer(i+1);
        }else{
            freeSlot(i+1);
        }
    }
}


getData();
    update_all();

setInterval(()=>{
    getData();
    update_all();
    
},3000);
