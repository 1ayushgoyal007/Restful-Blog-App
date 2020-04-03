var express = require("express");
var app = express();
var methodOverride= require("method-override");
var ejs = require("ejs");
var expressSanitizer = require("express-sanitizer");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
//DB Schema and Model
mongoose.connect("mongodb://localhost/restful_blog_app");
var blogSchema = new mongoose.Schema({
    title:String,
    image: String,
    body:String,
    created: {type:Date,default:Date.now}
}); 
var Blog =  mongoose.model("blog",blogSchema);



//Restful Routes

app.get("/",function(req,res){
    res.redirect("/blogs"); 
})

app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs:blogs});
        }
    })
})


//New Route

app.get("/blogs/new",function(req,res){
    res.render("new");
})


//Create Route
app.post("/blogs",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    })
})

//Show Route
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id.trim(),function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
            
        }else{
            console.log(req.params.id.trim());
            res.render("show",{blog:foundBlog});
        }
    })
});


//Edit Route
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id.trim(),function(err,foundBlog){
        if(err){
            res.send(req.params.id.trim());
        }else{
            res.render("edit",{blog: foundBlog});
        }
    })
})

//Update Route(PUT)

app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id.trim(),req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+ req.params.id.trim());
        }
        });
});

//Delete Route
app.delete("/blogs/:id",function(req,res){
    //destory blog and then redirect.
    Blog.findByIdAndRemove(req.params.id.trim(),function(err){
        if(err){
            console.log(req.params.id);
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
})



app.listen(5050,function(){
    console.log("Server is listening at port 5050");
})


