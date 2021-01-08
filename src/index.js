const express = require('express');
const path = require('path');
//buenas

const exphbs = require('express-handlebars');
const session = require('express-session');
const validator = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); 
const formatMessage = require('./lib/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./lib/users');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const router = express.Router();

const { captureRejectionSymbol } = require('events');

require('./lib/passport');

//configurar el servidor
var port = process.env.PORT || 8080;
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout : 'main',
    layout: 'login',
    layoutsDir: path.join(app.get('views'),'layouts'), 
    partialsDir: path.join(app.get('views'),'partials'),
    extname : '.hbs'
}));
app.set('view engine', '.hbs');


//Middlewares
app.use(session({
  secret: 'abcdefg',
  resave: true,
  saveUninitialized: false
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(passport.initialize());
app.use(passport.session());


//socket


//globales

app.use((req,res,next)=>{
  app.locals.success = req.flash('success');
  app.locals.message = req.flash('message'); 

    app.locals.user = req.user;
    next();
});

//Manejo de errores

//ruta
app.use(require('./routes'));
app.use('/links',require('./routes/links'));
const botName = 'Onclass bot';
let contador1 = 0;
let contador2 = 0;
let contador3 = 0;
let contador4 = 0;
let contador5 = 0;

let s1_j1 = {score: 0, user:"", win:false};
let s1_j2 = {score: 0, user:"", win:false};
let s2_j1 = {score: 0, user:"", win:false};
let s2_j2 = {score: 0, user:"", win:false};
let s3_j1 = {score: 0, user:"", win:false};
let s3_j2 = {score: 0, user:"", win:false};

let s4_j1 = {score: 0, user:"", win:false};
let s4_j2 = {score: 0, user:"", win:false};
let s5_j1 = {score: 0, user:"", win:false};
let s5_j2 = {score: 0, user:"", win:false};
io.on('connection', (socket) => {
    console.log('entrada de nuevo socket');
    socket.on('joinRoom', ({ username, room }) => {
      console.log('se conecta a',room);
      if(room == 1){
        
        if(contador1>=2){
          contador1++;
          console.log('asda');
          io.emit('desconectar',username);
          console.log('nooooooooooooooooo');
        }
        if(contador1<2){
          contador1++;
          console.log('contador1',contador1);
          if(contador1 == 2){
            io.emit('partida');
            console.log('partida1');
          }
        }
        
      }
      if(room == 2){
        if(contador2>=2){
          contador2++;
          console.log('asda');
          io.emit('desconectar',username);
          console.log('nooooooooooooooooo');
        }
        if(contador2<2){
          contador2++;
          console.log('contador2',contador2);
          if(contador2 == 2){
            io.emit('partida');
            console.log('partida1');
          }
        }
      }
      if(room == 3){
        if(contador3>=2){
          contador3++;
          console.log('asda');
          io.emit('desconectar',username);
          console.log('nooooooooooooooooo');
        }
        if(contador3<2){
          contador3++;
          console.log('contador3',contador3);
          if(contador3 == 2){
            io.to(room).emit('partida');
            console.log('partida1');
          }
        }
      }
      if(room == 4){
        if(contador4>=2){
          contador4++;
          console.log('asda');
          io.emit('desconectar',username);
          console.log('nooooooooooooooooo');
        }
        if(contador4<2){
          contador4++;
          console.log('contador4',contador4);
          if(contador4 == 2){
            io.to(room).emit('partida');
            console.log('partida1');
          }
        }
      }
      if(room == 5){
        if(contador5>=2){
          contador5++;
          console.log('asda');
          io.emit('desconectar',username);
          console.log('nooooooooooooooooo');
        }
        if(contador5<2){
          contador5++;
          console.log('contador5',contador5);
          if(contador5 == 2){
            io.to(room).emit('partida');
            console.log('partida1');
          }
        }
      }
      const user = userJoin(socket.id, username, room);
      socket.join(user.room);
      // Welcome current user
      // Broadcast when a user connects
      socket.broadcast
            .to(user.room)
          .emit(
          'message',
          formatMessage(botName, `${user.usertag} se ha unido al chat :)`)
        );
      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    // jcndskjvkdjfvbkjcxvjkxc  });
    socket.on('F_room', ({ username, score , room }) => {
      console.log('user:',username,"score:",score);
      if(room == 1 && s1_j1.score == 0){
        s1_j1.score = score;
        s1_j1.user = username;
        console.log("primero", s1_j1.user);
        console.log("pri_score", s1_j1.score);
      }  
      else if(room == 1 && s1_j1.score != 0){
        s1_j2.score = score;
        s1_j2.user = username;
        console.log("seguns", s1_j2.user);
        console.log("pri_score", s1_j2.score);
      }
      if (s1_j1.score > s1_j2.score ) {
        console.log('gana jugador1');
          //Gana jugador uno
          io.to(room).emit('score', {
            usertag: s1_j1.user             
          });
      } else if(s1_j1.score < s1_j2.score){
        console.log('gana jugador 2'); 
        //Gana jugador dos
        
        io.to(room).emit('score', {
          usertag: s1_j2.user
        });
      }else if(s1_j1.score == s1_j2.score){
          //Empate
          io.to(room).emit('score', {
            usertag: "NO"
          });
      }
      if(room == 2 && s2_j1.score == 0){
        s2_j1.score = score;
        s2_j1.user = username;
      }
      if(room == 2 && s2_j1.score != 0){
        s2_j2.score = score;
        s2_j2.user = username;
      }

      if (s2_j1.score > s2_j2.score && room == 2 ) {
        //Gana jugador uno
        io.to(room).emit('score', {
          usertag: s2_j1.user
        });
    } else if(s2_j1.score < s2_j2.score && room == 2){
      //Gana jugador dos
      io.to(room).emit('score', {
        usertag: s2_j2.user
      });
    }else if(s2_j1.score == s2_j2.score && room == 2){
        //Empate
        io.to(room).emit('score', {
          usertag: "NO"
        });
    }

      if(room == 3 && s3_j1.score == 0 ){
        s3_j1.score = score;
        s3_j1.user = username;
      }
      if(room == 3 && s3_j1.score != 0){
        s3_j2.score = score;
        s3_j2.user = username;
      }

      if (s3_j1.score > s3_j2.score && room == 3) {
        //Gana jugador uno
        io.to(room).emit('score', {
          usertag: s3_j1.user
        });
    } else if(s3_j1.score < s3_j2.score && room == 3){
      //Gana jugador dos
      io.to(room).emit('score', {
        usertag: s3_j2.user
      });
    }else if(s3_j1.score == s3_j2.score && room == 3){
        //Empate
        io.to(room).emit('score', {
          usertag: "NO"
        });
    }

      if(room == 4 && s4_j1.score == 0){
        s4_j1.score = score;
        s4_j1.user = username;
      }
      if(room == 4 && s4_j1.score != 0){
        s4_j2.score = score;
        s4_j2.user = username;
      }

      if (s4_j1.score > s4_j2.score && room == 4) {
        //Gana jugador uno
        io.to(room).emit('score', {
          usertag: s4_j1.user
        });
    } else if(s4_j1.score < s4_j2.score && room == 4){
      //Gana jugador dos
      io.to(room).emit('score', {
        usertag: s4_j2.user
      });
    }else if(s4_j1.score == s4_j2.score && room == 4){
        //Empate
        io.to(room).emit('score', {
          usertag: "NO"
        });
    }

      if(room == 5 && s5_j1.score == 0){
        s5_j1.score = score;
        s5_j1.user = username;
      }
      if(room == 5 && s5_j1.score != 0){
        s5_j2.score = score;
        s5_j1.user = username;
      }
      if (s5_j1.score > s5_j2.score && room == 5 ) {
        //Gana jugador uno
        io.to(room).emit('score', {
          usertag: s5_j1.user
        });
    } else if(s5_j1.score < s5_j2.score && room == 5){
      //Gana jugador dos
      io.to(room).emit('score', {
        usertag: s5_j2.user 
      });
    }else if(s5_j1.score == s5_j2.score && room == 5){
        //Empate
        io.to(room).emit('score', {
          usertag: "NO"
        });
    }
    });
    // Runs when client disconnects
    
    });
    socket.on('disconnect', () => {
      const user = userLeave(socket.id);
      if (user) {
        
        if(user.room == 1){
          contador1--;
          console.log('contador1',contador1);
        }
        if(user.room == 2){
          contador2--;
          console.log('contador2',contador2);
        }
        if(user.room == 3){
          contador3--;
          console.log('contador3',contador3);
        }
        if(user.room == 4){
          contador4--;
          console.log('contador4',contador4);
        }
        if(user.room == 5){
          contador5--;
          console.log('contador5',contador5);
        }
           
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room) 
        });
      }      
    });
});
//archivos publicos

//inciar servidor
http.listen(app.get('port'), ()=>{
    console.log('Server en : ', app.get('port'));  
});