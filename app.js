//jshint esversion6


const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const ejs = require("ejs");
const mongoose = require("mongoose");
const unique = require("mongoose-unique-validator");
// const session = require("express-session");
// const passport = require("passport");
// const passportLocalMongoose = require("passport-local-mongoose");
// const findOrCreate = require("mongoose-findorcreate");
// const LocalStrategy = require('passport-local').Strategy;






const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public/"));


// app.use(session({
//     secret: "My little secret.",
//     resave: false,
//     saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/customerDB",{useNewUrlParser: true,useUnifiedTopology:  true,useFindAndModify: true,useCreateIndex: true});

const customerSchema = new mongoose.Schema({
    email: String,
    name: {type: String, unique: true},
    subject: String,
    message: String
   
});

const subscriberSchema = new mongoose.Schema({
    mails: {
        type: String,
        unique: true
    }
});

const itemSchema = new mongoose.Schema({
    itemName:{type: String, unique: true},
    brand: String,
    color: String,
    description: String,
    price: String,
    specification: String
});

// customerSchema.plugin(passportLocalMongoose);
// customerSchema.plugin(findOrCreate);

const Customer = new mongoose.model("Customer", customerSchema);
const Subscriber = new mongoose.model("Subscriber", subscriberSchema);
const Item = new mongoose.model("Item", itemSchema);
// passport.use(Customer.createStrategy());

// passport.serializeUser(Customer.serializeUser());
// passport.deserializeUser(Customer.deserializeUser());

app.get("/",function (req,res) {
    res.render("index");
});


app.get("/about",function (req,res) {
    res.render("about");
});

app.get("/shop",function (req,res) {
    res.render("shop");
});

app.get("/shop-single",function (req,res) {
    res.render("shop-single");
});


app.get("/contact",function (req,res) {
    res.render("contact");
})


// app.post("/",function (req,res) {
//     alert("thanks for subscribing");
//     res.redirect("/");
// });


app.post("/",function (req,res) {
    const newSubscriber = req.body.subscriber;

   const subscriber = new Subscriber({
       mails: newSubscriber
   });
   Subscriber.find({},function (foundSubscriber) {
       if(foundSubscriber){
           console.log("Your have already subscribe");
       }else{
           subscriber.save(function (err) {
               if(err){
                   console.log(err);
               }else{
                   console.log("New subscriber added to DB");
                   res.redirect("/");
               }
           });
       }
   });
//    customer.save();
//    res.redirect("/");
});

app.post("/contact",function (req,res) {
    const cName= req.body.name;
    const cMessage = req.body.message;
    const cSubject = req.body.subject;
    const cEmails = req.body.email;

    const cDetail = new Customer({
        name: cName,
        message: cMessage,
        subject: cSubject,
        email: cEmails
    });

    cDetail.save(function (err) {
        if(err){
            console.log(err);
        }else{
            console.log("New Customer Details save to DB");
            res.redirect("/");
        }
        
    })
});

app.get("/addtocart/:id",function (req,res) {
    const productId = req.params.id;

    
});


app.get("/shop-single/:items",function (req,res) {
   console.log(req.params.items); 
});


app.get("/compose",function (req,res) {
    res.render("compose");
});

app.post("/compose",function (req,res) {
   
    const itemName = req.body.itemName;
    const price = req.body.price;
    const brand = req.body.brand;
    const description = req.body.description;
    const color = req.body.color;
    const specification = req.body.specification;

    const item =  new Item({
        itemName: itemName,
        brand: brand,
        color: color,
        description: description,
        price: price,
        specification: specification
    });

    item.save(function (err) {
        if(err){
            console.log(err);
        }else{
            console.log("New Item Store in DB");

        Item.findOne({itemName: itemName},function (err,item) {
            res.render("shop-item",{item: item});
            // console.log(item);
        });
        // console.log(item);
        }
    });

    

});


app.post("/shop-item",function (req,res) {

    const itemName = req.body.itemName;
    const price = req.body.price;
    const brand = req.body.brand;
    const description = req.body.description;
    const color = req.body.color;
    const specification = req.body.specification;

    const item =  new Item({
        itemName: itemName,
        brand: brand,
        color: color,
        description: description,
        price: price,
        specification: specification
    });

      item.save(function (err) {
        if(err){
            console.log(err);
        }else{
            console.log("New Item Store in DB");

        Item.findOne({itemName: itemName},function (err,item) {
            res.render("shop-item",{item: item});
            // console.log(item);
        });
        // console.log(item);
        }
        
    });

    


        // res.render("shop-item",{item: item});
    });



app.get("/shop-item",function (req,res) {
    res.render("shop-item",{item: item});
});



// SEARCH ROUTE

app.post("/search",function (req,res) {
    
    const qSearch = req.body.q;

    Item.findOne({itemName: qSearch},function (err,foundItem) {
        if(err){
            console.log(err);
        }else if(!foundItem){
            console.log("This Item is not store in Database");
        }
        else{
            res.render("shop-single");
            // console.log(foundItem);
        }
    });

})


//SEARCH ROUTE PARAMETERS


app.get("/search/:searchName",function (req,res) {
    
    // const qSearch = _.lowerCase(req.params.searchName);
    const qSearch = req.params.searchName;

    Item.findOne({itemName: qSearch},function (err,item) {
        if(err){
            console.log(err);
        }else if(!item){
            console.log("This Item is not store in Database");
        }
        else{            
            res.render("search",{
                item: item.itemName,
                brand: item.brand,
                price: item.price,
                description: item.description,
                specification: item.specification,
                color: item.color
            });
            // console.log(item.itemName);
        }
    });


      
});



// app.get("/search/:q(\d+)",function (req,res) {
    
//     const qSearch = req.params.q;

//     Item.findOne({itemName: qSearch},function (err,foundItem) {
//         if(err){
//             console.log(err);
//         }else if(!foundItem){
//             console.log("This Item is not store in Database");
//         }
//         else{
//             res.render("shop-single");
//             // console.log(foundItem);
//         }
//     });


      
// });














app.listen(3000,function (req,res) {
    console.log("Server has started running on port 3000");
});