function Enemy() {
    this.container = new PIXI.Container();
    this.textureSheet = enemySheet;
    this.trunksSheet = enemyTrunksSheet;
    this.currentFrame = 0;
    this.currentColumn = 0;
    this.textureSheet.frame = new PIXI.Rectangle(this.currentColumn*(enemySize.x+enemySheetBuffer), this.currentFrame*(enemySize.y+enemySheetBuffer), enemySize.x, enemySize.y);
    this.trunksSheet.frame = new PIXI.Rectangle(this.currentColumn*(enemySize.x+enemySheetBuffer), this.currentFrame*(enemySize.y+enemySheetBuffer), enemySize.x, enemySize.y);
    this.sprite = new PIXI.Sprite(this.textureSheet);
    this.sprite.height = macHeight*1.7;
    this.sprite.width = this.sprite.height/2;
    this.sprite.anchor.set(0.5);

    this.sprite.x = this.neutralX = player.skin.x+(macWidth/10);
    this.sprite.y = this.neutralY = player.skin.y-(macHeight/1.6);
    this.tauntY = this.sprite.y-(this.sprite.height*0.5);

    this.sprite.y = this.tauntY;

    this.trunks = new PIXI.Sprite(this.trunksSheet);
    this.trunks.tint = enemyTrunksColor;
    this.trunks.height = this.sprite.height;
    this.trunks.width = this.sprite.width;
    this.trunks.anchor.set(0.5);
    this.trunks.x = this.sprite.x
    this.trunks.y = this.sprite.y;
    
    this.container.addChild(this.sprite);
    this.container.addChild(this.trunks);

    // stage.addChildAt(this.container,stage.children.indexOf(player.container));
    this.currentState = "neutral";
    this.currentPunch = {type:undefined,power:15};
    this.beganDodge = -99;
    this.dodgeSpeed = 8;
    this.dodgeHoldMax = this.dodgeHoldTime = 12;
    this.dodgeDistance = this.sprite.width/3;
    this.damageOwed = 0;

    this.gloveRaised = "right";
    this.highStance = false;
    this.beganPunch = this.endedPunch = -1;
    this.punchSpeed = 5;
    this.health = this.oldHealth = 100;
    this.stunnedAt = this.enteredRestState = undefined;
    this.postPunchVulnerabileTime = 120;
    this.exerted = false;
    this.blocked = false;
    this.knockedOutAt = this.hitMatAt = -1;
    this.recoveredAt = -1;

    this.getUpTime = 240;
    this.getUpSpeed = 45;

    this.stunTime = this.stunMaxTime = 60;
    this.reelDistance = {x:this.sprite.width/4,y:this.sprite.width/4};
    this.lastPunched = undefined;

    this.punches = ["leftJab","rightJab","leftHook","rightHook"];

    this.enterRandomRestState = function() {
        var rando = randomInt(0,12);
        if (randomInt(0,1) && rando < 1) {
            this.currentState = "neutral";
        } else if (rando <= 8) {
            this.currentState = "guarding";
        } else if (rando > 8) {
            this.currentState = "evading";
        }
        this.enteredRestState = counter;
    }
    this.move = function(amountX,amountY) {
        this.sprite.x += amountX;
        this.sprite.y += amountY;
        this.trunks.x += amountX;
        this.trunks.y += amountY;
    }
    this.moveTo = function(posX,posY) {
        this.sprite.x = posX;
        this.sprite.y = posY;
        this.trunks.x = posX;
        this.trunks.y = posY;
    }

    this.reelTime = this.reelMaxTime = 10;
    this.punchHangTime = this.punchHangMaxTime = 30;
    this.windUpTime = this.windUpMaxTime = 30;

    this.windUp = function(length,punch) {
        if (this.currentState !== "windingUp") {
            if (this.currentFrame === 0) {
                this.currentFrame = 1;
            } else {
                this.currentFrame = 0;
            }
            this.currentColumn = 0;
            this.currentState = "windingUp";
            this.changeFrame(this.currentColumn,this.currentFrame);
            this.windUpTime = length;
            this.windUpTime--;
        } else {
            if (this.windUpTime % 5 === 0) {
                if (this.currentFrame === 0) {
                    this.currentFrame = 1;
                } else {
                    this.currentFrame = 0;
                }
                this.changeFrame(this.currentColumn,this.currentFrame);
            }
            this.windUpTime--;
            if (this.windUpTime === 0) {

                if (punch) {
                    this.punch(punch);
                } else {
                    this.enterRandomRestState();
                    this.currentFrame = 0;
                    this.currentColumn = 0;
                    this.changeFrame(this.currentColumn,this.currentFrame);
                }
            }
        }

    }

    this.punch = function(type) {
        if (this.currentState !== "punching") {
            this.currentState = "punching";
            this.currentPunch.type = type;
            if (type === "leftJab") {
                this.currentFrame = 2;
                this.currentColumn = 3;
                playSound(fwitSound1);

            }
            if (type === "rightJab") {
                this.currentFrame = 2;
                this.currentColumn = 3;
                this.flipX();
                playSound(fwitSound1);
            }
            if (type === "leftHook") {
                this.currentFrame = 2;
                this.currentColumn = 1;
                this.flipX();
                playSound(hookSound1);
            }
            if (type === "rightHook") {
                this.currentFrame = 2;
                this.currentColumn = 1;
                playSound(hookSound1);
            }
            if (type === "leftUppercut") {
                this.currentFrame = 4;
                this.currentColumn = 2;
                this.flipX();
                playSound(hookSound1);
            }
            if (type === "rightUppercut") {
                this.currentFrame = 4;
                this.currentColumn = 2;
                playSound(hookSound1);
            }
            this.changeFrame(this.currentColumn,this.currentFrame);
            this.beganPunch = counter;
        } else {
            if (this.currentPunch.type === "leftJab" || this.currentPunch.type === "rightJab") {
                var startingColumn = 3;
                var endingColumn = 3;
                var impactColumn = 3;

            } else if (this.currentPunch.type === "leftHook" || this.currentPunch.type === "rightHook") {
                var startingColumn = 1;
                var endingColumn = 2;
                var impactColumn = 1;
            }
            else if (this.currentPunch.type === "leftUppercut" || this.currentPunch.type === "rightUppercut") {
                var startingColumn = 2;
                var endingColumn = 3;
                var impactColumn = 3;
            }

            var sinceEnded = counter-this.beganPunch-(this.punchSpeed*(endingColumn-startingColumn));


            if (sinceEnded < this.punchHangTime && (counter-this.beganPunch) % this.punchSpeed === 0 && this.currentColumn <= endingColumn) {
               

                
                if (!this.exerted && this.currentColumn === impactColumn) {
                    if (player.inHitZone() || player.currentState === "neutral" || player.currentState === "punching") {
                        damage(player,this.currentPunch.power);
                        player.reel();
                        this.punchHangTime = sinceEnded+30
                        
                    }
                    if (player.currentState === "guarding") {
                        playSound(blockSound); 
                        this.blocked = true;   

                    }
                    this.exerted = true;                   
                } else if (!this.blocked && this.currentColumn < endingColumn) {
                    this.currentColumn++;
                    this.changeFrame(this.currentColumn,this.currentFrame);
                }               
            }

            if (sinceEnded === this.punchHangTime || ((this.blocked || player.currentState === "reeling") && sinceEnded >= Math.abs(this.punchHangTime/2))) {
                this.exerted = this.blocked = false;
                this.enterRandomRestState();
                if (this.sprite.scale.x < 0) {
                    this.flipX();
                }
                this.currentFrame = 0;
                this.currentColumn = 0;
                this.changeFrame(this.currentColumn,this.currentFrame);
            }
        }
    }
    // getting up 0 = 12
    // falling 2 = 45
    this.changeFrame = function(newColumn,newFrame,extraWidth) {
        if (!extraWidth) {
            var addedX = 0;
        } else {
            addedX = extraWidth;
        }
        this.textureSheet.frame = new PIXI.Rectangle(this.currentColumn*(enemySize.x+enemySheetBuffer), this.currentFrame*(enemySize.y+enemySheetBuffer), enemySize.x+addedX, enemySize.y);
        this.trunksSheet.frame = new PIXI.Rectangle(this.currentColumn*(enemySize.x+enemySheetBuffer), this.currentFrame*(enemySize.y+enemySheetBuffer), enemySize.x+addedX, enemySize.y);

    }
    
    this.blockPunch = function(left,high) {
        if (this.currentState !== "blocking") {
            this.currentFrame = 5;
            if (high) {
                this.currentColumn = 0;
            } else {
                this.currentColumn = 1;
            }
            this.currentState = "blocking";
            this.changeFrame(this.currentColumn,this.currentFrame);
        }
        if (player.currentState !== "punching") {
            this.enterRandomRestState();
            this.currentFrame = 0;
            this.currentColumn = 0;
            this.changeFrame(this.currentColumn,this.currentFrame);
        }
    }

    this.flipX = function() {
        this.sprite.scale.x *= -1;
        this.trunks.scale.x *= -1;

    }

    this.reel = function() {
        var sincePunched = counter-this.lastPunched;       
        var endTime = this.reelTime;
        
        if (sincePunched < endTime) {
            var incrementX = 0;
            var incrementY = 0;
            if (sincePunched === 3 && this.health <= 0) {
                this.fall();
                clockRunning = false;
            }
            if (sincePunched < 3) {
                incrementX = this.reelDistance.x/5;
                incrementY = -this.reelDistance.x/12;               
            } else if (sincePunched >= endTime-3) {
                incrementX = -this.reelDistance.x/5;
                incrementY = this.reelDistance.x/12;  
            }
            if (this.sprite.scale.x < 0) {
                incrementX *= -1;
            }

            if (player.currentPunch.high) {
                incrementX *= 0.4;
                incrementY *= 2;
            }
            
            this.move(incrementX,incrementY);
        }
        if (sincePunched === endTime) { 
            if (this.stunTime > 0 || counter-this.beganPunch < this.postPunchVulnerabileTime) {
                this.stun();
            } else if (this.currentState === "reeling") {
                this.enterRandomRestState();
                this.currentFrame = 0;
                this.currentColumn = 0;
                this.changeFrame(enemy.currentColumn,enemy.currentFrame);
                if (this.sprite.scale.x < 0) {
                    this.flipX();
                }
            }
        }
    }
    this.fall = function() {
        if (this.currentState !== "falling") {
            this.currentColumn = 0;
            this.currentFrame = 3;
            this.changeFrame(this.currentColumn,this.currentFrame);
            this.currentState = "falling";
            this.knockedOutAt = counter;
            this.getUpTime = randomInt(60,480)
            
        }
        var sinceKnockedOut = counter-this.knockedOutAt;
        if (this.sprite.y > this.tauntY) {
            
            var incrementX = 0;
            var incrementY = -macHeight/50;
            if (sinceKnockedOut === 20 && this.currentColumn < 2) {
                this.currentColumn++;
                this.changeFrame(this.currentColumn,this.currentFrame);
                if (this.currentColumn === 2) {
                    this.changeFrame(this.currentColumn,this.currentFrame,45);
                }
            }
            this.move(incrementX,incrementY);

        }
        if (this.sprite.y <= this.tauntY || sinceKnockedOut === 300) {
            
            this.currentState = "knockedOut";
            if (this.currentColumn !== 2) {
                this.currentColumn = 2;
                this.changeFrame(this.currentColumn,this.currentFrame,45);
            }
            this.hitMatAt = counter;
            this.moveTo(this.sprite.x,this.tauntY);
        }
    }
    this.getUp = function() {
        if (this.currentState !== "gettingUp") {
            this.currentColumn = 3;
            this.currentFrame = 5;
            this.changeFrame(this.currentColumn,this.currentFrame,12);
            this.currentState = "gettingUp";
            this.gainingHealth = true;
            downCount = 1;
            
        } else {
            var sinceDown = counter-this.hitMatAt;
            if (sinceDown === this.getUpTime+this.getUpSpeed) {
                this.currentColumn = 5;
                this.changeFrame(this.currentColumn,this.currentFrame);
            } else if (sinceDown === this.getUpTime+(this.getUpSpeed*2)) {
                this.currentColumn = 0;
                this.currentFrame = 0;
                if (this.sprite.scale.x < 0) {
                    this.flipX();
                }
                this.changeFrame(this.currentColumn,this.currentFrame);
                this.enterRandomRestState();
                this.recoveredAt = counter;
            }
        }
    }
    this.walkToCenter = function(speed) {
        var distance = this.neutralX-this.sprite.x;
        var moveSpeed = speed;
        if (distance < 0) {
            moveSpeed *= -1;
        }
        if (Math.abs(distance) >= speed) {
            this.move(moveSpeed,0);
        } else {
            this.moveTo(this.neutralX,this.sprite.y);
            fightersReady = counter;
        }

    }

    this.walkToFightPosition = function(speed) {
        var distance = this.neutralY-this.sprite.y;
        var moveSpeed = speed;
        if (Math.abs(distance) >= speed) {
            this.move(0,moveSpeed);
        } else {
            this.moveTo(this.sprite.x,this.neutralY);
        }

    }
    this.moveToTauntPosition = function(speed) {
        var distance = this.tauntY-this.sprite.y;
        var moveSpeed = -speed;
        if (this.sprite.y+moveSpeed > this.tauntY) {
            this.move(0,moveSpeed);
        } else {
            this.moveTo(this.sprite.x,this.tauntY);
            
        }

    }

    this.dodge = function(duck,counterAttack) {
        if (this.currentState === "evading") {
            if (duck) {
                this.currentFrame = 4;
                this.currentColumn = 1;
                this.currentState = "ducking";
            } else {
                this.currentFrame = 5;
                this.currentColumn = 2;
                if (randomInt(0,1)) {
                    this.currentState = "left";
                } else {
                    this.currentState = "right";
                    this.flipX();
                }
                if (player.currentState === "starPunching") {
                    this.dodgeHoldTime *= 1.5;
                }
            }
            this.changeFrame(this.currentColumn,this.currentFrame);
            this.beganDodge = counter;


        }
        var sinceDodge = counter-this.beganDodge;
        if (duck) {
            if (this.dodgeHoldTime > 0) {
                if (this.dodgeHoldTime === Math.abs(this.dodgeHoldMax*0.75)) {
                    this.currentColumn = 0;
                    this.changeFrame(this.currentColumn,this.currentFrame);
                } else if (this.dodgeHoldTime === Math.abs(this.dodgeHoldMax*0.25)) {
                    this.currentColumn = 1;
                    this.changeFrame(this.currentColumn,this.currentFrame);
                }
                this.dodgeHoldTime--;
            } else {
                if (counterAttack) {
                    if (randomInt(0,1)) {
                        this.punch("leftUppercut");
                    } else {
                        this.punch("rightUppercut");
                    }
                } else {
                    this.enterRandomRestState();
                    this.currentColumn = 0;
                    this.currentFrame = 0;

                    this.changeFrame(this.currentColumn,this.currentFrame);
                }
                this.beganDodge = undefined;
                this.dodgeHoldTime = this.dodgeHoldMax;

            }
        } else {
            if (this.currentState === "right") {
                var movePerFrame = this.dodgeDistance/(this.dodgeSpeed/2);
            } else {
                var movePerFrame = -(this.dodgeDistance/(this.dodgeSpeed/2));
            }
            var maxDistance = Math.floor(this.dodgeSpeed/2);

            if (sinceDodge < maxDistance) {
                this.move(-movePerFrame,0);
            } else {
                if (this.dodgeHoldTime > 0) {
                    this.dodgeHoldTime--;
                } else {
                    this.move(movePerFrame,0);
                    if (Math.abs((this.neutralX)-this.sprite.x) < Math.abs(movePerFrame)) {
                        this.move(this.neutralX-this.sprite.x,0);
                    }
                }
            }
            if (this.sprite.x === this.neutralX) {
                this.enterRandomRestState();
                this.currentColumn = 0;
                this.currentFrame = 0;
                this.beganDodge = undefined;
                this.dodgeHoldTime = this.dodgeHoldMax;
                this.changeFrame(this.currentColumn,this.currentFrame);
                if (this.sprite.scale.x < 0) {
                    this.flipX();
                }
            }
        }
    };

    this.stun = function() {
        if (this.currentState !== "stunned") {
            this.currentFrame = 2;
            this.currentColumn = 4;
            this.changeFrame(this.currentColumn,this.currentFrame);
            if (this.sprite.scale.x < 0) {
                this.flipX();
            }
            this.stunnedAt = counter;
            if (!this.stunTime) {
                this.stunTime = this.stunMaxTime;
            }
            this.currentState = "stunned";
        } else {
            var sinceStunned = counter-this.stunnedAt;
            if (sinceStunned % 10 === 0) {
                if (this.currentColumn === 4) {
                    this.currentColumn = 5;
                } else {
                    this.currentColumn = 4;
                }
                this.changeFrame(this.currentColumn,this.currentFrame);
            }
            this.stunTime--;
            if (player.currentState !== "punching" && this.stunTime < 10) {
                this.stunTime = 0
                this.currentFrame = 0;
                this.currentColumn = 0;
                this.changeFrame(this.currentColumn,this.currentFrame);
                this.currentState = "guarding";
            }

        }
    }
    this.dance = function(speed) {
        var sinceRest = counter-this.enteredRestState;
        if (sinceRest > 0 && sinceRest % speed === 0) {
            if (this.gloveRaised === "right") {
                var startingFrame = 0;
                if (clockRunning && randomInt(0,1) === 0) {
                    this.currentFrame = 1;
                }
            } else {
                var startingFrame = 3;
            }
            
            if (this.currentColumn < startingFrame+2) {
                this.currentColumn++;
            } else {
                this.currentColumn = startingFrame;
                if (sinceRest % speed*3 === 0 && randomInt(0,1)) {
                    if (this.gloveRaised === "right") {
                        this.gloveRaised = "left";
                        if (this.currentFrame === 1) {
                            this.currentFrame = 0;
                        }
                    } else {
                        this.gloveRaised = "right";
                    }
                }
            }

            this.changeFrame(this.currentColumn,this.currentFrame);

//            if (this.currentColumn === 2) {
//                this.sprite.y -= Math.round(this.sprite.height/80);
//            }
//            if (this.currentColumn === 4) {
//                this.sprite.y += Math.round(this.sprite.height/80);
//            }
        }
    }
}