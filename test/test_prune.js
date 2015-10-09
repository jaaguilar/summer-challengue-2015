"use strict"

var relwords = [
    "ye",
    "yell",
    "yelled",
    "yeller",
    "yelling",
    "yellow",
    "yellowed",
    "yellower",
    "yellowest",
    "yellowfin",
    "yellowhammer",
    "yellowing",
    "yellowish",
    "yellowlegs",
    "yellowly",
    "yellowtail",
    "yellowthroat",
    "yellowware",
    "yellowwood",
    "yeuking"
  ];

function pruneWords(words,minlen,debug){
    var ret = words.filter(function(lexeme,i,a) {
        var ancestors = a.filter(function(word){
            if (word.length > minlen){
                var res = lexeme.match('^'+word+'.+$');
                if (res) return word;
            }
        });
        if (ancestors.length==0) return lexeme;
    })
    if (debug) console.log("this is it");
    return ret;
}

var wordsPruned = pruneWords(relwords,4,1);
console.log(JSON.stringify(wordsPruned,0,4));


