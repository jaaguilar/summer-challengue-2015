"use strict"

//event raised when intro key is striked over
//ghost-word input, autommatic word submit
$( "#ghost-word" ).keypress(function(event) {
  if (event.keyCode == 13) {
    $('#submit-word').click();
    return true;  
  }
});
//form data persistence on refresh
$(window).bind('beforeunload',function() {
  if (window.localStorage) {
    localStorage.setItem('ghostword', $('#ghost-word').val());
    localStorage.setItem('rookie', $('#rookie')[0].checked );    
  }
});

$(window).on('load',function() {
    var ghostword = localStorage.getItem('ghostword');
    var rookie = localStorage.getItem('rookie');
    $('#ghost-word').val(ghostword);
});
//attach events to ajax calls
$(document).on({
    //applying/removing css class loading 
    //show div with modal behavior
    ajaxStart: function() {  
      $('body').addClass("loading");    
    },
    ajaxStop: function() { 
      $('body').removeClass("loading"); 
    }    
});

/**
* fill param el wich is a select input with array items
* if items is null then erase options
*/
function populateSelect(el, items) {
  el.find('option').remove();
  el.append('<option selected="selected" value="0">-- select one --</option>');
  if (items){
    $.each(items, function (indx,item) {
      el.append('<option value="'+indx+'" title='+item.length+'>'+item+'</option>');
    });
  }
}

/**
* Using clue from server in rookie mode to continue the term
* add one letter to the lexeme according to the clue selected.
*/
function useClue(){
  if ($('select#cluelist option').filter(':selected').val() > -1){
    var clue = $('select#cluelist option').filter(':selected').text();
    var lexeme = $('#ghost-word').val();
    var newchar = clue.substr(lexeme.length,1);
    $('#ghost-word').val(lexeme+newchar);
    postGhostWord();
  }
}

/**
* Call service with Ghost Game logic and write the answer
*/
function postGhostWord() {
  //get the actual user's word to send to server
  var ghostTerm = $('#ghost-word').val();
  var rookie = $('#rookie').prop( "checked");
  var jsonresource =  JSON.stringify({ term: ghostTerm, rookie: rookie });
  //service post
  $.ajax({
    type: "POST",
    url: "/ghost",
    data: jsonresource,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(data) { 
      writeDownTerm(data); 
      $('#ghost-word').focus();
      if (rookie){
        populateSelect($('#cluelist'),data.clues);
      }
    },
    failure: function() { 
      alert("Sorry, we were unable to find GhostWord service. Try again later."); 
    }
  });
}

/**
* Setting up styles associated to messages and tracking
*/
function trackAndStyle(data){
  //event action 
  var action = 'complete';
  //event label
  var label = data.term;
  var msg = $('#msg');
  //track rookie words
  if ($('#rookie').prop( "checked"))
    var value = 1;
  else
    var value = 0;
  $(msg).removeClass('gg-error');
  $(msg).removeClass('gg-youwin');
  $(msg).removeClass('gg-youlose');  
  if (data.err){
    $(msg).addClass('gg-error');
    action = 'incomplete';
  }
  if(data.youwin){
    $(msg).addClass('gg-youwin');
    //trigger analytic events
    //ga('send', 'event', 'Ghost Word',action,label,value);
    ga('send', 'event', 'IA Lose',action,label,value);

  }else if (data.youlose){
    $(msg).addClass('gg-youlose');      
    //trigger analytic events
    //ga('send', 'event', 'Ghost Word',action,label,value);
    ga('send', 'event', 'User Lose',action,label,value);
  }
}

/**
* Write back the response to the input text with Ghost Word
* @data {JSON} data Answer data structure
*/
function writeDownTerm(data) {
  trackAndStyle(data);
  if (data.msg)
    $('#msg').text(data.msg);
  else
    $('#msg').text('');       
  if (data.youwin || data.youlose){
    //cleaning input control
    $('#ghost-word').val(''); 
    //clean clue list
    populateSelect($('#cluelist'));

  }else{
    $('#ghost-word').val(data.term);
  }
}


