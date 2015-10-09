module.exports = function (app) {
	//404s
	app.use(function(req,res,next){
		res.status(404);

		if (req.accepts('html')){
			return res.send('<h2>404 Page not found. I\'m so sorry but an error has ocurred...</br> try again or please, contact with an administrator.</h2>');
		}

		if (req.accepts('json')){
			return res.send({error: 'not found.'});
		}

	})
}