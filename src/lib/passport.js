const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');


passport.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done)=>{
    console.log('user',username);
    const rows = await pool.query('call GetByUsertag(?)', [username]);
    rows.pop();
    if(rows[0].length > 0){
        const user = rows[0][0]; 
        console.log('userss', user);
        console.log('pass',password);
        console.log('usuario',username);
        if(password == user.pass){          
            done(null, user, req.flash('success', 'Buenas ' +user.usertag));
            
        }else{
            done(null, false,req.flash('message', 'Contraseña incorrecta'));
        }
    }else{
        done(null, false,req.flash('message', 'Usuario incorrecto'));
    }
}));

passport.serializeUser((user,done)=>{
    done(null, user.id_usuario);
});
passport.deserializeUser(async (id,done)=>{
    const rows = await pool.query('call getUsuG(?)', [id]);
    const user = rows[0][0];
    done(null, user);
});