const express = require('express'),
bodyParser = require('body-parser'),
path = require('path'),
flash = require('connect-flash'),
session = require('express-session'),
passport = require('passport'),
http = require('http'),
fs = require('fs'),
cookieParser = require('cookie-parser'),
helmet = require('helmet'),
db = require('./routes/tools/db'),
pp = require('./routes/tools/passport');

function ensureAuthenticated (req,res,next){
    if(req.isAuthenticated()){
        //req.isAuthenticated() will return true if user is logged in
        next();
    } else{
        res.redirect("/login");
    }
}

//configure express
const app = express();
app.set('view engine', 'ejs');



app.use(bodyParser.json({limit: '200mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));

//Session stuff
app.use(cookieParser('/3672hjeawgz!$%T'));
app.use(session({
    cookie: { httpOnly: false,
              secure: false,
              maxAge:  6*60*60*1000
            },
    unset: 'destroy',
    resave: false,
    secret: 'putsecrethere',
    name: 'id',
    saveUninitialized: false
}));

app.use(flash());
app.use(helmet());

app.use(passport.initialize());
app.use(passport.session());


app.use('/explorer',require('./routes/explorer_routes'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/storage',[ensureAuthenticated, express.static('./storage')]);

//get routes

app.get('/', function(req, res){
  res.redirect('/explorer');
});

app.get('/login', function (req, res) {
  res.render('login', {title:'Login',
                       err:req.flash('error'),
                       msg:req.flash('msg'),
                       pass:(req.query.pass ? req.query.pass : ''),
                       username:(req.query.username ? req.query.username : ''),
                       isauth:req.isAuthenticated()
                     });
});

app.get('/logout', ensureAuthenticated, function(req, res){
  req.logout();
  res.redirect('/');
});

//post routes
app.post('/login', passport.authenticate('local-login', {failureRedirect: '/login', failureFlash: true}), function(req, res) {
  res.redirect('/explorer');
});
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.send('Error');
});

app.get('*',function (req, res){
  res.send('404');
});

app.post('*', function (req, res){
  res.send('404');
});

http.createServer(app).listen(3000);
