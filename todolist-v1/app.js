const express = require("express");
const date = require(__dirname + "/date.js");

const app = express();

const items = [];
const workItems = [];

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req,res){
    const day = date.getDay();
    res.render("list", {listTitle: day, newListItems: items});
});

app.get("/about", function(req,res){
    res.render("about");
})

app.post("/", function(req,res){

    const item = req.body.newItem;
    console.log(req.body.button);

    if (req.body.button === "Work"){
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    } 
});

app.get("/work", function(req,res){
    res.render("list", {listTitle: "Work List", newListItems: workItems});
})


app.listen(3000, () => console.log("Server is running on port 3000."));
