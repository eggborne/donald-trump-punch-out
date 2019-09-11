
<!--by @eggborne_dev-->

<!DOCTYPE html>
<html>
  <head>
    <title>Punch-Out</title>
    <meta charset="UTF-8">
    <meta content='width=device-width, height=device-height, minimal-ui, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <link href="https://fonts.googleapis.com/css?family=Press+Start+2P" rel="stylesheet"> 
    <link rel="stylesheet" type="text/css" href="style.css">
    <script src="../scripts/jquery-3.2.1.js"></script> 
    <link rel="shortcut icon" href="assets/favicon.png" type="image/x-icon">
    <link rel="icon" href="assets/favicon.ico" type="image/x-icon">
    <script src="/scripts/howler.core.js"></script>
    <link rel="apple-touch-icon" sizes="152x152" href="assets/mobileicon.png">
    <link rel="apple-touch-icon-precomposed" sizes="120x120" href="assets/mobileicon.png"/>
    <link rel="shortcut icon" href="assets/mobileicon.png" type="image/x-icon">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.6.1/pixi.js"></script>
    <!--<script src="jquery.mousewheel.js"></script>-->
  </head>
  <!--<body onload="PIXI.loader.add('assets/macsheet.json').load(function(){init()});" oncontextmenu="return false">-->
  <body onload="init();" oncontextmenu="return false">
      <div id="debug">E: </br>P: </div>
  <div id='game-canvas'></div>
  
  <div id='title-screen'>
    DONALD TRUMP'S
    <div id="logo"><img id="logo-img" src="assets/titlelogo.png"></div>
    <button id="title-start">FIGHT!</button>
    <!-- DONALD TRUMP'S<br/>
    <img id="title-logo" src="assets/titlelogo.png">
    <div id="options-button">
      OPTIONS
    </div>
    <div id="start-button">
      FIGHT!
    </div> -->
    <div id="start-message">
      "LET'S KEEP IT CLEAN! <br/>NOW COME OUT BOXING!"
    </div>
  </div>
    <script src="event.js"></script>
    <script src="init.js"></script>
    <script src="player.js"></script>
    <script src="enemy.js"></script>
    <script src="gui.js"></script>
    <script src="exec.js"></script>
  </body>
</html>