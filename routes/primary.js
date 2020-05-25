var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var Comment=require("../models/comments")
var mongoose=require("mongoose");

//For creating new blog
router.get("/campgrounds/new",isLoggedIn,function(req,res){
    res.render('making',{currentUser:req.user})
    })
    
    //Shows all blogs
    router.get("/campground",function(req,res){
        var currentUser;
        Campground.find({},function(err,campgrounds){
            if(err){
                console.log(err)
            }
            else{
                res.render("campground",{campgrounds:campgrounds,currentUser:req.user})
            }
        })
    })
    
    // Adding BLOGS
    router.post("/addcampground",isLoggedIn,function(req,res){
        var newname=req.body.name
        var newimage=req.body.image
        var newinfo=req.body.description
        var newauthor={
            id:req.user._id,
            username:req.user.username
        }
        var newcampground={name:newname,image:newimage,description:newinfo,author:newauthor};
        
        Campground.create(newcampground,function(err,x){
            if(err){
                console.log(err)
            }
            else{
                
                res.redirect('/campground')
            }
        })
        
       
    })
    
    //Opening articles
    router.get("/campground/:id",function(req,res){
        var sp=req.params.id
        Campground.findById(sp).populate("comments").exec(function(err,foundCampground){
            if(err){
                console.log(err);
            }
            else{
                console.log(foundCampground)
                res.render("show",{campground:foundCampground,currentUser:req.user})
            }
        })
        
    })

    //editing articles
    router.get("/campground/:id/edit",checkOwnership,function(req,res){
        Campground.findById(req.params.id,function(err,foundCampground){
            res.render("edit",{campground:foundCampground,currentUser:req.user});
        })
    
           
        
        
    })

    router.put("/campground/:id",checkOwnership,function(req,res){
        Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedcampground){
            if(err){
                res.redirect('/campground')
            }
            else{
                res.redirect("/campground/"+req.params.id)

            }
        })
        
    })

    router.delete("/campground/:id",checkOwnership,function(req,res){
        Campground.findByIdAndRemove(req.params.id,function(err){
            if(err){
                console.log(err)

            }
            else{
                res.redirect("/campground")
            }
        })
    })

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())  // <-- typo here
            return next();
        res.redirect('/login');
    }

    function checkOwnership(req,res,next){
        if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                res.redirect("back");
            }
            else{
                if(foundCampground.author.id.equals(req.user._id)){
                    next();

                }
                else{
                    res.redirect("back")
                }

            }
        })

    }
    else{
        
        res.redirect("back"); 
    }

    }
module.exports=router;