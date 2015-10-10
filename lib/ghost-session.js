"use strict"
/**
* Reset stored variable session
* @param {object} req Request object
*/ 
function resetSession(req){
  req.session.term = "";
  req.session.tree = {};
}



module.exports= {
	resetSession: resetSession
}

