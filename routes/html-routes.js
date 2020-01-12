// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("../models");

module.exports = function(app) {
    app.get('/', (function(req, res) {
        res.render('index');
    })),
    // A GET route for scraping the NYT website
    app.get("/scrape", function(req, res) {
        // First, we grab the body of the html with axios
        axios.get("https://www.npr.org/sections/news/").then(function(response) {
        //console.log('axios: ' + response.data);
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        let $ = cheerio.load(response.data);
        // Now, we grab every h2 within an article tag, and do the following:
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
            
            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function(dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
                })
                .catch(function(err) {
                // If an error occurred, log it
                console.log(err);
                });
            });
            console.log(result[i]);
            // Send a message to the client
            res.send("Scrape Complete");
        });
        })
}