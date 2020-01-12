// Dependencies
var express = require("express");
var router = express.Router();

// *** Scraping Tools *** //
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");

// *** Route for Scraping *** //
router.get("/scrape", function(req, res) {
    // Get the entire body of the html with a request.
    axios.get("https://www.npr.org/sections/news/")
    .then(function(response) {
        // Load the response into cheerio and save it as a short-hand selector "$"
        var $ = cheerio.load(response.data);

        // Get every h1 within an article tag...
            $("article h2").each(function(i, element) {
                // Save an empty result object
                var result = {};
                result.title = $(this)
                    .children('a')
                    .text();
                result.link = $(this)
                    .children('a')
                    .attr('href')
                result.summary = $(this)
                    .children('a')
                    .text();

            // Create a new Article with the `result` object built from scraping.
            db.Article.create(result)
            .then(function(dbArticle) {
                // View the added result in the console:
                // console.log(dbArticle);
            })
            .catch(function(error) {
                // Send the error, if it exists.
                return res.json(error);
            });
        });

        // Alert the client if the scrape was completed:
        res.send("Scrape was successful!");
    });
});

// *** Routes to export to server.js *** //

// Route to get all Articles from the db.
router.get("/", function(req, res) {
    // Limit set to only show first 20 articles.
    db.Article.find({}).limit(20)
    .then(function(scrapedData) {
        // Save all scraped data into a handlebars object.
        var hbsObject = {articles:scrapedData};
        console.log(hbsObject);
        // Send all found articles as an object to be used in the handlebars receieving section of the index.
        res.render("index", hbsObject);
    })
    .catch(function(error) {
        // If an error occurs, send the error to the client.
        res.json(error);
    });
});


// Route for getting all Articles from the db
router.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
    .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
    })
    .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
    })
    .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
    });
});

// Route to save an Article.
router.put("/saved/:id", function(req, res) {
    // Update the article's boolean "saved" status to 'true.'
    db.Article.update(
        {_id: req.params.id},
        {saved: true}
    )
    .then(function(result) {
        res.json(result);
    })
    .catch(function(error) {
        // If an error occurs, send the error to the client.
        res.json(error);
    });
});

// Route to drop the Articles collection.
router.delete("/drop-articles", function(req, res, next) {
    db.Article.remove({}, function(err) {
        if (err) {
            console.log(err)
        } else {
            console.log("articles dropped!");
        }
    })
    .then(function (dropnotes) {
        db.Note.remove({}, function(err) {
            if (err) {
                console.log(err)
            } else {
                console.log("notes dropped!");
            }
        })
    })
});

module.exports = router;