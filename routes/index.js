var errors = require('./errors');
var ghost = require('./ghost');
var newgame = require('./newgame');
var statistics = require('./statistics');
var config = require('../config');

module.exports = function(app){
  //home page
  app.get('/',function(req, res){
    var options = {};
    //if debug mode we enable pretty html render
    if (config.debug) options = { pretty: true };
    res.render('home.jade',options)
  });
  //Ghost Game
  ghost(app);
  //statistics
  statistics(app);
  //start New Game
  newgame(app);
  //error handlers
  errors(app);
}