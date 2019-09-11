debugMode = true;
stage = undefined;

isTouchDevice = false;
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    isTouchDevice = true;
}

letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"," "]
punctuation = [":","\"",null,"-","\'",".","!","?",","];

soundOn = false;
anyKeyPressedAt = -1;
pressedInLast30ms = 0;

doneCreating = false;
playerStarted = playerStartedAt = playerReadyAt = ringArrivedOnscreenAt = undefined;

fightersReady = undefined;

punchSound1 = new Howl({
    urls: ['assets/sounds/punch1.mp3'],
    volume:0.8,
    playing: false,
    onplay: function() {this.playing = true},
    onend: function() {this.playing = false}
});
punchSound2 = new Howl({
    urls: ['assets/sounds/punch2.mp3'],
    volume:0.5,
    playing: false,
    onplay: function() {this.playing = true},
    onend: function() {this.playing = false}
});
blockSound = new Howl({
    urls: ['assets/sounds/block.mp3'],
    volume:1,
    playing: false,
    onplay: function() {this.playing = true},
    onend: function() {this.playing = false}
});
whooshSound1 = new Howl({
    urls: ['assets/sounds/whoosh1.mp3'],
    volume:1,
    playing: false,
    onplay: function() {this.playing = true},
    onend: function() {this.playing = false}
});
hookSound1 = new Howl({
    urls: ['assets/sounds/hook.mp3'],
    volume:1,
    playing: false,
    onplay: function() {this.playing = true},
    onend: function() {this.playing = false}
});
fwitSound1 = new Howl({
    urls: ['assets/sounds/fwit.mp3'],
    volume:0.4,
    playing: false,
    onplay: function() {this.playing = true},
    onend: function() {this.playing = false}
});
function playSound(sound) {
    if (soundOn && !sound.playing) {
        sound.play();
    }
}

document.addEventListener('touchmove', this.touchmove);
function touchmove(e) {
    e.preventDefault();
}

buttonPanel = undefined;
cursor = {x:undefined,y:undefined};
cursorAtLastFrame = null;
gameInitiated = false;
pressingSpace = pressingS = pressingO = pressingP = pressingC = pressingLShift = pressingW = pressingA = pressingS = pressingX = pressingZ = pressingD = pressingQ = releasedS = false;
pressedSpaceAt = pressedSAt = pressedEAt = pressedOAt = pressedPAt = pressedCAt = pressedQAt = pressedSAt = pressedXAt = pressedAAt = pressedDAt = -1;
clicked = rightClicked = LMBReleased = RMBReleased = -99;
LMBDown = RMBDown = false;
holdingLeft = holdingRight = pressingDown = holdingGuard = false;
turnbuckleText = PIXI.Texture.fromImage("assets/turnbuckle.png");
knobText = PIXI.Texture.fromImage("assets/knobtint.png");
ropesText = PIXI.Texture.fromImage("assets/ropes.png");
scoreHeaderText = PIXI.Texture.fromImage("assets/scorehead.png");
scoreTintText = PIXI.Texture.fromImage("assets/scoreheadertint.png");
scoreHeadFillerText = PIXI.Texture.fromImage("assets/scoreheadfiller.png");
pixelText = PIXI.Texture.fromImage("assets/pixel.bmp");
tileOnText = PIXI.Texture.fromImage("assets/tileon.png");
gloveText = PIXI.Texture.fromImage("assets/glove.png");
arrowText = PIXI.Texture.fromImage("assets/arrow.png");
starText = PIXI.Texture.fromImage("assets/star.png");
guardGlovesText = PIXI.Texture.fromImage("assets/guardgloves.png");
koText = PIXI.Texture.fromImage("assets/kocloud.png");
tkoText = PIXI.Texture.fromImage("assets/tkocloud.png");
titleLogoText = PIXI.Texture.fromImage("assets/titlelogo.png");
// titleLogoText2 = PIXI.Texture.fromImage("assets/titlelogo2.png");

macPortraitText = PIXI.Texture.fromImage("assets/macportrait.png");
trumpPortraitText = PIXI.Texture.fromImage("assets/trumpportrait.png");
macSize = {x:84,y:243};
enemySize = {x:180,y:390};
marioSize = {x:186,y:144};
letterSize = 84;
crowdTexts =
[
    PIXI.Texture.fromImage("assets/crowd1.png"),
    PIXI.Texture.fromImage("assets/crowd2.png"),
    PIXI.Texture.fromImage("assets/crowd3.png"),
    PIXI.Texture.fromImage("assets/crowd4.png")
];
numeralTexts =
    [
        PIXI.Texture.fromImage("assets/numerals/zero.png"),
        PIXI.Texture.fromImage("assets/numerals/one.png"),
        PIXI.Texture.fromImage("assets/numerals/two.png"),
        PIXI.Texture.fromImage("assets/numerals/three.png"),
        PIXI.Texture.fromImage("assets/numerals/four.png"),
        PIXI.Texture.fromImage("assets/numerals/five.png"),
        PIXI.Texture.fromImage("assets/numerals/six.png"),
        PIXI.Texture.fromImage("assets/numerals/seven.png"),
        PIXI.Texture.fromImage("assets/numerals/eight.png"),
        PIXI.Texture.fromImage("assets/numerals/nine.png"),
        PIXI.Texture.fromImage("assets/numerals/colon.png")
    ]

//macSheet = PIXI.Texture.fromImage("assets/macsheet2.png");
roundSheet = PIXI.Texture.fromImage("assets/roundsheet.png");
macSkinSheet = PIXI.Texture.fromImage("assets/macskinsheet3.png");
macOutlineSheet = PIXI.Texture.fromImage("assets/macoutlinesheet3.png");
macTrunksSheet = PIXI.Texture.fromImage("assets/mactrunkssheet3.png");
enemySheet = PIXI.Texture.fromImage("assets/trumpsheet.png");
enemyTrunksSheet = PIXI.Texture.fromImage("assets/trumpshortssheet.png");
marioSheet = PIXI.Texture.fromImage("assets/mariosheet.png");
letterSheet = PIXI.Texture.fromImage("assets/lettersheet.png");

sheetBuffer = 6;
letterBuffer = 24;
enemySheetBuffer = 6;

// floorColors = [0x0070ec,0x00a800,0x008088,0x58f898,0x5c94fc];
floorColors = [0x0070ec,0x00a800,0x008088,0x00a800,0x5c94fc];
scoreBGColors = [0xfce4a0,0xc4d4fc,0xa8f0bc,0xa8e4fc,0xa8f0bc];
crowdColors = [0xfc7460,0xfc9838,0xfc7460,0xfc9838,0xf0bc3c];
macTrunksColors = [0x00e8d8,0x58f898,0x3cbcfc];

var randomColorIndex = randomInt(0,floorColors.length-1);
floorColor = floorColors[randomColorIndex];
scoreBGColor = scoreBGColors[randomColorIndex];
crowdColor = crowdColors[randomColorIndex];
crowdBGColor = 0x000000;
macSkinColor = 0xfcbcb0;
macOutlineColor = 0x000000;
macTrunksColor = macTrunksColors[randomInt(0,macTrunksColors.length-1)];
enemyTrunksColor = 0x9645e1;

tiredColor1 = 0xbc00bc;
tiredColor2 = 0xfc74b4;
counter = 0;
roundStarted = undefined;



punchedHighAt = -99;

winnerDeclaredAt = undefined;


minutesLeftInRound = 3;
secondsLeftInRound = 180;
roundOver = false;

currentRound = 1;

clockRunning = false;

introLength = 60;

downCount = 1;

function distanceFromABtoXY(a,b,x,y) {
    var distanceX = x-a;
    var distanceY = y-b;
    return Math.round( Math.sqrt( (distanceX*distanceX)+(distanceY*distanceY) ));
}
function pointAtAngle(x,y,angle,distance) {
    return {x:x+distance*Math.cos(angle),y:y+distance*Math.sin(angle)};
};

function angleOfPointABFromXY(a,b,x,y) {
    return Math.atan2(b-y,a-x)+(Math.PI/2);
};

function randomInt(min,max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
degToRad = function(radians) {
    return radians*(Math.PI/180);
};

radToDeg = function(radians) {
    deg = radians*(180/Math.PI);
    if (deg < 0) {
        deg += 360;
    } else if (deg > 359) {
        deg -= 360;
    };
    return radians*(180/Math.PI);
};

function currentMashSpeed() {
    mashSpeed = 0;
    if (counter-anyKeyPressedAt < 3) {
        mashSpeed = 3;
    } else if (counter-anyKeyPressedAt < 5) {
        mashSpeed = 2;
    } else if (counter-anyKeyPressedAt < 6) {
        mashSpeed = 1;
    }
    return mashSpeed;
}


function CrowdHeader() {
    this.container = new PIXI.Container();
    this.crowdBG = new PIXI.Sprite(pixelText);
    this.scoreBG = new PIXI.Sprite(pixelText);
    this.scoreBG = new PIXI.Sprite(pixelText);
    this.scoreTint = new PIXI.Sprite(scoreTintText);
    this.scoreTint.y = 0;
    this.scoreTint.tint = floorColor;
    this.scoreBG.tint = scoreBGColor;
    this.scoreBG.width = gameWidth;
    this.scoreBG.height = headerHeight;
    this.crowdBG.tint = crowdBGColor;
    this.crowdBG.width = gameWidth;
    this.crowdBG.height = headerHeight*0.67;
    this.crowdBG.x = 0;
    this.crowdBG.y = headerHeight;

    this.container.addChild(this.crowdBG);
    this.container.addChild(this.scoreBG);


    this.scoreArea = new PIXI.Sprite(scoreHeaderText);
    var scoreRatio = this.scoreArea.height/this.scoreArea.width;
    this.scoreArea.height = headerHeight;
//    if (gameWidth < gameHeight) {
//        this.scoreArea.height = headerHeight*0.8;
//    }
    this.scoreArea.width = this.scoreArea.height/scoreRatio;
    this.scoreArea.y = 0;
    if (this.scoreArea.width < gameWidth) {
        var difference = gameWidth-this.scoreArea.width;
        this.scoreArea.x = difference/2;
        var needed = Math.ceil(this.scoreArea.x/(this.scoreArea.width/32));
        for (var i=0;i<needed;i++) {
            var currentLeftPiece = new PIXI.Sprite(scoreHeadFillerText);
            var currentRightPiece = new PIXI.Sprite(scoreHeadFillerText);
            currentLeftPiece.height = currentRightPiece.height = headerHeight;
            currentLeftPiece.width = currentRightPiece.width = this.scoreArea.width/32;
            currentLeftPiece.x = this.scoreArea.x-currentLeftPiece.width-(i*currentLeftPiece.width);
            currentRightPiece.x = this.scoreArea.x+this.scoreArea.width+(i*currentRightPiece.width);
            this.container.addChild(currentLeftPiece);
            this.container.addChild(currentRightPiece);
        }
    } else {
        this.scoreArea.width = gameWidth;
        this.scoreArea.x = 0;
    }

    this.scoreTint.width = this.scoreArea.width;
    this.scoreTint.height = this.scoreArea.height;
    this.scoreTint.x = this.scoreArea.x;
    this.leftBuckle = new PIXI.Sprite(turnbuckleText);
    this.rightBuckle = new PIXI.Sprite(turnbuckleText);
    this.ropes = new PIXI.Sprite(ropesText);
    this.leftKnobs = new PIXI.Sprite(knobText);
    this.rightKnobs = new PIXI.Sprite(knobText);

    var buckleRatio = this.leftBuckle.height/this.leftBuckle.width;
    this.leftBuckle.height = this.rightBuckle.height = this.leftKnobs.height = this.rightKnobs.height = this.ropes.height = headerHeight;
    this.leftBuckle.width = this.rightBuckle.width = this.leftKnobs.width = this.rightKnobs.width = this.leftBuckle.height/buckleRatio;
    this.ropes.width = gameWidth-(this.leftBuckle.width*2);



    this.leftBuckle.x = this.leftKnobs.x = 0;
    this.leftBuckle.y = this.ropes.y = this.leftKnobs.y = this.rightKnobs.y = this.rightBuckle.y = this.scoreArea.height;
    this.ropes.x = this.leftBuckle.width;
    this.rightBuckle.scale.x *= -1;
    this.rightKnobs.scale.x *= -1;
    this.rightBuckle.x = this.rightKnobs.x = gameWidth;
    this.leftKnobs.tint = this.rightKnobs.tint = floorColor;
    this.crowd1 = new PIXI.Sprite(crowdTexts[0]);
    this.crowd1.scale.x = this.crowd1.scale.y = this.leftBuckle.scale.x;
    this.crowd1.x = this.ropes.x;
    this.crowd1.y = this.ropes.y;
    this.crowdContainer = new PIXI.Container;
    var crowdPiecesNeeded = Math.floor(this.ropes.width/this.crowd1.width);
    var emptySpace = this.ropes.width - (crowdPiecesNeeded*this.crowd1.width);
    for (var c=0;c<crowdPiecesNeeded;c++) {
        for (var r=0;r<4;r++) {
            var currentPiece = new PIXI.Sprite(crowdTexts[r]);
            currentPiece.anchor.x = 0.5;
            currentPiece.scale.x = currentPiece.scale.y = this.leftBuckle.scale.x;
            currentPiece.x = this.ropes.x+(currentPiece.width/2)+(currentPiece.width*c);
            if (r<3) {
                currentPiece.y = this.ropes.y+((currentPiece.height*1.5)*r);
            } else {
                currentPiece.y = this.ropes.y+((currentPiece.height)*r);
            }
            if (c===crowdPiecesNeeded-1 && emptySpace > 0) {
                var fillPiece = new PIXI.Sprite(crowdTexts[r]);
                fillPiece.anchor.x = 0.5;
                fillPiece.scale.x = fillPiece.scale.y = this.leftBuckle.scale.x;
                fillPiece.x = currentPiece.x+(currentPiece.width);
                fillPiece.x -= (currentPiece.width-emptySpace);
                fillPiece.y = currentPiece.y;
                fillPiece.tint = crowdColor;
                this.crowdContainer.addChild(fillPiece);
            }
            var backing = new PIXI.Sprite(pixelText);
            backing.anchor.x = 0.5;
            backing.width = currentPiece.width;
            backing.height = currentPiece.height;
            backing.x = currentPiece.x;
            backing.y = currentPiece.y;
            backing.tint = crowdBGColor;
            this.crowdContainer.addChild(backing);
            this.crowdContainer.addChild(currentPiece);
            currentPiece.tint = crowdColor;
            var flipPiece = randomInt(0,1);
            if (flipPiece) {
                currentPiece.scale.x *= -1;
            }
        }
    }


    var macBarX = this.scoreArea.x+(704*this.scoreArea.scale.x);
    var enemyBarX = this.scoreArea.x+(1152*this.scoreArea.scale.x);
    var lifeBarY = 128*this.scoreArea.scale.y;

    this.lifeBarWidth = 384*this.scoreArea.scale.x;
    var lifeBarHeight = 56*this.scoreArea.scale.y;

    this.macBar = new PIXI.Sprite(pixelText);
    this.enemyBar = new PIXI.Sprite(pixelText);
    this.macBar.tint = this.enemyBar.tint = 0xffffff;
    this.macBar.width = this.enemyBar.width = this.macBar.maxWidth = this.enemyBar.maxWidth = this.lifeBarWidth;
    this.macBar.height = this.enemyBar.height = lifeBarHeight;
    this.macBar.x = macBarX;
    this.enemyBar.x = enemyBarX;
    this.macBar.y = this.enemyBar.y = lifeBarY;

    var pointsX = this.scoreArea.x+(1540*this.scoreArea.scale.x); // anchored right!
    var pointsY = this.scoreArea.y+(228*this.scoreArea.scale.y); // anchored center!

    textStyle1 =
    {
        src: 'assets/Pixel-Emulator.otf',
        font: this.macBar.height+'px Pixel Emulator',
        fill: '#ffffff',
        align: 'right'
    }

    this.pointsDisplay = new NumeralImage(0,lifeBarHeight*0.9,pointsX,pointsY,0xffffff);
    this.pointsDisplay.container.x -= this.pointsDisplay.container.width;

    var countsY = 156*this.scoreArea.scale.y;
    var starCountX = this.scoreArea.x+(240*this.scoreArea.scale.x);
    var staminaCountX = this.scoreArea.x+(448*this.scoreArea.scale.x);

    this.starDisplay = new NumeralImage(0,lifeBarHeight,starCountX,countsY,0xffffff);
    this.staminaDisplay = new NumeralImage(20,lifeBarHeight,staminaCountX,countsY,0xffffff);
    this.starDisplay.x = starCountX;
    

    var minutesX = this.scoreArea.x+(1674*this.scoreArea.scale.x);
    var secondsX = minutesX+(this.pointsDisplay.container.height*1.5);
    var timeY = lifeBarY+(this.pointsDisplay.container.height/2);
    var timeWidth = 248*this.scoreArea.scale.x
    this.minutesDisplay = new NumeralImage("3",lifeBarHeight*0.8,minutesX,timeY,0xffffff);
    var colon = new PIXI.Sprite(numeralTexts[10]);
    colon.anchor.y = 0.5;
    colon.width = colon.height = this.minutesDisplay.container.height;
    colon.x = minutesX+colon.width*1.1;
    colon.y = timeY;

    this.secondsDisplay = new NumeralImage("00",lifeBarHeight*0.8,colon.x+colon.width*1.1,timeY,0xffffff);

    roundSheet.frame = new PIXI.Rectangle(0, 0, 93, 18);

    this.roundDisplay = new PIXI.Sprite(roundSheet);

    this.roundDisplay.height = lifeBarHeight;
    this.roundDisplay.width = lifeBarHeight*(93/24);
    this.roundDisplay.x = minutesX-(this.roundDisplay.width/20);
    this.roundDisplay.y = timeY+this.roundDisplay.height*0.85;

//    this.timeDisplay.width = timeWidth;
    if (this.scoreArea.scale.x < this.scoreArea.scale.y) {
//        this.roundDisplay.width *= 0.7;
        this.starDisplay.container.width *= 0.8;
        this.staminaDisplay.container.width *= 0.8;
    }

    this.countDown = function() {
        if (counter > 0 && counter % 40 === 0) {
            var oldSeconds = secondsLeftInRound;
            var oldMinutes = minutesLeftInRound;
            if (oldSeconds === 0 || oldSeconds === 180 || oldSeconds === "00") {
                if (oldMinutes > 0) {
                    var newSeconds = 59;
                    var newMinutes = oldMinutes-1

                } else {
                    roundOver = true;
                }
            } else {
                var newSeconds = oldSeconds-1;
                var newMinutes = oldMinutes;
            }
            if (newSeconds < 10) {

                var string = newSeconds.toString();
                newSeconds = "0" + string
            }
            minutesLeftInRound = newMinutes;
            secondsLeftInRound = newSeconds;
            this.minutesDisplay.changeNumeral(newMinutes);
            this.secondsDisplay.changeNumeral(newSeconds);
            if (newMinutes === 0 && newSeconds === "00") {
                roundOver = true;
            }

        }



    }


    this.container.addChild(this.scoreArea);
    this.container.addChild(this.scoreTint);
    this.container.addChild(this.leftBuckle);
    this.container.addChild(this.rightBuckle);
    this.container.addChild(this.leftKnobs);
    this.container.addChild(this.rightKnobs);
    this.container.addChild(this.crowdContainer);
    this.container.addChild(this.ropes);
    this.container.addChild(this.macBar);
    this.container.addChild(this.enemyBar);
    this.container.addChild(this.starDisplay.container);
    this.container.addChild(this.staminaDisplay.container);
    this.container.addChild(this.minutesDisplay.container);
    this.container.addChild(colon);
    this.container.addChild(this.secondsDisplay.container);
    this.container.addChild(this.roundDisplay);
    this.container.addChild(this.pointsDisplay.container);

    // stage.addChild(this.container)
}



//PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

function playerPunched(tapped) {
    var punched = false;
    if (clockRunning && player.currentState === "neutral") {

    if (pressedOAt === counter || pressedPAt === counter) {
        var high = false;
        var left = true;
        if (pressingW || punchedHighAt === counter) {
            high = true;
        }
        if (pressedPAt === counter) {
            left = false;
        }
        punched = true;
        player.throwPunch(left,high);
    }

    }
    return punched;
}

titleScreen = document.getElementById('title-screen');
gameCanvas = document.getElementById('game-canvas');
fullscreen = false;

function dismissTitleScreen(full) {
    if (full) {
        requestFullscreen(gameCanvas);
        gameHeight = screen.height;        
    } else {
        gameHeight = window.innerHeight;
    }   
    gameWidth = window.innerWidth; 

    // renderGame(gameWidth,gameHeight); 
            
    // titleScreen.style.visibility = 'hidden';
    
    // update();
}

function renderGame(sizeX,sizeY) {

    ringContainer = new PIXI.Container();

    if (gameWidth >= gameHeight) {
        shorterDimension = gameHeight;
        longerDimension = gameWidth;
    } else {
        shorterDimension = gameWidth;
        longerDimension = gameHeight;
    }
    
    headerHeight = sizeY/7;
    macHeight = headerHeight*1.75

    bottomGap = headerHeight/2;
     

    stage = new PIXI.Container();
    // stage.y = gameHeight;

    
    
    header = new CrowdHeader();
    player = new Player();
    enemy = new Enemy();
    mario = new Mario();

    ringContainer.addChild(header.container);
    ringContainer.addChild(enemy.container);
    ringContainer.addChild(player.container);
    ringContainer.addChild(mario.container);
    

    if (isTouchDevice) {
        buttonPanel = new ButtonPanel();
        getUpButtons = new GetUpButtons();
        ringContainer.addChild(buttonPanel.container);
        ringContainer.addChild(getUpButtons.container);
    }


    stage.addChild(ringContainer)

    ringContainer.y += gameHeight;
    

    
    // preRoundScreen.container.y += gameHeight;

    // gameCanvas.style.zIndex = 1;

    // document.getElementById("game-canvas").style.top = (gameHeight)+"px"

    // gameStarted = true;

    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    PIXI.settings.RESOLUTION = window.devicePixelRatio
renderer = PIXI.autoDetectRenderer({ 
	width:window.innerWidth,
	height:window.innerHeight,
	autoResize: true,
	powerPreference: 'high-performance',
	roundPixels: true,
    backgroundColor:floorColor
 });
    console.log("MADE A RENDERER!!")
    // document.body.appendChild(renderer.view);
    document.getElementById('game-canvas').appendChild(renderer.view);   
    preRoundScreen = new PreRoundScreen();
    roundScreen = new RoundScreen();

    renderer.render(stage);

    doneCreating = true;

    // if (debugMode) {
    //     console.log("DEBUG ----------------")
    //     macStatus = new PIXI.Text("Player:",textStyle1);
    //     enemyStatus = new PIXI.Text("Enemy:",textStyle1);
    //     macStatus.anchor.set(0.5);
    //     enemyStatus.anchor.set(0.5);
    //     macStatus.x = enemyStatus.x = window.innerWidth/2;
    //     macStatus.y = headerHeight*1.5
    //     enemyStatus.y = macStatus.y+macStatus.height;
    //     stage.addChild(macStatus)
    //     stage.addChild(enemyStatus);
    // }
    // update();
}

gameStarted = false;
gameWidth = window.innerWidth
gameHeight = window.innerHeight

function init() {
    renderGame(window.innerWidth,window.innerHeight);
    roundStarted = 0;
    document.getElementById("title-screen").style.top = 0;
    document.body.style.fontSize = document.getElementById("title-start").style.fontSize = window.innerHeight*0.04 + "px";
    startButton = document.getElementById("title-start")
    startButton.onclick = function(){
        console.log("clockel")
        playerStartedAt = counter
        document.getElementById("logo-img").src = titleLogoText2
        document.getElementById("title-start").style.display = "none"
        document.getElementById("title-screen").style.backgroundColor = "#64B0FE"
        document.getElementById('start-message').style.opacity = 1
        setTimeout(function(){
            document.getElementById("title-screen").style.top = "-100%"
            document.getElementById("game-canvas").style.top = 0
            // document.getElementById("game-canvas").style.top = "0"
            // gameStarted = true;
        },1200)
    }
    // $('#start-button').css({
    //     'font-size' : ($('#start-button').height()/4)+"px",
    //     'line-height' : $('#start-button').height()+"px"
    // });
    // // $('#options-button').css({
    // //     'font-size' : ($('#start-button').height()/4)+"px",
    // //     'line-height' : $('#start-button').height()+"px"
    // // });
    // $('#start-message').css({
    //     'top' : ($('#options-button').position().top*0.65)+"px"
        
    // });
    
    // if (window.innerWidth > window.innerHeight) {
    //     $('#title-logo').css({
    //     'width' : window.innerHeight+"px",
        
    //     });
    //     $('#start-button').css({
    //     'width' : window.innerHeight*0.75+"px",
        
    //     });
    //     // $('#options-button').css({
    //     // 'width' : window.innerHeight*0.75+"px",
        
    //     // });
    // }

    
    
//    shadow = new PIXI.filters.DropShadowFilter();
//    stage.filters = [shadow];
//    shadow.distance = 1;

    update();
}