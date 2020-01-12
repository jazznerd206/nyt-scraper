const express = require('express');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.static('public'));

app.use(express.urlencoded({ extended:true }));
app.use(express.json());

const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

require('./routes/html-routes')(app);

var syncOptions = { force: false };

//app.use(routes);

app.listen(PORT, function() {
	console.log('listening on port ' + PORT);
});