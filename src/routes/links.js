const express = require('express');
const router = express.Router();
const pool = require('../database');
const passport = require('passport');
const {isLoggedIn, isNotLoggedIn}= require('../lib/auth');

router.get('/index', isNotLoggedIn,(req,res)=>{
    res.render('links/index');
});

router.get('/login', isNotLoggedIn,(req,res)=>{
    res.render('links/login', {layout: 'login'}); 
});
router.post('/login', (req,res,next)=>{
    passport.authenticate('local.login',{        
        successRedirect: '/links/inicio',
        failureRedirect: '/links/login',
        failureFlash: true
    })(req,res,next);
});
router.get('/inicio',isLoggedIn, async (req,res)=>{
    console.log('asdasd',req.app.locals.user);
    const newLink = {
        username: req.app.locals.user.id_usuario, 
        room : 1
    }
    console.log(newLink);
    let sala = newLink.room;
    const scores = await pool.query('call AllScore()');
    scores.pop();
    res.render('links/inicio',{layout:'login',newlink: sala, scores:scores[0]});
});
router.get('/registro', isNotLoggedIn,(req,res)=>{
    res.render('links/registro', {layout: 'login'}); 
}); 
router.post('/registro',async (req,res)=>{
    try {
    const {usertag, contra} = req.body;    
    //aqui hice cambio para meter el for para identidifcar el repetido
    const allusers = await pool.query('call AllUsertag');
    
    const newlink = {
        usertag,
        contra
    };
    console.log(newlink);
    
        for (let i = 0; i < allusers[0].length; i++) {
      if(allusers[0][i].usertag == newlink.usertag){
        req.flash('message', 'Ese usuario ya existe');
         throw res.redirect('/links/registro');          
        }        
    }
     await pool.query('call SaveUsuG(? ,?)',[newlink.usertag, newlink.contra]);
     res.redirect('/links/login');

    } catch (error) {
        console.log(error);
    }
    
      
});
router.post('/sala', isLoggedIn,async (req,res)=>{
    const {room} = req.body;
    const newLink = {
        username: req.app.locals.user.id_usuario,
        room
    }
    console.log(newLink);
    let sala = newLink.room;
    res.render('links/sala',{layout:'login',newlink: sala});
});
router.post('/salir',isLoggedIn,async(req,res)=>{
    console.log('buenasjzkhajsgfljagfashdfgajghdajsdhgaSJDGUASDYFNISDUNAIUNCIABCUAYVSs');
    res.redirect('/links/inicio'); 
});
router.post("/guardar", isLoggedIn, async(req,res)=>{
    const {score,id} = req.body;
    const newlink = {
        score,
        id
    }
        console.log('guardar',req.body);
    const score_antes = await pool.query('call GetScore(?)',[newlink.id]);
    score_antes.pop();
    console.log('scoreantes doble 0',score_antes[0][0].score);
    if(newlink.score > score_antes[0][0].score){
        await pool.query('call SetScore(?,?)',[newlink.score, newlink.id])
    }
    res.json("Guapo");
});
module.exports = router;