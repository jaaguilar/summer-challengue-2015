

miniwords = ['zabaglione',
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


evenwords = [
'zabaglione',
'zabaione',
'zaires',
'zaps',
'zayins',
'zazens',
'zeatin',
'zebeck',
'zebrawoods',
'zibeline',
'zibellines',
'zoariums',
'zoogeographers',
'zoogeographies',
'zoogeography',
'zoos',
'zoosperm',
'zoosporangia',
'zydeco',
'zygapophyses',
'zygapophysis',
'zygodactyl',
'zygoid',
'zygoma',
'zygomata'
];



//read commanline config parameters
if  (!process.argv[2]){
	console.log("No term introduced, please introduce one.");
	return false;
}

if  (!process.argv[3]){
	console.log("No dictionary file specified, please introduce one.");
	return false;
}

if  (!process.argv[4]){
	minlen = 4;	
}else{
	minlen = parseInt(process.argv[4]);
}

var words = [];
var iniTerm = process.argv[2];

fDictionary= process.argv[3];
var fs = require('fs');
var words = fs.readFileSync(fDictionary).toString().split("\n");
//words = evenwords;

GhostGameIA = require('../classes/GhostGameIA');
gg = new GhostGameIA(minlen);

console.time('treebranch');
var tree = gg.treebranch(words,iniTerm,3);
console.timeEnd('treebranch');

//write to file
fs = require('fs');
fs.writeFile('./tree.json', JSON.stringify(tree,0,2), function (err) {
  if (err) return console.log(err);
  console.log('writing done.');
});

misc= require('../classes/miscelanea');
console.time('treebound');
res = gg.treebound(tree,misc.bEvenStr(iniTerm));
console.timeEnd('treebound');

console.log(JSON.stringify(res));

var outTerm = res.term.match('^'+iniTerm+'.')[0];



var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', function(line){
	newInTerm = line.trim();
	console.log(newInTerm);
	console.log(outTerm);	

	if (newInTerm.length != outTerm.length+1)
	{
		console.log("The term is ilegal. It must be one more letter longer than prefix %s. %s->%s",outTerm,outTerm,newInTerm);
	}else if (newInTerm.match('^'+outTerm == null)){
		console.log("The term is ilegal. It dosn't match. %s->%s",outTerm,newInTerm);
	}else{
		var rel =  misc.relatedWords(newInTerm,tree.relwords);
		console.log(rel);
		if (!misc.isNotEmpty(rel)){
			console.log("Opssss the term <%s> doesn't seem lead anywhere...",newInTerm);
		}else if ((newInTerm.length>=minlen)&&(tree.relwords.indexOf(newInTerm))>-1){
			console.log("The term %s is a entire valid word. You lose!",newInTerm);			
			process.exit();
		}else{
			
			if (tree.relwords.length < 50){
				console.log(tree.relwords);
			}

			newtree = gg.termSearch(newInTerm,tree);		
			//console.log("newtree: "+JSON.stringify(newtree));		
			
			if (misc.isNotEmpty(newtree)) {
				//console.log("newtree: "+JSON.stringify(newtree));
				tree = newtree;
			}
			else tree= gg.treebranch(tree.relwords,newInTerm,2);
			res= gg.treebound(tree,misc.bEvenStr(iniTerm));
			console.log("tree len %s",tree.length);
			resOutTerm = res.term.match('^'+newInTerm+'.');
			console.log("res %s",JSON.stringify(res));
			console.log("resOutTerm %s",JSON.stringify(resOutTerm));
			outTerm = resOutTerm[0];
			console.log(outTerm);	
			if ((outTerm.length>=minlen	)&&(tree.relwords.indexOf(outTerm))>-1){
				console.log("The term %s is a entire valid word. You win!",outTerm);			
				process.exit();
			}
		}
	}
})