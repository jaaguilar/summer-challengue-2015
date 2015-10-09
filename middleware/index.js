var express = require('express');
var logger = require('express-logger');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

module.exports = function (app) {
	app.use(logger({path: "./logfile.txt"}));

	app.use(cookieParser());
	app.use(session({secret: 'Ghost Game rocks', resave: true, saveUninitialized: true}));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	//expose session to views
	app.use(function (req, res, next){
		res.locals.session = req.session;
		next();
	})
}