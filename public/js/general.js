"use strict"

//setting up to start a new game
function newGame() {
  if (window.localStorage) {
    localStorage.setItem('ghostword', '');
    localStorage.setItem('rookie', false);       
  }
}