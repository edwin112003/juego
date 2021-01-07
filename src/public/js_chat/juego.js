
document.getElementById('player').addEventListener("click", addPoints);

var points = 0;
var seconds = 500;
var myvar = setInterval(function() {
    document.getElementById("time").innerHTML = seconds--;
    if (seconds == -1) {
        document.getElementById("time").innerHTML = 0;
        $('#exampleModalCenter').modal('show');
        document.getElementById('player').removeEventListener("click", addPoints);
        stop()
    }
}, 1000);
function stop() {
    clearInterval(myvar);
}
function addPoints() {
    points++;
    console.log("aber");
    console.log(points);
    document.getElementById("puntos").innerHTML = points;
    document.getElementById("puntos2").innerHTML = points;
    rand = Math.round(Math.random()*450);
    rand2 = Math.round(Math.random()*450);
    document.getElementById("player").style.opacity = 0;
    setTimeout(() => {
        document.getElementById("player").style.marginTop = rand + "px";
        document.getElementById("player").style.marginLeft = rand2 + "px";
        document.getElementById("player").style.opacity = 1;
    }, 200);
    
}