var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var Comment=require("../models/comments")

// Comments

router.get("/campground/:id/comments/new",isLoggedIn, function(req,res){
    Campground.findById(req.params.id,function(err,x){
        if(err){
            console.log(err)
        }
        else{
         res.render("comments/makingcomment",{campground:x,currentUser:req.user})
 
        }
    })
    
 })
 
 router.post("/campground/:id/comments",isLoggedIn,function(req,res){
     Campground.findById(req.params.id,function(err,y){
         if(err){
             console.log(err)
         }
         else{
             Comment.create(req.body.comment,function(err,comment){
                 if(err){
                     console.log(err)
                 }
                 else{
                     y.comments.push(comment);
                     y.save();
                     res.redirect("/campground/"+y._id);
                 }
             })
         }
     })
 })

 function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())  // <-- typo here
        return next();
    res.redirect('/login');
}

 module.exports=router;