var express=require("express");
var router=express.Router();
var User=require("../models/user");
var passport=require("passport");

router.get("/",function(req,res){
    res.render("home",{currentUser:req.user})
})




//AUTH routes!!!

router.get("/register",function(req,res){
    res.render("register",{currentUser:req.user});
})

router.post("/register",function(req,res){
    var newusername=req.body.username;
    
    var newUser=new User({username:newusername})
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register")
             
        }
        passport.authenticate("local")(req,res,function(){
                res.redirect("/campground")
        })
    })
   
    
   
})

//Shows login page
router.get("/login",function(req,res){
    res.render("login",{currentUser:req.user})
})


router.post("/login",passport.authenticate("local",{successRedirect:"/campground",failureRedirect:"/login"}),function(req,res){});

router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campground")
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())  // <-- typo here
        return next();
    res.redirect('/login');
}

module.exports=router;