var config = require('../config');
var ghostSession = require('../lib/ghost-session');


module.exports = function(app){
	app.get("/newgame",function(req,res,next){
		ghostSession.resetSession(req);
		if (config.debug) console.log('session reset');
		res.redirect(301,'./ghost');		
	});
}