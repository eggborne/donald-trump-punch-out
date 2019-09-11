function damage(fighter,percent) {
    if (!fighter.losingHealth) {
        fighter.oldHealth = fighter.health;
        if (percent < 0) {
            fighter.health = -percent;
            fighter.gainingHealth = true;
            fighter.damageOwed -= percent;

        } else {
            fighter.losingHealth = true;
            fighter.health -= percent;
            fighter.damageOwed += percent;
        }
        
        if (fighter.health <= 0) {
            fighter.health = 0;
        }
    }

    if (fighter === player) {
        var lifeBar = header.macBar;
    } else {
        var lifeBar = header.enemyBar;
    }

    var totalDamageLength = lifeBar.maxWidth*(percent/100);

    var reducePerFrame = Math.ceil(totalDamageLength/(player.reelMaxTime*0.75));
    var intendedLength = fighter.health*(lifeBar.maxWidth/100);
    if ((fighter.losingHealth && lifeBar.width-reducePerFrame > intendedLength) || (fighter.gainingHealth && lifeBar.width-reducePerFrame < intendedLength)) {

        lifeBar.width -= reducePerFrame;
    } else {
        lifeBar.width = intendedLength;
        fighter.losingHealth = fighter.gainingHealth = false;
    }

}
function NumeralImage(num,height,posX,posY,color) {
    this.container = new PIXI.Container();
    var numString = num.toString();
    var buffer = height/10;
    for (var d=0;d<numString.length;d++) {
        var digit = numString.substr(d,1);
        var numeral = new PIXI.Sprite(numeralTexts[digit]);
        numeral.anchor.y = 0.5;
        numeral.tint = color;
        numeral.width = numeral.height = height;
        this.container.addChild(numeral);
        numeral.x += (numeral.width+buffer)*d;
    }
    this.container.x = posX;
    this.container.y = posY;
    this.changeNumeral = function(newNum) {
        var numString = newNum.toString();
        var buffer = height/10;
        this.container.removeChildren();
        for (var d=0;d<numString.length;d++) {
            var digit = numString.substr(d,1);
            var numeral = new PIXI.Sprite(numeralTexts[digit]);
            numeral.anchor.y = 0.5;
            numeral.tint = color;
            numeral.width = numeral.height = height;
            this.container.addChild(numeral);
            numeral.x += (numeral.width+buffer)*d;
        }
    }

}

function GetUpButtons() {
    this.container = new PIXI.Container();
    this.leftUpArrow = new PIXI.Sprite(arrowText);
    this.rightUpArrow = new PIXI.Sprite(arrowText);
    this.leftUpArrow.anchor.set(0.5);
    this.rightUpArrow.anchor.set(0.5);
    this.leftUpArrow.rotation += Math.PI/2;
    this.rightUpArrow.rotation += Math.PI/2;
    this.leftUpArrow.height = this.leftUpArrow.width = this.rightUpArrow.height = this.rightUpArrow.width = buttonPanel.guardGloves.width;
    this.leftUpArrow.x = this.leftUpArrow.width;
    this.rightUpArrow.x = gameWidth-(this.rightUpArrow.width)
    this.leftUpArrow.y = this.rightUpArrow.y = buttonPanel.leftDodgeArrow.y;
    this.container.addChild(this.leftUpArrow);
    this.container.addChild(this.rightUpArrow);
    stage.addChild(this.container);
    this.leftUpArrow.interactive = this.rightUpArrow.interactive = true;
    this.touchAction = function() {
        this.tint = 0x0000ff;
        anyKeyPressedAt = counter;
    }
    this.liftAction = function() {
        this.tint = 0xffffff;
    }
    this.leftUpArrow.on("touchstart",this.touchAction);
    this.leftUpArrow.on("touchend",this.liftAction);
    this.leftUpArrow.on("touchendoutside",this.liftAction);
    this.rightUpArrow.on("touchstart",this.touchAction);
    this.rightUpArrow.on("touchend",this.liftAction);
    this.rightUpArrow.on("touchendoutside",this.liftAction);
    
    this.container.visible = false;

}


function ButtonPanel() {
    this.container = new PIXI.Container();
    this.leftLowGlove = new PIXI.Sprite(gloveText);
    this.leftHighGlove = new PIXI.Sprite(gloveText);
    this.rightLowGlove = new PIXI.Sprite(gloveText);
    this.rightHighGlove = new PIXI.Sprite(gloveText);
    this.guardGloves = new PIXI.Sprite(guardGlovesText);
    this.guardGloves.interactive = true;
    this.guardGloves.height = macHeight/2.5;
    this.guardGloves.width = this.guardGloves.height*1.75;
    this.guardGloves.anchor.set(0.5);
    this.guardGloves.x = gameWidth/2;
    this.guardGloves.y = gameHeight-(this.guardGloves.height/1.5);
    this.container.addChild(this.guardGloves);
    gloveSprites = [this.leftLowGlove,this.leftHighGlove,this.rightLowGlove,this.rightHighGlove];
    for (var g=0;g<gloveSprites.length;g++) {
        var glove = gloveSprites[g];
        glove.interactive = true;
        glove.anchor.set(0.5);
        glove.width = macWidth;
        glove.height = glove.width*1.3;
        this.container.addChild(glove);
    }

    this.touchAction = function() {
        if (this.alpha === 1) {
            this.tint = 0x0000ff;
        }
        if (clockRunning && player.currentState === "neutral") {
            var gloveIndex = gloveSprites.indexOf(this);
            var arrowIndex = arrowSprites.indexOf(this);
            if (gloveIndex >= 0) {
                var left = true;
                var high = false;
                if (gloveIndex % 2 !== 0) {
                    high = true;
                }
                if (gloveIndex >= 2) {
                    left = false;
                }
                player.throwPunch(left,high);
            } else if (arrowIndex >= 0) {
                if (arrowIndex === 0) {
                    player.dodge("left");
                    holdingLeft = true;
                } else if (arrowIndex === 1) {
                    player.dodge("right");
                    holdingRight = true;
                } else {
                    pressingDown = true;
                    player.duck();
                }
            } else if (this.texture === starText && player.starPunches > 0) {
                player.starPunch();
            } else if (this.texture === guardGlovesText) {
                // requestFullscreen(document.getElementById('game-canvas'));
                player.guard();
                pressedSAt = counter;
                holdingGuard = true;
            }
        }

    }
    this.liftAction = function() {
        this.tint = 0xffffff;
        if (holdingLeft) {
            holdingLeft = false;
        }
        if (holdingRight) {
            holdingRight = false;
        }
        if (pressingDown) {
            pressingDown = false;
        }
        if (holdingGuard) {
            holdingGuard = false;
        }
    }
    this.guardGloves.on("touchstart",this.touchAction);
    this.guardGloves.on("touchend",this.liftAction);
    this.guardGloves.on("touchendoutside",this.liftAction);

    this.leftLowGlove.on("touchstart",this.touchAction);
    this.leftLowGlove.on("touchend",this.liftAction);
    this.leftLowGlove.on("touchendoutside",this.liftAction);

    this.leftHighGlove.on("touchstart",this.touchAction);
    this.leftHighGlove.on("touchend",this.liftAction);
    this.leftHighGlove.on("touchendoutside",this.liftAction);

    this.rightLowGlove.on("touchstart",this.touchAction);
    this.rightLowGlove.on("touchend",this.liftAction);
    this.rightLowGlove.on("touchendoutside",this.liftAction);

    this.rightHighGlove.on("touchstart",this.touchAction);
    this.rightHighGlove.on("touchend",this.liftAction);
    this.rightHighGlove.on("touchendoutside",this.liftAction);

    this.rightLowGlove.scale.x *= -1;
    this.rightHighGlove.scale.x *= -1;
    this.leftHighGlove.y = this.rightHighGlove.y = (gameHeight/2);
    this.leftLowGlove.y = this.rightLowGlove.y = this.leftHighGlove.y+(this.leftHighGlove.height*1.2);
    this.leftHighGlove.x = this.leftLowGlove.x = this.leftHighGlove.width/2;
    this.rightHighGlove.x = this.rightLowGlove.x = gameWidth-(this.leftHighGlove.width/2);

    this.leftDodgeArrow = new PIXI.Sprite(arrowText);
    this.rightDodgeArrow = new PIXI.Sprite(arrowText);
    this.leftDuckArrow = new PIXI.Sprite(arrowText);
    this.rightDuckArrow = new PIXI.Sprite(arrowText);
    arrowSprites = [this.leftDodgeArrow,this.rightDodgeArrow,this.leftDuckArrow,this.rightDuckArrow];
    for (var a=0;a<arrowSprites.length;a++) {
        var arrow = arrowSprites[a];
        arrow.interactive = true;
        arrow.anchor.set(0.5);
        arrow.width = macWidth;
        arrow.height = glove.width*1.3;
        this.container.addChild(arrow);
    }
    this.rightDodgeArrow.scale.x *= -1;
    this.leftDuckArrow.rotation -= Math.PI/2;
    this.rightDuckArrow.rotation -= Math.PI/2;
    this.leftDodgeArrow.y = this.rightDodgeArrow.y = this.leftLowGlove.y+(this.leftLowGlove.height*1.5);
    this.leftDuckArrow.y = this.rightDuckArrow.y = this.leftDodgeArrow.y+(this.leftLowGlove.height*1.2);
    this.leftDodgeArrow.x = this.leftDodgeArrow.width/2;
    this.rightDodgeArrow.x = gameWidth-(this.leftDodgeArrow.width/2);
    this.leftDuckArrow.x = this.leftDuckArrow.width/1.7;
    this.rightDuckArrow.x = gameWidth-(this.leftDuckArrow.width/1.7);

    this.leftDodgeArrow.on("touchstart",this.touchAction);
    this.leftDodgeArrow.on("touchend",this.liftAction);
    this.leftDodgeArrow.on("touchendoutside",this.liftAction);

    this.rightDodgeArrow.on("touchstart",this.touchAction);
    this.rightDodgeArrow.on("touchend",this.liftAction);
    this.rightDodgeArrow.on("touchendoutside",this.liftAction);

    this.leftDuckArrow.on("touchstart",this.touchAction);
    this.leftDuckArrow.on("touchend",this.liftAction);
    this.leftDuckArrow.on("touchendoutside",this.liftAction);

    this.rightDuckArrow.on("touchstart",this.touchAction);
    this.rightDuckArrow.on("touchend",this.liftAction);
    this.rightDuckArrow.on("touchendoutside",this.liftAction);

    this.leftStarButton = new PIXI.Sprite(starText);
    this.rightStarButton = new PIXI.Sprite(starText);
    this.leftStarButton.interactive = this.rightStarButton.interactive = true;
    this.leftStarButton.anchor.set(0.5);
    this.rightStarButton.anchor.set(0.5);
    this.leftStarButton.width = this.leftStarButton.height = this.rightStarButton.width = this.rightStarButton.height = this.leftHighGlove.width;
    this.leftStarButton.y = this.rightStarButton.y = this.leftHighGlove.y-(this.leftHighGlove.height/2)-(this.leftStarButton.height/1.1);
    this.leftStarButton.x = this.leftHighGlove.x;
    this.rightStarButton.x = this.rightHighGlove.x;
    this.container.addChild(this.leftStarButton);
    this.container.addChild(this.rightStarButton);

    this.leftStarButton.on("touchstart",this.touchAction);
    this.leftStarButton.on("touchend",this.liftAction);
    this.leftStarButton.on("touchendoutside",this.liftAction);

    this.rightStarButton.on("touchstart",this.touchAction);
    this.rightStarButton.on("touchend",this.liftAction);
    this.rightStarButton.on("touchendoutside",this.liftAction);

    // this.leftStarButton.alpha = 0.2;
    // this.rightStarButton.alpha = 0.2;

    stage.addChild(this.container);

}

function Mario() {
    this.container = new PIXI.Container();
    this.textureSheet = marioSheet;
    this.frameX = 0;
    this.frameY = 5;
    this.textureSheet.frame = new PIXI.Rectangle(this.frameX*(marioSize.x+sheetBuffer), this.frameY*(marioSize.y+sheetBuffer), marioSize.x, marioSize.y);
    this.sprite = new PIXI.Sprite(this.textureSheet);
    if (gameWidth > gameHeight) {
        this.sprite.height = macHeight*0.7;
    } else {
        this.sprite.height = macHeight*0.6;
    }
    this.sprite.width = this.sprite.height*(marioSize.x/marioSize.y);
    this.sprite.anchor.set(0.5);
    this.sprite.anchor.x = 1;
    this.sprite.x = this.startingX = gameWidth+this.sprite.width;
    this.sprite.y = this.neutralY = gameHeight/2;
    if (gameWidth > gameHeight) {
        this.actionSpotX = (gameWidth/2)+enemy.sprite.width*1.5;
    } else {
        this.actionSpotX = gameWidth-this.sprite.width/1.75;
    }
    this.koCloud = new PIXI.Sprite(koText); 
    this.tkoCloud = new PIXI.Sprite(tkoText);
    this.koCloud.scale.x = this.tkoCloud.scale.x = this.sprite.scale.x;
    this.koCloud.scale.y = this.tkoCloud.scale.y = this.sprite.scale.y;
    this.koCloud.x = this.tkoCloud.x = this.actionSpotX;
    this.koCloud.y = this.tkoCloud.y = this.sprite.y-(this.sprite.height/2.9);
    this.koCloud.visible = this.tkoCloud.visible = false;
    this.emergedAt = -1;
    this.landedAt = -1;

    this.container.addChild(this.sprite);
    this.container.addChild(this.koCloud);
    this.container.addChild(this.tkoCloud);
    stage.addChild(this.container);

    this.container.visible = false;

    this.changeFrame = function(newX,newY) {
        this.textureSheet.frame = new PIXI.Rectangle(newX*(marioSize.x+sheetBuffer), newY*(marioSize.y+sheetBuffer), marioSize.x, marioSize.y);
    }

    this.move = function(xAmount,yAmount) {
        this.sprite.x += xAmount;
        this.sprite.y += yAmount;
    }
    this.moveTo = function(newX,newY) {
        this.sprite.x = newX;
        this.sprite.y = newY;
    }

    this.walkToPosition = function(speed) {
        if (!this.container.visible) {
            this.container.visible = true;
            this.emergedAt = counter;
        }
        var distance = this.actionSpotX-this.sprite.x;
        if (Math.abs(distance) >= speed) {
            this.move(-speed,0);
            if (counter % 3 === 0) {
                if (this.frameX === 0) {
                    this.frameX = 1;
                } else {
                    this.frameX = 0;
                }
                this.changeFrame(this.frameX,this.frameY);
            }
        } else {
            this.moveTo(this.actionSpotX,this.sprite.y);
            this.landedAt = counter;
            if (this.frameX !== 0) {
                this.frameX = 0;
                this.changeFrame(this.frameX,this.frameY);
            }
        }

    }
    this.walkOffscreen = function(speed) {
        var distance = this.startingX-this.sprite.x;
        if (Math.abs(distance) >= speed) {
            this.move(speed,0);
            if (counter % 3 === 0) {
                this.frameY = 5;
                if (this.frameX === 0) {
                    this.frameX = 1;                    
                } else {
                    this.frameX = 0;
                }
                this.changeFrame(this.frameX,this.frameY);
            }
        } else {
            this.moveTo(this.startingX,this.sprite.y);
            this.frameX = 0;
            this.frameY = 5;
            this.changeFrame(this.frameX,this.frameY);
            downCount = 1;
            this.container.visible = false;
            fightersReady = undefined;
        }

    }
    this.startFight = function() {
        if (counter === fightersReady) {
            this.frameX = 0;       
            this.frameY = 5;
            this.changeFrame(this.frameX,this.frameY);
        } else {
            if (counter === fightersReady+50) {
                                
                this.frameX = 2;
                this.frameY = 0;
                this.changeFrame(this.frameX,this.frameY);
            } else if (counter === fightersReady+100) {
                this.frameX = 0;
                this.frameY = 5;
                this.changeFrame(this.frameX,this.frameY);
                clockRunning = true;
            }
        }

    }
    this.declareKO = function() {
        var sinceDeclared = counter-winnerDeclaredAt;
        var callKOAt = winnerDeclaredAt+60;
        if (counter === callKOAt) { 
            this.frameX = 2;
            this.frameY = 1;
            this.changeFrame(this.frameX,this.frameY);
            this.koCloud.visible = true;
        } else {            
            if (counter < callKOAt && (callKOAt-counter) % 5 === 0) {
                this.frameX = 2;                
                if (this.frameY === 1) {
                    this.frameY = 2;
                    this.changeFrame(this.frameX,this.frameY); 
                    this.sprite.x = this.actionSpotX;
                } else {
                    this.frameY = 1;
                    this.changeFrame(this.frameX,this.frameY); 
                    this.sprite.x = this.actionSpotX;
                }                            
            }
        }
    }
    this.count = function() {
        var sinceStarted = counter-this.landedAt;
        if (sinceStarted > 0 && sinceStarted % 30 === 0) {
            if (downCount < 6) {
                    this.frameX = 0;
                    this.frameY = downCount-1;
                } else {
                    this.frameX = 1;
                    this.frameY = downCount-6;
                } 
            
            if (sinceStarted % 60 === 0) {
                this.frameX = 0;       
                this.frameY = 5;     
                downCount++; 
                if (downCount === 11) {
                    winnerDeclaredAt = counter;
                } 
                         
            }
            
            this.changeFrame(this.frameX,this.frameY);
        }
    }

}

function PreRoundScreen() {
    this.container = new PIXI.Container();
    this.bg = new PIXI.Sprite(pixelText);
    this.bg.tint = 0x000000;
    this.bg.width = this.bg.height = shorterDimension;
    this.bg.x += (gameWidth-shorterDimension)/2
    this.bg.y = (gameHeight-shorterDimension)/2;
    this.backing = new PIXI.Sprite(pixelText);
    this.backing.tint = 0x000000;
    this.backing.width = gameWidth;
    this.backing.height = gameHeight;

    this.macPortrait = new PIXI.Sprite(macPortraitText);
    this.enemyPortrait = new PIXI.Sprite(trumpPortraitText);

    this.macPortrait.width = this.enemyPortrait.width = this.macPortrait.height = this.enemyPortrait.height = shorterDimension/3;
    
    this.macPortrait.x = this.bg.x+(this.macPortrait.width/6);
    this.macPortrait.y = this.bg.y+(this.bg.height/2.2)
    this.enemyPortrait.x = (this.bg.x+this.bg.width)-this.enemyPortrait.width-(this.enemyPortrait.width/6);
    this.enemyPortrait.y = this.bg.y+this.enemyPortrait.height*0.75

    this.container.addChild(this.backing);
    this.container.addChild(this.bg);
    this.container.addChild(this.macPortrait);
    this.container.addChild(this.enemyPortrait);

    var fontSize = this.macPortrait.height/12;


    this.playerName = new TextLine("little mac",this.macPortrait.x,this.macPortrait.y+this.macPortrait.height*1.1,this.macPortrait.height/12,(this.macPortrait.width)+(this.macPortrait.width/6),0xffffff);
    this.enemyName = new TextLine("donald/\"the donald& trump",this.enemyPortrait.x,this.enemyPortrait.y-(fontSize*4)-(this.macPortrait.height*0.1),this.macPortrait.height/12,(this.macPortrait.width)+(this.macPortrait.width/6),0xffffff);
    
    this.enemyBio1 = new TextLine("from: queens,ny.",this.enemyPortrait.x,this.enemyPortrait.y+(this.enemyPortrait.height*1.1),this.macPortrait.height/12,(this.macPortrait.width)+(this.macPortrait.width/6),0xffffff);
    this.enemyBio2 = new TextLine("age: 69",this.enemyPortrait.x,this.enemyPortrait.y+(this.enemyPortrait.height*1.1)+this.enemyBio1.container.height+(this.macPortrait.height/6),this.macPortrait.height/12,(this.macPortrait.width)+(this.macPortrait.width/6),0xffffff);
    this.enemyBio3 = new TextLine("weight: 256",this.enemyPortrait.x,this.enemyPortrait.y+(this.enemyPortrait.height*1.1)+this.enemyBio1.container.height+this.enemyBio2.container.height+(this.macPortrait.height/3),this.macPortrait.height/12,(this.macPortrait.width)+(this.macPortrait.width/6),0xffffff);

    this.playerBio1 = new TextLine("weight: 115",this.macPortrait.x,this.macPortrait.y-fontSize-(this.macPortrait.height*0.1),this.macPortrait.height/12,(this.macPortrait.width)+(this.macPortrait.width/6),0xffffff);
    if (this.playerBio1.container.height > fontSize*1.5) {
        this.playerBio1.container.y -= fontSize*1.75;

    }

    this.playerBio2 = new TextLine("age: 17",this.macPortrait.x,this.macPortrait.y-(this.macPortrait.height/3)-(this.macPortrait.height*0.1),this.macPortrait.height/12,(this.macPortrait.width)+(this.macPortrait.width/6),0xffffff);
    this.playerBio3 = new TextLine("from: bronx,ny",this.macPortrait.x,this.macPortrait.y-(this.macPortrait.height/1.5)-fontSize-(this.macPortrait.height*0.1),this.macPortrait.height/12,(this.macPortrait.width)+(this.macPortrait.width/6),0xffffff);
    // this.playerBio2.container.y -= (this.macPortrait.height/6);
    // this.playerBio3.container.y -= (this.macPortrait.height/6)*2;

    this.vsText = new TextLine("vs.",gameWidth/2,gameHeight/2,this.macPortrait.height/12,macWidth,0xf1ce52);
    this.vsText.container.x -= this.vsText.container.width/2;
    this.vsText.y -= this.vsText.container.height/2;

    this.container.addChild(this.vsText.container);
    this.container.addChild(this.enemyBio1.container);
    this.container.addChild(this.enemyBio2.container);
    this.container.addChild(this.enemyBio3.container);
    this.container.addChild(this.playerBio1.container);
    this.container.addChild(this.playerBio2.container);
    this.container.addChild(this.playerBio3.container);
    this.container.addChild(this.playerName.container);
    this.container.addChild(this.enemyName.container);

    this.container.interactive = true;

    this.touchAction = function() {
        
        if (playerStartedAt) {
            playerStartedAt = undefined;
            playerReadyAt = counter;
            // roundScreen.container.y = 0
            // renderGame(window.innerWidth,window.innerHeight);
            gameStarted = true;
            preRoundScreen.container.visible = false;
            roundScreen.container.visible = true
            console.log("CLICK PRsdfdsfEROUND")
            // setTimeout(function(){
            //     roundScreen.container.visible = false
            //     console.log("setting ingiddfsdfds")
            //     // stage.y = -gameHeight
            // },2000)
            
        }
        
        
        // preRoundScreen.container.visible = false
        // roundScreen.container.alpha = 1
    }

    this.container.on("touchstart",this.touchAction);
    this.container.on("mousedown",this.touchAction);

    stage.addChild(this.container);

    // this.container.y = -gameHeight;
    

}

function RoundScreen(round) {
    this.container = new PIXI.Container();
    this.backing = new PIXI.Sprite(pixelText);
    // this.bg = new PIXI.Sprite(pixelText);
    // this.bg.tint = 0x000000;
    this.backing.tint = 0x000000;
    this.backing.width = gameWidth;
    this.backing.height = gameHeight;
    // if (gameWidth > gameHeight) {
    //     this.bg.height = this.bg.width = gameHeight;
    //     this.bg.x = (gameWidth-gameHeight)/2;
    // } else {
    //     this.bg.height = this.bg.width = gameWidth;
    //     this.bg.y = (gameHeight-gameWidth)/2;
    // }
    
    this.roundText = new TextLine("round",0,0,this.backing.width/32,this.backing.width,0xf1ce52);
    this.roundText.container.x = (gameWidth/2)-this.roundText.container.width/2;

    // this.roundNumeral = new TextLine(currentRound.toString(),gameWidth/2,this.bg.height/2,this.bg.height/3,this.bg.width,0xffffff);
    // this.roundNumeral.container.x -= this.roundNumeral.container.width/2;
    // this.roundNumeral.container.y += this.roundNumeral.container.height/2;
    
    this.container.addChild(this.backing);
    // this.container.addChild(this.bg);
    this.roundDisplay = new RoundDisplay(this.container,numeralPatterns[currentRound-1])
    this.roundText.container.y = this.roundDisplay.container.y-(this.roundText.container.height*2.5)
    this.container.addChild(this.roundText.container);
    // this.container.addChild(this.roundNumeral.container);
    this.container.visible = false
    
    stage.addChild(this.container);
    // this.container.y += gameHeight;
}
numeralPatterns = [
    [
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,1,1,0,0,0,0,0],
        [0,0,0,0,1,1,1,0,0,0,0,0],
        [0,0,0,1,0,1,1,0,0,0,0,0],
        [0,0,0,0,0,1,1,0,0,0,0,0],
        [0,0,0,0,0,1,1,0,0,0,0,0],
        [0,0,0,0,0,1,1,0,0,0,0,0],
        [0,0,0,0,0,1,1,0,0,0,0,0],
        [0,0,0,0,0,1,1,0,0,0,0,0],
        [0,0,0,0,0,1,1,0,0,0,0,0],
        [0,0,0,0,0,1,1,0,0,0,0,0],
        [0,0,0,0,0,1,1,0,0,0,0,0],
        [0,0,0,1,1,1,1,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
    ]
]
function RoundDisplay(cont,pattern) {
    this.container = new PIXI.Container()
    var tileSize = (window.innerWidth/32)
    this.baseX = (tileSize*10.5)
    this.baseY = (window.innerHeight/2)-(tileSize*7.5)
    this.container.x = this.baseX
    this.container.y = this.baseY
    // this.roundText = new TextLine("round",gameWidth/2,this.bg.y+(this.bg.height/20),this.bg.height/24,this.bg.width,0xf1ce52);

    cont.addChild(this.container)
    for (var h=0;h<16;h++) {
        for(w=0;w<12;w++) {
            
            if (pattern[h][w]===0) {
                var tile = new PIXI.Sprite(pixelText)
                tile.tint = 0x7c0800
            } else {
                var tile = new PIXI.Sprite(tileOnText)
                tile.tint = 0xffffff
            }
            tile.anchor.set(0.5)
            tile.width = tile.height = tileSize*0.9
            this.container.addChild(tile)
            tile.x = (tileSize*w)
            tile.y = (tileSize*h)
        }
    }
}


function TextLine(legend,posX,posY,size,wrapX,color) {
    this.container = new PIXI.Container();
    var cursorX = posX;
    var cursorY = posY;

    var wordArray = legend.split(" ");
    for (var w=0;w<wordArray.length;w++) {
        var word = wordArray[w];
        
        for (var p=0;p<word.length;p++) {
            var letterIndex = letters.indexOf(word.split("")[p]);
            var sheet = letterSheet;
            if (letterIndex >= 0) {
                var frameX = letterIndex;
                var frameY = 0;   
            } else if (punctuation.indexOf(word.split("")[p]) >= 0) {
                var frameX = punctuation.indexOf(word.split("")[p]);
                var frameY = 2;
            } else {
                var frameX = word.split("")[p];
                var frameY = 1;
            }
            if (word.split("")[p] === "&") { // right quotation mark
                frameX = frameY = 2;
            }
            if (word.split("")[p] === "/") { // new line
                frameX = 26;
                frameY = 0;
                cursorX = posX;
                cursorY += snap.height*1.75;
            } else {
                sheet.frame = new PIXI.Rectangle(frameX*(letterSize+letterBuffer), frameY*(letterSize+letterBuffer), letterSize, letterSize);
                var letterSprite = new PIXI.Sprite(sheet);
                var snap = new PIXI.Sprite(renderer.generateTexture(letterSprite));
                snap.width = snap.height = size;
                if (p === 0) {
                    var wordWidth = word.length*(snap.width*1.25);
                    if (cursorX+wordWidth > posX+wrapX) {
                        cursorX = posX;
                        cursorY += snap.height*1.75;
                    } else if (cursorX > posX) {
                        cursorX += snap.width*1.15;
                    }
                }
                snap.x = cursorX;
                snap.y = cursorY;
                cursorX = snap.x+(snap.width*1.25);
                snap.tint = color;
                this.container.addChild(snap);           
            }
            
        }
        
        
    }
    // for (var n=0;n<legend.length;n++) {
    //     var wordArray = legend.split(" ");
        

    //     var letterIndex = letters.indexOf(legend[n]);
    //     var sheet = letterSheet;
    //     if (letterIndex >= 0) {
    //         var frameX = letterIndex;
    //         var frameY = 0;   
    //     } else {
    //         var frameX = punctuation.indexOf(legend[n]);
    //         var frameY = 2;
    //     }
    //     sheet.frame = new PIXI.Rectangle(frameX*(letterSize+sheetBuffer), frameY*(letterSize+sheetBuffer), letterSize, letterSize);
    //     var letterSprite = new PIXI.Sprite(sheet);

    //     var snap = new PIXI.Sprite(letterSprite.generateTexture(renderer));

    //     snap.width = snap.height = size;


    //     if (cursorX >= posX+wrapX) {
    //         cursorX = posX;
    //         cursorY += snap.height*1.5;
    //     }

    //     snap.x = cursorX;
    //     snap.y = cursorY;

    //     cursorX = snap.x+(snap.width*1.25);

        

    //     this.container.addChild(snap);
    // }
    // stage.addChildAt(this.container,stage.children.length)
}