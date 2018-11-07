// var db = require("../models");
// var axios = require("axios");
// var cheerio = require("cheerio");
// var express = require("express")
// var router = express.Router();

// // Routes

// // router.get("/", function (req, res) {
// //     db.Article.find({}).then(function (results) {
// //         //console.log(results);
// //         if (results.length > 1) {
// //             res.render("index", { articles: results });
// //         } else {
// //             res.render("index");
// //         }
// //     }).catch(function (err) {
// //         console.log(err);
// //         return res.json(err);
// //     });
// // });
// // A GET route for scraping the echoJS website
// router.get("/scrape", function (req, res) {
//     // First, we grab the body of the html with request
//     axios.get("https://aramajapan.com/").then(function (response) {
//         // Then, we load that into cheerio and save it to $ for a shorthand selector
//         var $ = cheerio.load(response.data);


//         // Now, we grab every h2 within an article tag, and do the following:
//         $("div.news-post").each(function (i, element) {
//             // Save an empty result object

//             var result = {};
//             // Add the text and href of every link, and save them as properties of the result object
//             result.title = $(element).find("h2").find("a").text();
//             result.date = $(element).find("div.share-module").find("div").find("span").attr("alt");
//             result.link = $(element).find("h2").find("a").attr("href");
//             result.imgLink = $(element).find("img").attr("src");
//             result.desc = $(element).find("div").find("p").text();


//             // Create a new Article using the `result` object built from scraping
//             db.Article.create(result)
//                 .then(function (dbArticle) {
//                     // View the added result in the console
//                     console.log(dbArticle);
//                     // res.render("index", dbArticle);
//                 })
//                 .catch(function (err) {
//                     // If an error occurred, send it to the client
//                 });
//         });

//         // If we were able to successfully scrape and save an Article, send a message to the client
//         // res.send("Scrape Complete");
//         res.redirect("/");

//     });
// });



// // Route for getting all Articles from the db
// router.get("/", function (req, res) {
//     db.Article.find({})
//         .then(function (dbArticle) {
//             res.json(dbArticle);
//         })
//         .catch(function (err) {
//             res.json(err);
//         });
// });
// router.get("/saved", function(req, res) {
//     db.Article.find({}).then(function(dbArticle) {
//         res.render("saved");
//     })

// });
// router.get("/delete:id", function (req, res) {
//     db.Article.remove({}).then(function(dbArticle) {

//     })
// });

// // // Route for grabbing a specific Article by id, populate it with its note
// router.get("/articles/:id", function (req, res) {
//     // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//     db.Article.findOne({ _id: req.params.id })
//         // ..and populate all of the notes associated with it
//         .populate("note")
//         .then(function (dbArticle) {
//             // If we were able to successfully find an Article with the given id, send it back to the client
//             res.json(dbArticle);
//         })
//         .catch(function (err) {
//             // If an error occurred, send it to the client
//             res.json(err);
//         });
// });

// // Route for saving/updating an Article's associated Note
// router.post("/articles/:id", function (req, res) {
//     // Create a new note and pass the req.body to the entry
//     db.Note.create(req.body)
//         .then(function (dbNote) {
//             // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//             // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//             // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//             return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//         })
//         .then(function (dbArticle) {
//             // If we were able to successfully update an Article, send it back to the client
//             res.json(dbArticle);
//         })
//         .catch(function (err) {
//             // If an error occurred, send it to the client
//             res.json(err);
//         });
// });


//Next we need to work on the save button and on making comments and then styling!