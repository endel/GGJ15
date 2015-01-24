(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/endel/Projects/GGJ15/client/src/main.js":[function(require,module,exports){
"use strict";

var realtime = require("./realtime");

var game = new Phaser.Game(800, 600, Phaser.WEBGL, "phaser-example", {
  preload: preload,
  create: create
});

function preload() {
  //  You can fill the preloader with as many assets as your game requires

  //  Here we are loading an image. The first parameter is the unique
  //  string by which we'll identify the image later in our code.

  //  The second parameter is the URL of the image (relative)
  game.load.image("kitten", "assets/images/kitten.png");
}

function create() {
  //  This creates a simple sprite that is using our loaded image and
  //  displays it on-screen
  game.add.sprite(0, 0, "kitten");
}

},{"./realtime":"/Users/endel/Projects/GGJ15/client/src/realtime.js"}],"/Users/endel/Projects/GGJ15/client/src/realtime.js":[function(require,module,exports){
"use strict";

var socket = io.connect("http://localhost:3000");

socket.on("connect", function () {
  socket.emit("adduser", prompt("What's your name: "));
});

socket.on("updatechat", function (username, data) {
  console.log(username, data);
});

module.exports = {
  open: function () {}
};

},{}]},{},["/Users/endel/Projects/GGJ15/client/src/main.js"]);
