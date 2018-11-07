var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");


// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true });

// Routes

// app.get("/", function (req, res) {
//     db.Article.find({}).then(function (results) {
//         //console.log(results);
//         if (results.length > 1) {
//             res.render("index", { articles: results });
//         } else {
//             res.render("index");
//         }
//     }).catch(function (err) {
//         console.log(err);
//         return res.json(err);
//     });
// });
// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with request
    axios.get("https://aramajapan.com/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $("div.news-post").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(element).find("h2").find("a").text();
            result.date = $(element).find("div.share-module").find("div").find("span").attr("alt");
            result.link = $(element).find("h2").find("a").attr("href");
            result.imgLink = $(element).find("img").attr("src");
            result.desc = $(element).find("div").find("p").text();
            result.saved = false;


            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    // console.log(dbArticle);
                    res.render("index", { articles: result });
                })
                .catch(function (err) {
                    // If an error occurred, send it to the client
                });
        });

        // If we were able to successfully scrape and save an Article, send a message to the client
        res.send("Scrape Complete");
    });
});
// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (result) {
            // If we were able to successfully find Articles, send them back to the client
            res.render("index", { articles: result });

        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});


app.get("/articles", function (req, res) {
    db.Saved.find({}).then(function (result) {
        result.saved = true;
        res.render("saved", { articles: result });
    })
})
app.get("/api/savedArticles", function (req, res) {
    // Grab every document in the Articles collection
    db.Articles.find({}). // Find all Saved Articles
    then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    }).catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// // Route for grabbing a specific Article by id, populate it with its note
app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("note")
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// saved articles
app.post("/save", function (req, res) {
    var data = req.body.id;

    // db.Article.findOneAndUpdate({ _id: req.params.id }, { { "saved": true } }, { new: true }).then((function (results) {
    //     res.json(results);
    //     res.render("saved", results);
    // }))


});


// Route for showing saved articles
app.get("/mysaved", function (req, res) {
    db.Article.find({ saved: true }, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.json(data);
        }
    });
});

// Delete Comment 
app.post("/api/deleteComment", (req, res) => {
    // console.log("delete comment route hit")
    let comment = req.body;
    db.Notes.findByIdAndRemove(comment["_id"]). // Look for the Comment and Remove from DB
        then(response => {
            if (response) {
                res.send("Sucessfully Deleted");
            }
        });
}); 

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});


// Pseudo-coding the rest because... 
// Ideally, I would like the app to open up with a button that will allow the user to scrape from the website and render into the pageXOffset. 
// The comments that the page allows you to make would return when the user clicks on it and can be deleted by the user if they wish. 
// The "/scrape" page would redirect to the "articles" page with the results of the scrape and would allow the user to save articles. 
// They can later access the saved articles and remove them whenever.