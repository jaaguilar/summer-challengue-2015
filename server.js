var express = require('express');
var path = require('path');
var routes = require('./routes');
var middleware = require('./middleware');
var config = require('./config');
var app = express();

//publishing client files
app.use(express.static(path.join(__dirname, 'public')));

middleware(app);
routes(app);

app.listen(config.port,function(){
	console.log('Now listening on http://localhost:%d',config.port);
})
