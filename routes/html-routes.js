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
    }),
    // A GET route for scraping the NYT website
    app.get("/scrape", function(req, res) {
        // First, we grab the body of the html with axios
        axios.get("http://www.nytimes.com/").then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
    

        // Send a message to the client
        res.send("Scrape Complete");
        });
    })
  
)}

