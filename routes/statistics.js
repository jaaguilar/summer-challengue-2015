var config = require('../config');

module.exports = function(app){
    app.get("/statistics",function(req,res,next){
        var options = {};
        //if debug mode we enable pretty html render
        if (config.debug) options = { pretty: true };
        res.render('statistics.jade',options)       
    });
}