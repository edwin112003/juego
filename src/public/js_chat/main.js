const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');


// Get username and room from URL

var username= document.currentScript.getAttribute('username');
console.log('atributo:', username);
var room= document.currentScript.getAttribute('room');
console.log('atributo:', room);
var id= document.currentScript.getAttribute('id');
console.log('id atri:', id);

let file;

const Enviar = ()=>{
  $('#nota').summernote({
    height: 300,                 // set editor height
    minHeight: null,             // set minimum height of editor
    maxHeight: null,             // set maximum height of editor
    focus: true,                  // set focus to editable area after initializing summernote
    toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'underline', 'clear']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['table', ['table']],
        ['insert', ['link', 'picture']],
        ['view', ['codeview', 'help']],
      ]
});
var text = $('#nota').summernote('code');
var texto = 'buenas';
var k = 'pepe';
console.log('lleva');
var array = {id:id_contacto};
fetch("/links/llaves2", {method: 'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(array)}).then(response => response.json()).then(data =>{
  var TC = CryptoJS.AES.encrypt(text, k).toString();
  console.log('rpueba',TC);
  //asimetrico
  console.log('llaves2',data);

  const keyrsa = new JSEncrypt();
 
  keyrsa.setPublicKey(data);

  let kc =keyrsa.encrypt(k);
  console.log('lleve del simetrico cifrada',kc);

  var llaveprivada = localStorage.getItem('llaveprivada');
  keyrsa.setPrivateKey(llaveprivada);
  var cade_c =CryptoJS.SHA1(TC).toString(CryptoJS.enc.Base64);
  console.log('cc',cade_c);
  var array3 = {
    llave_privada : llaveprivada,
    hash : cade_c
  }
  fetch("/links/encriptar", {method: 'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(array3)}).then(response => response.json()).then(data =>{
    console.log('hash',data);
  console.log("n_cccccc",data);
  var ccc_simetrico = CryptoJS.AES.encrypt(data, k).toString();

  var objeto = {
    kc: kc,
    TC : TC,
    TCC : ccc_simetrico,
    id:id_remitente
  }
  socket.emit('fileMessage', objeto); 
  
  });
  
});




         
 }
async function ObtenerSala() {
  var room = document.getElementById('room').value;
  console.log('sala: ',room);
  var array = {room: room};
  await fetch("/links/guardar_sala", {method: 'POST',headers:{'Content-Type': 'application/json'},  body:JSON.stringify(array)});
}

const socket = io();
// Join chatroom


socket.emit('joinRoom', { username, room });

socket.on('desconectar', (nuevo)=>{
  console.log(nuevo, username);
  if(nuevo === username){
    fetch("/links/salir", {method: 'POST'}).then(response => {
      if (response.redirected) {
          window.location.href = response.url;
      }
  })
  .catch(function(err) {
      console.info(err + " url: " + url);
  });; 
  }
  
});
// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});
var points = 0;
socket.on('partida',() => {
  points = 0;
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

function start() {
  function stop_game() {
    clearInterval(partida);
  }

  clearInterval(espera);

  
  var seconds = 5;
  var partida = setInterval( function()  {
      document.getElementById("time").innerHTML = seconds--;
      if (seconds == -1) {
          document.getElementById("time").innerHTML = 0;
          document.getElementById('player').removeEventListener("click", addPoints);
          stop_game()
          console.log(points);
          var score = points;
          var array2 = {
            score : score,
            id : id
          }
          fetch("/links/guardar", {method: 'POST',headers:{'Content-Type': 'application/json'},  body:JSON.stringify(array2)}).then(response => response.json()).then(data =>{
            socket.emit('F_room', { username,score, room});
          });
          
           
      }
    }, 1000);  
  }
  
document.getElementById('player').addEventListener("click", addPoints);
  var seconds2 = 3;
  var espera = setInterval(function() {
    document.getElementById("msg").innerHTML = seconds2--;
    if (seconds2 == 0) {
        document.getElementById("msg").innerHTML = "comienza";
        start();
    }
  }, 1000);   
});

socket.on('score',({usertag}) => {
  console.log(usertag);
  var msg_f = "";
  if (usertag == username) {
    console.log("Ganaste"); 
    msg_f = "Ganaste";
  }else if(usertag == "NO"){
    console.log("HAy empate");
    msg_f = "Empate";
  }else if(usertag != username && usertag != "NO"){
    console.log("perdiste");
    msg_f = "Perdiste";
  }
  document.getElementById("score").innerHTML = msg_f+"&nbsp bro &nbsp&nbsp"+"Puntos:&nbsp&nbsp"+points;
  $('#exampleModalCenter').modal('show');
});



// Message from server

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  elim();
  let ul = document.createElement("ul");
  ul.setAttribute("id", "users");
  document.getElementById("list").appendChild(ul);
  users.forEach(user=>{
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerText = user.username;
    ul.appendChild(li);
  });
 }

 function elim(){
  const userList = document.getElementById('users');
  /*if(!userList){

  }else{
    let padre = userList.parentNode;
    padre.removeChild(userList);
  }*/
  userList.remove();
 }
 