"use strict"
var misc= require('../classes/miscelanea');
var GhostGameIA = require('../classes/GhostGameIA');

var arr1 = [
		{
			item: 1,
			stats: {
				oddCount: 3, 
				evenCount: 1
			} 
		},
		{
			item: 2,
			stats: {
				oddCount: 1, 
				evenCount: 1
			} 
		},
		{
			item: 3,
			stats: {
				oddCount: 2, 
				evenCount: 1
			} 
		}
	];

var arr2 = [
		{
			item: 1,
			stats: {
				oddCount: 3, 
				evenCount: 1
			} 
		},
		{
			item: 2,
			stats: {
				oddCount: 1, 
				evenCount: 1
			} 
		},
		{
			item: 3,
			stats: {
				oddCount: 2, 
				evenCount: 0
			} 
		},
		{
			item: 4,
			stats: {
				oddCount: 8, 
				evenCount: 0
			} 
		},
		{
			item: 5,
			stats: {
				oddCount: 21, 
				evenCount: 3
			} 
		}
	];

var arr3 = [];

/*
console.log('before:');
console.log(JSON.stringify(arr1,0,2));
rarr1 = arr1.sort(misc.oddWinSort);
console.log('after:');
console.log(JSON.stringify(rarr1,0,2));
console.log('-----------------------');
console.log('before:');
console.log(JSON.stringify(arr2,0,2));
rarr2 = arr2.sort(misc.oddWinSort);
console.log('after:');
console.log(JSON.stringify(rarr2,0,2));
*/

/*
console.log(misc.randomInt(-3.5,10));
*/

var words = ['zabaglione',
'zabagliones',
'zabaione',
'zacaton',
'zaires',
'zamia',
'zapateado',
'zaps',
'zayin',
'zayins',
'zazen',
'zazens',
'zealously',
'zealousness',
'zealousnesses',
'zeals',
'zeatin',
'zeatins',
'zebec',
'zebeck',
'zebrawood',
'zebrawoods',
'zebrine',
'zebroid',
'zibeline',
'zibelines',
'zibelline',
'zibellines',
'zoarial',
'zoarium',
'zoariums',
'zoogeographer',
'zoogeographers',
'zoogeographic',
'zoogeographical',
'zoogeographically',
'zoogeographies',
'zoogeography',
'zoos',
'zoosperm',
'zoosperms',
'zoosporangia',
'zoosporangium',
'zydeco',
'zydecos',
'zygapophyses',
'zygapophysis',
'zygodactyl',
'zygodactylous',
'zygoid',
'zygoma',
'zygomas',
'zygomata',
'zygomatic',
'zygomorphic'];


/*
terms = misc.relatedTerms(process.argv[2],words);
console.log(JSON.stringify(terms));
terms = misc.relatedWords(process.argv[2],words);
console.log(JSON.stringify(terms));
*/
//res = 'zygodactylous'.match('^'+'zy'+'.');
//console.log(JSON.stringify(res));


var fDictionary= process.argv[4];
var fs = require('fs');
var words = fs.readFileSync(fDictionary).toString().split("\n");
var term = process.argv[2]; 
var sterm = process.argv[3];
var tree = misc.treeBranch(words,term,0);

console.log(JSON.stringify(tree,0,2));



tree = misc.treeBranch(tree.relwords,tree.term,2) 

console.log(JSON.stringify(tree,0,2));

var stree = misc.termSearch(sterm,tree,true,2);
if (misc.isNotEmpty(stree)){
	console.log("found %s",JSON.stringify(stree,0,2));
}
console.log(JSON.stringify(stree,0,2));


//var aRet = gg.treeBound(stree,true);

//console.log("segunda\n%s",JSON.stringify(aRet,0,2));


/*
var obj1 = {};
var obj2 = null;
var obj3 = {name: "the name"}
var obj4 = [];
var obj5 = undefined;
var obj6 = "aloperidol"

if (misc.isNotEmpty(obj1))
	console.log("not empty obj1");
if (misc.isNotEmpty(obj2))
	console.log("not empty obj2");
if (misc.isNotEmpty(obj3))
	console.log("not empty obj3");
if (misc.isNotEmpty(obj4))
	console.log("not empty obj4");
if (misc.isNotEmpty(obj5))
	console.log("not empty obj5");
if (misc.isNotEmpty(arr1))
	console.log("not empty arr1");
if (misc.isNotEmpty(arr2))
	console.log("not empty arr2");
if (misc.isNotEmpty(arr3))
	console.log("not empty arr3");
if (misc.isNotEmpty(obj6))
	console.log("not empty obj6");
*/





