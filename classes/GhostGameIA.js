"use strict"

var misc= require('./miscelanea');
/**
* @constructor
* @name GhostGameIA
* @classdesc Implements IA module based on Branch&Bound pattern strategy.
* @property {integer} minlen Minimum length to prune
* @property {boolean} prune Flag to indicate if same family words are pruned (when one word is prefix of other)
* @property {boolean} minlen Minimum length to prune
* @property {number} depth Represents the depth bound in each stage
*/
function GhostGameIA(minlen,prune,debug,depth){
	if (typeof(prune) == "undefined") prune = false;
	if (typeof(debug) == "undefined") debug = false;	

	if (typeof(minlen) != "number") throw "GhostGameIA::constructor. minlen must be a number.";
	if (minlen < 0) throw "GhostGameIA::constructor. minlen must be positive a number.";
	if (typeof(prune) != "boolean") throw "GhostGameIA::constructor. prune must be a boolean.";
	if (typeof(debug) != "boolean") throw "GhostGameIA::constructor. debug must be a boolean.";

	this.prune = prune;
	this.minlen = minlen;
	this.debug = debug;
	if (depth){
		this.depth = depth;
	}
	else{
		this.depth = 2;
	}

	var self = this;

	/**
	* @method 
	* @name GhostGameIA#termSearch
	* @description Retrieve from a JSON hierarchical document based on prefixes (term) and related words,
	* an entry point for term matching node.
	* @param {string} term A prefix to search related words
	* @param {JSON} tree Data structure which store information about terms and related words based on a dictionary.
	* @param {string} tree.term Key of each node of the tree structure
	* @param {boolean} tree.branched Notice when the branch is expanded or not. This flag serves to improve performance,
	* because a tree can be expanded on demand.
	* @param {JSON[]} tree.subtree Array of sub-elements with equal structure
	* @param {JSON} tree.stats Statistical information about content data
	* @param {number} tree.stats.evenCount Number of words into a with an even number of characters
	* @param {number} tree.stats.oddCount Number of words into a with an odd number of characters
	* @param {boolean} branch Branch a node with branched == 0
	* @param {number} level Number of level to be branched
	*/
	self.termSearch = function (term,tree,branch,level){
		return misc.termSearch(term,tree,branch,level,self.prune,self.minlen);
	}

	/**
	* @method
	* @name GhostGameIA#treeBranch
	* @description Returns a JSON hierarchical document based on prefixes (term) and related words.
	* Branch phase of the whole algorithm.
	* @param {string[]} words An array with the words of a dictionary
	* @param {string} term A prefix to search related words
	* @param {integer} level Max level of recursion. Level of depth in JSON structure
	* @returns {JSON} tree with multiple child nodes of the same structure
	*/
	self.treeBranch = function (words,term,level){
		var tree = misc.treeBranch(words,term,level,self.prune,self.minlen);
		return tree;
	}

	/**
	* @method 
	* @name GhostGameIA#ghostWord	
	* @description The main method of the class
	* Returns an array, index 0 is JSON document with two properties term and win,
	* term is the word proposed and win if this word is a winner or loser word,
	* the index 1 is a result tree with possible modifications
	* @param {JSON[]} tree.subtree Array of nodes with equal structure
	* @param {JSON} tree.stats Statistical information about content data
	* @param {number} tree.stats.evenCount Number of words into a with an even number of characters
	* @param {number} tree.stats.oddCount Number of words into a with an odd number of characters
	* @param {boolean} evenlose The base of the algorithm, it says if word of even length loses (odd wins) 
	*		 or odd loses (even wins)
	* @param {boolean} classic if true then follow strict rules of ghost game challenge
	*/
	self.ghostWord= function(tree,evenlose,classic){
		var resdoc = {};
		if (classic){
			var aRet = self.treeBoundClassic(tree,evenlose);
			var winPool = aRet[0];
			var losePool = aRet[1];


			if (winPool.length > 0){
				resdoc = winPool[misc.randomInt(0,winPool.length-1)];
				return resdoc;
			}
			//in case not win return the longest path		
			if (losePool.length > 0)
			{
				var longest = {term: ""};
				losePool.forEach(function(lterm){
					if ((lterm.term.length) > longest.term.length){
						longest = lterm;
					}
				});
				resdoc = longest;
				return resdoc;
			}
		}else{
			return self.treeBound(tree,evenlose);
		}
		console.error('ghostWord::no case detected');
		return resdoc;	
	}

	/**
	* @method 
	* @name GhostGameIA#treeBoundClassic
	* @description Returns an array, index[0] == winPool array of JSON documents with two properties term and win == 1,
	* the index 1 is the same structure for win == 0.
	* @param {JSON[]} tree.subtree Array of nodes with equal structure
	* @param {JSON} tree.stats Statistical information about content data
	* @param {number} tree.stats.evenCount Number of words into a with an even number of characters
	* @param {number} tree.stats.oddCount Number of words into a with an odd number of characters
	* @param {boolean} evenlose The base of the algorithm, it says if word of even length loses (odd wins) 
	*		 or odd loses (even wins)
	* @returns {JSON[]} [winPool,losePool] accumulate casuistry
	*/
	self.treeBoundClassic= function (tree,evenlose){
		//initialization
		var resdoc = {};
		resdoc['term'] = tree.term;
		//default result doc
		var isEven = misc.bEvenStr(tree.term);
		//logical EQuality with isEven and evenlose ((A^B)v(¬A^¬B)))		
		if (tree.term.length>self.minlen){
			resdoc['win'] = ((isEven&&evenlose)||(!isEven&&!evenlose))?1:0;
		}else{
			resdoc['win'] = 0;
		}
		//max depth reached
		resdoc['depth'] = tree.absLevel;
		//if input tree root level is not explored: call branch procedure
		if (tree.branched==0){
			tree = misc.treeBranch(tree.relwords,tree.term,self.depth+1,self.prune,self.minlen);
		}
		
		if ((tree.term.length>self.minlen)&&(tree.relwords.indexOf(tree.term) > -1)){
			//base case: one of relword exactly match with term and the length is ok
			if (self.debug) console.log('base MATCH');		
			//a term is not always a valid word but it is the best way to
			resdoc['term'] = tree.term;
			//even predicate help us to decide who wins
			var isEven = misc.bEvenStr(tree.term);
			//logical EQuality with isEven and evenlose ((A^B)v(¬A^¬B)))		
			resdoc['win'] = ((isEven&&evenlose)||(!isEven&&!evenlose))?1:0;		
			if (resdoc['win']){
				return [resdoc,[]];
			}else{
				return [[],resdoc];
			}
		}else if ((tree.term.length>self.minlen)&&(tree.stats.oddCount==0)&&(tree.stats.evenCount>0)){
			//minlen is reached and all words of this branch has even lengths
			if (self.debug) console.log('base ONLY EVEN');
			if (evenlose){
				resdoc['win'] = 1;
				//if IA wins, random choice
				resdoc['term'] = tree.relwords[misc.randomInt(0,tree.relwords.length-1)];
				return [resdoc,[]];
			}
		}else if ((tree.term.length>=self.minlen)&&(tree.stats.evenCount==0)&&(tree.stats.oddCount>0)){
			//minlen is reached and all words of this branch has odd lengths		
			if (self.debug) console.log('base ONLY ODD');
			if (!evenlose){
				resdoc['win'] = 1;
				//if IA wins random choice
				resdoc['term'] = tree.relwords[misc.randomInt(0,tree.subtree.length-1)];
				return [resdoc,[]];
			}
		} 
		//main recursive loop
		if (self.debug) console.log('loop Branch');		
		//explore subtree
		var winPool = [];
		var losePool = [];

		tree.subtree.forEach(function(node){
			var aRet = self.treeBound(node,evenlose);
			var win = aRet[0];
			var lose = aRet[1];
			winPool = winPool.concat(win);
			losePool = losePool.concat(lose);
		});

		return [winPool,losePool];	
	}

	/**
	* @method
	* @name GhostGameIA#treeBound
	* @description Returns a JSON document with two properties term and win,
	* term is the word proposed and win if this word is a winner or loser word,
	* @param {JSON[]} tree.subtree Array of nodes with equal structure
	* @param {JSON} tree.stats Statistical information about content data
	* @param {number} tree.stats.evenCount Number of words into a with an even number of characters
	* @param {number} tree.stats.oddCount Number of words into a with an odd number of characters
	* @param {boolean} evenlose The base of the algorithm, it says if word of even length loses (odd wins) 
	*		 or odd loses (even wins)
	* @returns {JSON} resdoc { term: term, win: 0|1}
	*/
	self.treeBound= function (tree,evenlose){
		//initialization
		var resdoc = {};
		resdoc['term'] = tree.term;
		//default result doc
		var isEven = misc.bEvenStr(tree.term);
		//logical EQuality with isEven and evenlose ((A^B)v(¬A^¬B)))		
		if (tree.term.length>self.minlen){
			resdoc['win'] = ((isEven&&evenlose)||(!isEven&&!evenlose))?1:0;
		}else{
			resdoc['win'] = 0;
		}
		//max depth reached
		resdoc['depth'] = tree.absLevel;
		//if input tree root level is not explored: call branch procedure
		if (tree.branched==0){
			tree = misc.treeBranch(tree.relwords,tree.term,self.depth+1,self.prune,self.minlen);
		}
		
		if ((tree.term.length>self.minlen)&&(tree.relwords.indexOf(tree.term) > -1)){
			//base case: one of relword exactly match with term and the length is ok
			if (self.debug) console.log('base MATCH');		
			//a term is not always a valid word but it is the best way to
			resdoc['term'] = tree.term;
			//even predicate help us to decide who wins
			var isEven = misc.bEvenStr(tree.term);
			//logical EQuality with isEven and evenlose ((A^B)v(¬A^¬B)))		
			resdoc['win'] = ((isEven&&evenlose)||(!isEven&&!evenlose))?1:0;		
			if (resdoc['win']){
				return resdoc;
			}else{
				return resdoc;
			}
		}else if ((tree.term.length>self.minlen)&&(tree.stats.oddCount==0)&&(tree.stats.evenCount>0)){
			//minlen is reached and all words of this branch has even lengths
			if (self.debug) console.log('base ONLY EVEN');
			if (evenlose){
				resdoc['win'] = 1;
				//if IA wins, random choice
				resdoc['term'] = tree.relwords[misc.randomInt(0,tree.relwords.length-1)];
				return resdoc;
			}
		}else if ((tree.term.length>=self.minlen)&&(tree.stats.evenCount==0)&&(tree.stats.oddCount>0)){
			//minlen is reached and all words of this branch has odd lengths		
			if (self.debug) console.log('base ONLY ODD');
			if (!evenlose){
				resdoc['win'] = 1;
				//if IA wins random choice
				resdoc['term'] = tree.relwords[misc.randomInt(0,tree.subtree.length-1)];
				return resdoc;
			}
		} 

		//main recursive loop
		if (self.debug) console.log('loop Branch');		
		if (evenlose){
			var subtree = tree.subtree.sort(misc.evenWinSort);
		}else{
			var subtree = tree.subtree.sort(misc.oddWinSort);
		}

		//explore subtree
		var winPool = [];
		var losePool = [];
		subtree.forEach(function(node){
			var ret = self.treeBound(node,evenlose);
			if (ret.win){  
				winPool.push(ret);
			}
			else losePool.push(ret);
		});			
		if (winPool.length > 0){
			resdoc = winPool[misc.randomInt(0,winPool.length-1)];
			return resdoc;
		}
		//in case not win return the longest path		
		if (losePool.length > 0)
		{
			var longest = {term: ""};
			losePool.forEach(function(lterm){
				if ((lterm.term.length) > longest.term.length){
					longest = lterm;
				}
			});
			resdoc = longest;
			return resdoc;
		}
		//leave node	
		return resdoc;	
	}

}


module.exports= GhostGameIA;