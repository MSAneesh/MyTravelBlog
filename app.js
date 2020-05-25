var express=require("express");
var app=express();
var path=require('path')
var bodyParser=require("body-parser");
var passport=require("passport")
var User=require("./models/user")
var LocalStrategy=require("passport-local")
var seedDB=require("./seeds")
var Comment=require("./models/comments")
var methodOverride=require("method-override")

var campgroundroutes=require("./routes/primary");
var commentsroutes=require("./routes/secondary");
var authroutes=require("./routes/authorisation");

seedDB();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost/firstoffdb");
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));



var Campground=require("./models/campground");


//Passport config.
app.use(require("express-session")({
    secret:"vnwnevjn",
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(campgroundroutes);
app.use(commentsroutes);
app.use(authroutes);


app.listen(3000,function(){
    console.log("Server has started")
})