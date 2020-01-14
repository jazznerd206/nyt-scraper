var express = require("express");
var router = express.Router();

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("../models");

// NPR scrape route
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

// Articles from the db to handlebars.
router.get("/", function(req, res) {
    db.Article.find({}).limit(15)
    .then((articles) => {
    res.render('index', {articles})
    })
    .catch(function(error) {
        res.json(error);
    });
});


// All articles from the db
router.get("/articles", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

// find article by id, populate it with it's note
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

// set article to saved
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

// view saved articles
router.get('/saved', (req, res) => {
    db.Article.find({ "saved" : true})
    .then((articles => res.render('saved', {articles})))
})

// drop the Articles collection.
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

// post notes
router.post("/articles/:id", function (req, res) {
    let noteBody = req.body;
    let article = req.params.id;
    db.Note.create(noteBody).then(function (response) {
      db.Article.findByIdAndUpdate(article, { $set: { note: response } }, function (err, done) {
        if (err) {
          console.log(err);
        }
        res.send(done);
      });
    });
  });

// delete single note
router.get('/deletenote/:id', (req, res) => {
    let thisId = req.params.id
    console.log(thisId);
    db.Note.findByIdAndDelete(thisId, (err, done) => {
        if (err) {
            console.log(err)
        } else {
            console.log("notes dropped!");
        }
    })
})



module.exports = router;