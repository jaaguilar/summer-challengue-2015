var fs = require('fs');
var util = require('util');
var config = require('../config');
var GhostGameIA = require('../classes/GhostGameIA');
var misc = require('../classes/miscelanea');
var ghostSession = require('../lib/ghost-session');

module.exports = function(app){
  app.get('/ghost', function(req, res){
    var options = {};
    //if debug mode we enable pretty html render
    if (config.debug) options = { pretty: true };
    res.render('ghost.jade',options)
  });

  app.post("/ghost", function(req,res,next){
    if (config.debug) console.time("ghost time")
    //posted term (always asume dictionary in lowercase)
    var term = req.body.term.toLowerCase();
    var rookie = req.body.rookie;
    var newGame = req.body.newgame;
    var tree = req.session.tree;
    var oldTerm = req.session.term;
    if (newGame) ghostSession.resetSession(req);
    if (config.debug) console.log("oldTerm: %s",oldTerm);

    var checkRel = [];
    if (misc.isNotEmpty(tree)){
      checkRel = misc.relatedWords(term,tree.relwords,true,config.minlen);
    }

    //**checking base cases**
    if (!misc.isOnlyLetters(term)){
      //check starting with only one letter
      var msg = util.format("The term is ilegal: '%s' must be only letters 'a' to 'z', not numbers or symbols",term);
      if (config.debug) console.log(msg);
      res.send({term: oldTerm, oldTerm: oldTerm, youlose: 0, youwin: 0, err: 1, msg: msg});
    } else if (misc.isNotEmpty(oldTerm)&&(term.length != oldTerm.length+1)) {
      //checking user's "ghost word" length
      var msg = util.format("The term is ilegal: '%s' must be one more letter longer than prefix '%s'.",term,oldTerm);
      if (config.debug) console.log(msg);
      res.send({term: oldTerm, oldTerm: oldTerm, youlose: 0, youwin: 0, err: 1, msg: msg});
    } else if (!misc.isNotEmpty(oldTerm)&&(term.length != 1)){
      //check starting with only one letter
      var msg = util.format("The term is ilegal to start the game: '%s' must be only one character",term);
      if (config.debug) console.log(msg);
      res.send({term: oldTerm, oldTerm: oldTerm, youlose: 0, youwin: 0, err: 1, msg: msg});
    }else if ((term.length>config.minlen)&&(tree.relwords.indexOf(term))>-1){
      //the user's "ghost word" exists on the dictionary (user lose)
      var msg = util.format("The term '%s' is a entire valid word. You lose...",term);
      if (config.debug) console.log(msg);
      //reset session
      ghostSession.resetSession(req);
      //response to client
      res.send({term: term, oldTerm: oldTerm, youlose: 1, youwin: 0, err: 0, msg: msg});
    }else if (misc.isNotEmpty(oldTerm)&&!misc.isNotEmpty(checkRel)) {
      //there is no word related to incoming term
      //the incoming term is not valid because cannot be extended into a word
      var msg = util.format("Upssss the term '%s' doesn't seem lead anywhere (with minimal length required)... sorry, you lose.",term);
      if (config.debug) console.log(msg);
      //reset session
      ghostSession.resetSession(req);      
      res.send({term: term, oldTerm: oldTerm, youlose: 1, youwin: 0, err: 1, msg: msg});
    }else{
      //**regular case**      
      if (config.debug) console.log("Incoming term '%s'",term);
      //reading dictionary
      var words = fs.readFileSync(config.dictionary).toString().split("\n");
      //IA module initialization
      //prune set to false, because is faster, maybe it will be interesting
      //for bigger dictionaries of more than 200k words with many derivated words
      //however this option could be optimized in further revisions
      gg= new GhostGameIA(config.minlen,false,false,config.minlen);
      if (misc.isNotEmpty(tree)){
        if (config.debug) console.log('Tree reloaded.');
        var newtree = gg.termSearch(term,tree,true,config.depth+1);
        if (misc.isNotEmpty(newtree)) {
          tree = newtree;
        }

      }else{
        if (config.debug) console.log('Session tree empty');
        //generate new tree
        tree = gg.treeBranch(words,term,config.depth);
      }
      //saving tree in user session for future calls
      req.session.tree = tree;
      //IA possible result bound
      var out = gg.ghostWord(tree,misc.bEvenStr(term),false);
      //calculate response term
      var resOutTerm = out.term.match('^'+term+'.');
      if (config.debug) console.log("IA response %s",JSON.stringify(out));
      //**checking outgoing term**  
      if (misc.isNotEmpty(resOutTerm)){
        var outTerm = resOutTerm[0];
        //check outTerm goodness
        /// outTerm must be not empty
        var checkOut = misc.isNotEmpty(outTerm);
        if (checkOut){
          var relOut = misc.relatedWords(outTerm,tree.relwords,true,config.minlen);
          checkOut = misc.isNotEmpty(relOut);
        }
        if (!checkOut){
          //the term proposed by IA is empty so it doesn't aim to anywere (user win)
          var msg = util.format("My choice '%s' doesn't seem lead anywhere with minimal length required... so you win!",outTerm);
          if (config.debug) console.log(msg);
          //reset session
          ghostSession.resetSession(req);
          //response to client
          res.send({term: outTerm, oldTerm: oldTerm, youlose: 0, youwin: 1, err: 1, msg: msg});
        }else if ((outTerm.length>config.minlen)&&(tree.relwords.indexOf(outTerm))>-1){
          //the computer "ghost word" proposed exists on the dictionary (user win)
          var msg = util.format("The term '%s' is a entire valid word. You win!",outTerm);
          if (config.debug) console.log(msg);
          //reset session
          ghostSession.resetSession(req);
          //response to client
          res.send({term: outTerm, oldTerm: oldTerm, youlose: 0, youwin: 1, err: 0, msg: msg});
        }else{
          //nobody wins yet, so we send proposed term to client to continue the game
          if (rookie || config.debug){
            var relClues = misc.relatedWords(outTerm,tree.relwords);
          }
          if (config.debug){
            console.log("Out Term: %s",outTerm);
            //send related words to console to aid us to check the algorithm
            console.log(JSON.stringify(relClues,0,4));
          }
          //response
          req.session.term = outTerm;
          res.send({term: outTerm, oldTerm: oldTerm, youlose: 0, youwin: 0, err: 0, msg: "", clues: relClues});
        }
      }else{
        //**unexpected**
        var msg = util.format("There was an unexpected behavior. We are so sorry.");
        console.error(msg);
        console.error("Term->%s",term);               
        console.error(JSON.stringify(out,0,4));        
        //reset session
        ghostSession.resetSession(req);
        //response to client
        res.send({term: oldTerm, oldTerm: oldTerm, youlose: 0, youwin: 0, err: 1, msg: msg});
      }
    }
    //debug time cost
    if (config.debug) console.timeEnd("ghost time")   
  });
}