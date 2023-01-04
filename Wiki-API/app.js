const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set("strictQuery", false);
mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');



const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);


///////////////////////////////////////////// Requests Targetting All Article ///////////////////////////////////////////// 

app.route("/articles")
.get(function(req, res){
    Article.find({}, function(err, foundArticles){
        if (!err){
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})
.post(function(req, res){
    title = req.body.title;
    content = req.body.content;

    console.log(title);
    console.log(content);

    
    const newArticle = new Article ({
        title: title,
        content: content
    });

    newArticle.save(function(err){
        if (!err){
            res.send("Successfully added a new article.");
        } else {
            res.send(err);
        }
    });
})
.delete(function(req, res){
    Article.deleteMany({}, function(err){
        if (!err){
            res.send("Successfully deleted all article.");
        } else {
            res.send(err);
        }
    });
});

///////////////////////////////////////////// Requests Targetting A Specific Article ///////////////////////////////////////////// 

app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticles){
        if (foundArticles){
            res.send(foundArticles);
        } else {
            res.send("No articles matching that title was found.");
        };
    });
})
.put(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        function(err, results){
            if(!err){
                res.send("Successfully updated the content of the selected article.");
            } else {
                res.send(err);
            }
        }
    );
})
.patch(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully updated the selected article.");
            } else {
                res.send(err);
            };
        }        
    )
})
.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Successfully deleted the selected article.");
            } else{
                res.send(err);
            };
        }
    );
});



app.listen(3000, function(){
    console.log("Server is listening on port 3000.");
});
