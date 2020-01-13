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
            $("article").each(function(i, element) {
                // Save an empty result object
                let imageUrl = $(element).find('img').attr('src');
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
                result.imageUrl = imageUrl

            // Create a new Article with the `result` object built from scraping.
            db.Article.create(result)
            .then(function(dbArticle) {
                // View the added result in the console:
                console.log(dbArticle);
            })
            .catch(function(error) {
                // Send the error, if it exists.
                return res.json(error);
            });
        });

        // Alert the client if the scrape was completed:
        res.send('scrape complete. redirecting.')
    });
});

// *** Routes to export to server.js *** //

// Route to get all Articles from the db to handlebars.
router.get("/", function(req, res) {
    db.Article.find({}).limit(15)
    .then((articles) => {
    res.render('index', {articles})
    })
    .catch(function(error) {
        res.json(error);
    });
});


// Route for getting all Articles from the db
router.get("/articles", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

// Route to save an Article.
router.put("/saved/:id", function(req, res) {
    db.Article.update(
        {_id: req.params.id},
        {saved: true}
    )
    .then(function(result) {
        res.json(result);
    })
    .catch(function(error) {
        res.json(error);
    });
});

// Route to view saved articles
router.get('/saved', (req, res) => {
    db.Article.find({ "saved" : {$get:true}})
    .then((result => res.render('index', {result})))
})

// Route to drop the Articles collection.
router.get("/delete-articles", function(req, res, next) {
    db.Article.deleteMany({}, function(err) {
        if (err) {
            console.log(err)
        } else {
            console.log("articles dropped!");
        }
    })
    .then(function (dropnotes) {
        db.Note.deleteMany({}, function(err) {
            if (err) {
                console.log(err)
            } else {
                console.log("notes dropped!");
            }
        })
    })
    res.render('index');
});

module.exports = router;