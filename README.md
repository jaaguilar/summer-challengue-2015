Name: Summer Challenge 2015
Author: Juan Antonio Aguilar

Description:

This is a Web site application and is part of a challenge to demonstrate Web development knowledge with Node.js.
Client-server design. Everything is javascript based. The server side have been programmed using Node JS, Jade templates and express framework. The front-end is basically HTML/CSS3, Twitter bootstrap and jQuery/AJAX. The bootstrap framework was used with a responsive style in order to increase the user experience. This framework was used to make the Parallax effect as well. 
I hope you like it!

Installation:

	npm install

Accessing development environment:

	http://localhost:8080

Configuration:

	config.js

Directory Structure:

(View on Raw Mode)

.
├── classes
│   ├── GhostGameIA.js
│   └── miscelanea.js
├── config.js
├── data
│   └── word.lst
├── lib
│   └── ghost-session.js
├── logfile.txt
├── middleware
│   └── index.js
├── package.json
├── public
│   ├── css
│   │   ├── landing.css
│   │   └── style.css
│   ├── docs
│   │   ├── ...
│   ├── images
│   │   ├── about.png
│   │   ├── ajax-loader.gif
│   │   ├── favicon.ico
│   │   ├── ghost_game_logo.png
│   │   ├── ghost-gamepad.png
│   │   ├── intro-alpha.png
│   │   ├── jasset.png
│   │   └── nebula.jpg
│   ├── js
│   │   ├── general.js
│   │   ├── gg-analytics.js
│   │   └── ghostgame.js
│   ├── lib
│   │   ├── bootstrap
│   │   │   ├── ...
│   │   ├── jquery
│   │   │   └── jquery-2.1.4.min.js
│   │   └── untame
│   │       └── init.js
│   ├── pdf
│   │   ├── ghost-game-rules.pdf
│   │   └── treehouse-cubano-license.pdf
│   └── video
│       └── pillars-of-creation.mp4
├── routes
│   ├── errors.js
│   ├── ghost.js
│   ├── index.js
│   ├── newgame.js
│   └── statistics.js
├── server.js
├── test
│   ├── test_GhostGameIA.js
│   ├── test_miscelanea.js
│   └── test_prune.js
├── README.md
└── views
    ├── ghost.jade
    ├── home.jade
    ├── layout.jade
    ├── partials
    │   ├── footer.jade
    │   ├── ghost-footer.jade
    │   ├── header.jade
    │   └── menu-main.jade
    └── statistics.jade
