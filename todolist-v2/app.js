//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

mongoose.set("strictQuery", true);

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');



const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Buy groceries."
});
const item2 = new Item({
  name: "Study Web Development."
});
const item3 = new Item({
  name: "Journaling."
});

const defaultItems = [item1, item2, item3];



const listSchema = new mongoose.Schema ({
  name: String,
  items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);



app.get("/", function(req, res) {
 
  Item.find({}, function(err, foundItems){
    if (!err){
      if (foundItems.length === 0){
        Item.insertMany(defaultItems, function(err){
          if (err){
            console.log(err);
          } else {
            console.log("Successfully inserted the documents");
          };
        });
        res.redirect("/");

      } else {
        res.render("list", {listTitle: day, newListItems: foundItems});
      };
    };
  });
  
  const day = date.getDate();
  
});



app.get("/list/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);
  console.log(customListName);

  List.findOne({name: customListName}, function(err, listFound){
    if (!err){
      if (!listFound){
        // Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
         list.save();
         res.redirect("/list/" + customListName);
      } else {
        // Show an existing list
        res.render("list", {listTitle: listFound.name, newListItems: listFound.items});
      };
  }});

});



app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;
  console.log("listName: " + listName);

  const nextItem = new Item({
    name: itemName
  });

  if (listName === date.getDate()){
    nextItem.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList){
      if (!err){
        foundList.items.push(nextItem);
        foundList.save();
        res.redirect("/list/" + listName);
      };
    });
  };
});



app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === date.getDate()){
    Item.findByIdAndRemove(checkedItemId, function(err){
      if (!err){
        console.log("Successfully deleted the item.");
      } else {
        console.log(err);
      } 
    });
  
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      {name: listName}, 
      {$pull: {items: {_id: checkedItemId}}},
      function(err, foundList){
        if (!err){
          res.redirect("/list/" + listName);
        };
      });
  };

});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
