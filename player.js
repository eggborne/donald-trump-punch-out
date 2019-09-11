function Player() {
    this.container = new PIXI.Container();
//    this.sprite = new PIXI.Sprite(macSprites.neutralStance[0]);
    this.skinSheet = macSkinSheet;
    this.outlineSheet = macOutlineSheet;
    this.trunksSheet = macTrunksSheet;
    this.currentFrame = 0;
    this.currentColumn = 0;
    this.skinSheet.frame = new PIXI.Rectangle(0, 0, macSize.x, macSize.y);
    this.outlineSheet.frame = new PIXI.Rectangle(0, 0, macSize.x, macSize.y);
    this.trunksSheet.frame = new PIXI.Rectangle(0, 0, macSize.x, macSize.y);
    this.skin = new PIXI.Sprite(this.skinSheet);
    this.outline = new PIXI.Sprite(this.outlineSheet);
    this.trunks = new PIXI.Sprite(this.trunksSheet);
    this.skin.tint = macSkinColor;
    this.outline.tint = macOutlineColor;
    this.trunks.tint = macTrunksColor;

    this.health = this.oldHealth = 100;
    this.stamina = 100;
    this.starPunches = 8;
    header.starDisplay.text = this.starPunches;
    this.damageOwed = 0;

    this.spriteHWRatio = this.skin.height/this.skin.width;
    this.skin.height = this.outline.height = this.trunks.height = macHeight;
    macWidth = this.skin.width = this.outline.width = this.trunks.width = this.skin.height/this.spriteHWRatio;
    this.skin.anchor.set(0.5);
    this.outline.anchor.set(0.5);
    this.trunks.anchor.set(0.5);
    this.skin.x = this.outline.x = this.trunks.x = neutralX = gameWidth/2;
    neutralY = gameHeight-bottomGap-(macHeight/1.1);
    if (gameWidth < gameHeight) {
        neutralY -= macHeight/5;
    };
    recoverY = gameHeight;
    
    knockoutY = gameHeight+(macHeight/2);

    this.skin.y = this.outline.y = this.trunks.y = neutralY
    this.beganPunch = this.endedPunch = undefined;
    this.beganDodge = undefined;
    this.beganDuck = undefined;
    this.beganStarPunch = undefined;
    this.currentState = "neutral";
    this.basePower = 2.5;
    this.punchSpeed = 3;
    this.starPunchSpeed = 20;
    this.starPunchHangTime = 3;
    this.dodgeSpeed = 10;
    this.dodgeDistance = macWidth*0.9;
    this.punchDistance = macHeight*0.15;
    this.dodgeHoldMax = this.dodgeHoldTime = 30;
    this.withdrawing = false;
    this.currentPunch = {left:true,high:false,distance:this.punchDistance,power:this.basePower};
    this.losingHealth = this.gainingHealth = false;

    this.container.addChild(this.skin);
    this.container.addChild(this.outline);
    this.container.addChild(this.trunks);

    this.reelTime = this.reelMaxTime = 30;
    this.knockedOutAt = undefined;
    this.hitMatAt = undefined;
    this.recoveredAt = -1;

    this.reelDistance = {x:macWidth,y:macWidth/4};

    // stage.addChild(this.container);

    this.inHitZone = function() {
        return ((this.currentState === "left" || this.currentState === "right") && Math.abs(neutralX-this.skin.x) < (this.dodgeDistance/2));
    }



    this.changeFrame = function(newColumn,newFrame) {
        // this.skinSheet.frame.x = newColumn*(macSize.x+sheetBuffer);
        // this.skinSheet.frame.y = newFrame*(macSize.y+sheetBuffer);
        // this.outlineSheet.frame.x = newColumn*(macSize.x+sheetBuffer);
        // this.outlineSheet.frame.y = newFrame*(macSize.y+sheetBuffer);
        // this.trunksSheet.frame.x = newColumn*(macSize.x+sheetBuffer);
        // this.trunksSheet.frame.y = newFrame*(macSize.y+sheetBuffer);
        
        this.skinSheet.frame = new PIXI.Rectangle(newColumn*(macSize.x+sheetBuffer), newFrame*(macSize.y+sheetBuffer), macSize.x, macSize.y);
        this.outlineSheet.frame = new PIXI.Rectangle(newColumn*(macSize.x+sheetBuffer), newFrame*(macSize.y+sheetBuffer), macSize.x, macSize.y);
        this.trunksSheet.frame = new PIXI.Rectangle(newColumn*(macSize.x+sheetBuffer), newFrame*(macSize.y+sheetBuffer), macSize.x, macSize.y);
    }

    this.move = function(xAmount,yAmount) {
        this.skin.x += xAmount;
        this.outline.x += xAmount;
        this.trunks.x += xAmount;
        this.skin.y += yAmount;
        this.outline.y += yAmount;
        this.trunks.y += yAmount;
    }
    this.moveTo = function(newX,newY) {
        this.skin.x = newX;
        this.outline.x = newX;
        this.trunks.x = newX;
        this.skin.y = newY;
        this.outline.y = newY;
        this.trunks.y = newY;
    }
    this.flipX = function() {
        this.skin.scale.x *= -1;
        this.outline.scale.x *= -1;
        this.trunks.scale.x *= -1;
    }

    this.dance = function(speed) {

        if (counter % speed === 0) {
            if (this.currentFrame < 1) {
                this.currentFrame++;
            } else {
                this.currentFrame = 0;
            }
            this.changeFrame(this.currentColumn,this.currentFrame);
        }
    }
    this.starPunch = function() {
        if (this.starPunches > 0 && this.currentState === "neutral") {
            this.currentState = "starPunching";
            this.beganStarPunch = counter;
            this.currentColumn = 3;
            this.currentFrame = 0;
            this.changeFrame(this.currentColumn,this.currentFrame);
            header.starDisplay.changeNumeral(this.starPunches-1);
            if (buttonPanel && this.starPunches-1 === 0) {
                buttonPanel.leftStarButton.alpha = 0.2;
                buttonPanel.rightStarButton.alpha = 0.2;
            }
        } else if (this.starPunches > 0) {
        var sinceBegan = counter-this.beganStarPunch;
        var yIncrement = Math.ceil( this.punchDistance*1.5/(this.starPunchSpeed/3) );
        var changePerFrame = Math.ceil(this.starPunchSpeed/6);

        if (this.currentFrame < 4) {
            this.move(0,-yIncrement);
        } else if (this.starPunchHangTime === 0) {
            this.move(0,yIncrement*2.2);
            if (this.skin.y >= neutralY) {
                this.moveTo(this.skin.x,neutralY);
            }
        }
        if (sinceBegan > 0 && sinceBegan % changePerFrame === 0) {
            if (this.currentFrame < 4) {
                this.currentFrame++;
                this.changeFrame(this.currentColumn,this.currentFrame);
            } else if (this.currentFrame === 4) {
                if (enemy.sprite.y === enemy.neutralY && enemy.currentState !== "reeling" && enemy.currentState !== "left" && enemy.currentState !== "right") {
                    playSound(punchSound2);
                    enemy.currentFrame = 1;
                    enemy.currentColumn = 4;
                    enemy.changeFrame(enemy.currentColumn,enemy.currentFrame);
                    if (enemy.sprite.scale.x > 0) {
                        enemy.flipX();
                    }
                    enemy.currentState = "reeling";
                    enemy.reelTime = enemy.reelMaxTime*2;
                    damage(enemy,30);
                    if (enemy.stunTime > 0) {
                        enemy.stunTime = 0;
                    }
                    this.endedPunch = counter+(this.starPunchSpeed);
                    enemy.lastPunched = counter;
                }
                if (this.starPunchHangTime > 0) {
                    this.starPunchHangTime--
                } else {
                    this.currentFrame++;
                    this.changeFrame(this.currentColumn,this.currentFrame);
                }
            } else {

                this.currentState = "neutral";
                this.beganStarPunch = undefined;

                this.currentFrame = 0;
                this.currentColumn = 0;
                this.starPunchHangTime = 3;
                this.changeFrame(this.currentColumn,this.currentFrame);
                this.starPunches--;
//                if (enemy.currentState === "reeling") {
//                    enemy.currentFrame = 0;
//                    enemy.currentColumn = 0;
//                    enemy.changeFrame(enemy.currentColumn,enemy.currentFrame);
//                    enemy.flipX();
//                    enemy.currentState = "neutral";
//                }

            }

        }
        }

    }
    
    this.reel = function() {
        if (this.currentState !== "reeling") {
            if (player.skin.x !== neutralX || player.skin.y !== neutralY) {
                player.moveTo(neutralX,neutralY);
            }
            this.reelTime = this.reelMaxTime
            this.currentState = "reeling";
            this.currentColumn = 4;
            this.currentFrame = 2;
            this.changeFrame(this.currentColumn,this.currentFrame);
            this.outline.tint = tiredColor2;
            if ((enemy.currentPunch.type === "leftJab" || enemy.currentPunch.type === "leftHook" || enemy.currentPunch.type === "leftUppercut") && player.skin.scale.x > 0) {
                player.flipX();
            }

            this.reelTime--;

        } else {
            if (this.reelTime === this.reelMaxTime-5) {
                this.currentFrame = 3;
                this.outline.tint = tiredColor1;

                this.changeFrame(this.currentColumn,this.currentFrame);
            }
            if (this.reelTime === 5) {
                this.currentFrame = 2;
                this.outline.tint = tiredColor2;

                this.changeFrame(this.currentColumn,this.currentFrame);
            }
            var incrementX = this.reelDistance.x/10;
            var incrementY = this.reelDistance.y/10;
            if (enemy.currentPunch.type === "leftJab" || enemy.currentPunch.type === "rightJab") {
                incrementX /= 2;
                incrementY *= 1.5;
            }
            if (this.reelTime > this.reelMaxTime-6) {
                
                if (this.skin.scale.x < 0) {
                    incrementX *= -1;
                    
                }
                if (this.reelTime === this.reelMaxTime-5) {
                    if (this.health <= 0) {
                        this.reelTime = 1;
                    }
                }
                // console.log("going out moving " + Math.round(incrementX))

            } else if (this.health > 0 && this.reelTime < 6) { // back to center
                
                if (this.skin.scale.x > 0) {
                    incrementX *= -1;
                }
                incrementY *= -1;

                // console.log("coming back moving " + Math.round(incrementX))
            } else {
                incrementX = incrementY = 0;
            } 

            this.move(incrementX,incrementY);
            this.reelTime--;
            if (this.reelTime === 0) {
                if (this.health <= 0) {
                    this.fall();
                    clockRunning = false;
                } else {
                    this.currentState = "neutral";
                    this.currentColumn = 0;
                    this.currentFrame = 0;
                    this.changeFrame(this.currentColumn,this.currentFrame);
                    if (this.skin.scale.x < 0) {
                        this.flipX();
                    }
                    this.outline.tint = macOutlineColor;
                }
                
            }
        }
    }
    this.fall = function() {
        if (this.currentState !== "falling") {
            
            this.currentState = "falling";
            this.currentFrame = 4;
            this.changeFrame(this.currentColumn,this.currentFrame);
            // this.outline.tint = tiredColor2;
            // if ((enemy.currentPunch.type === "leftJab" || enemy.currentPunch.type === "leftHook" || enemy.currentPunch.type === "leftUppercut") && player.skin.scale.x > 0) {
            //     player.flipX();
            // }
            this.knockedOutAt = counter;
        } else {
            var totalDistance = knockoutY-neutralY;
            var sinceKnockout = counter-this.knockedOutAt;
            if (sinceKnockout > 0 && sinceKnockout % 6 === 0) {
                player.flipX();
            }
            if (sinceKnockout === 48) {
                if (buttonPanel) {
                    buttonPanel.container.visible = false;                    
                    getUpButtons.container.visible = true;
                }
                this.hitMatAt = counter;
                this.currentState = "knockedOut";
                this.moveTo(neutralX,knockoutY);
                this.currentFrame = 1;
                this.changeFrame(this.currentColumn,this.currentFrame);
                if (player.skin.scale.x < 0) {
                    player.flipX();
                }
            } else {
                this.move(0,totalDistance/48);
            }
        }
    }
    this.rest = function() {
        if (this.currentState !== "resting") {
            restTime = 300;
            this.currentState = "resting";
            this.currentColumn = 4;
            this.currentFrame = 0;
            this.changeFrame(this.currentColumn,this.currentFrame);
            this.outline.tint = tiredColor1;
        }
        if (restTime > 0) {
            restTime--;
            if (counter % 20 === 0) {
                if (this.currentFrame === 0) {
                    this.currentFrame = 1;
                    this.changeFrame(this.currentColumn,this.currentFrame);
                    this.outline.tint = tiredColor2;
                } else {
                    this.currentFrame = 0;
                    this.changeFrame(this.currentColumn,this.currentFrame);
                    this.outline.tint = tiredColor1;
                }

            }
        } else {
            this.currentState = "neutral";
            this.currentColumn = 0;
            this.currentFrame = 0;
            this.changeFrame(this.currentColumn,this.currentFrame);
            this.outline.tint = macOutlineColor;
        }
    }
    this.duck = function() {
        if (this.currentState === "neutral") {
            this.currentState = "ducking";
            this.beganDuck = counter;
            this.currentColumn = 1;
            this.currentFrame = 4;
            this.changeFrame(this.currentColumn,this.currentFrame);

        }
        if (!pressingX && !pressingDown) {
            this.currentState = "neutral";
            this.currentColumn = 0;
            this.currentFrame = 0;
            this.changeFrame(this.currentColumn,this.currentFrame);

        }
    }
    this.guard = function() {
        if (this.currentState === "neutral") {
            this.currentState = "guarding";
            this.currentColumn = 1;
            this.currentFrame = 3;
            this.changeFrame(this.currentColumn,this.currentFrame);

        }
        if (!pressingS && !holdingGuard) {
            this.currentState = "neutral";
            this.currentColumn = 0;
            this.currentFrame = 0;
            this.changeFrame(this.currentColumn,this.currentFrame);

        }
    }
    this.throwPunch = function(left,high) {
        if (enemy.currentState !== "reeling" && enemy.currentState !== "left" && enemy.currentState !== "right") {
        this.currentState = "punching";
        this.beganPunch = counter;
        if (high) {
            var startingFrame = this.currentFrame = 3;
            this.currentColumn = 0;
            this.currentPunch.high = true;
            this.currentPunch.distance = this.punchDistance*2;
        } else {
            var startingFrame = this.currentFrame = 0;
            this.currentColumn = 2;
            this.currentPunch.distance = this.punchDistance;
        }
        this.changeFrame(this.currentColumn,this.currentFrame);
        if (!left) {
            this.currentPunch.left = false;
            if (this.skin.scale.x > 0) {
                this.flipX();
            }
        }
        if (enemy.currentState === "guarding") {
            this.currentPunch.distance *= 0.8;
        }
        }
    }
    this.punch = function(left,high) {
        if (!this.withdrawing) {
            if (this.currentPunch.high) {
                var startingFrame = 3;
            } else {
                var startingFrame = 0
            }
            var yIncrement = this.currentPunch.distance/(this.punchSpeed*2);
            if ((counter-this.beganPunch) % this.punchSpeed === 0) {
                if (this.currentFrame < startingFrame+2) {
                    if (this.beganPunch !== counter) {
                        this.currentFrame++;
                        this.changeFrame(this.currentColumn,this.currentFrame);
                    }
                } else {
                    this.beganPunch = undefined;
                    this.endedPunch = counter;
                    this.withdrawing = true;
                    console.log(enemy.currentState + " at punch impact")
                    if (enemy.currentState === "guarding") {
                        playSound(blockSound);
                    }
                    if ((enemy.currentState === "windingUp" || enemy.currentState === "neutral" || enemy.currentState === "stunned" || enemy.currentState === "punching")) {
                        
                        playSound(punchSound1);
                        enemy.currentFrame = 1;
                        enemy.currentColumn = 3;
                        if (!player.currentPunch.high) {
                            enemy.currentColumn = 5;
                        } else {
                            // if (enemy.stunTime > 0) {
                            //     enemy.stunTime = Math.floor(enemy.stunTime/2)
                            // }
                        }
                        enemy.changeFrame(enemy.currentColumn,enemy.currentFrame);

                        if (!player.currentPunch.left) {
                            enemy.flipX();
                        }
                        enemy.lastPunched = counter;
                        enemy.currentState = "reeling";
                        enemy.reelTime = enemy.reelMaxTime;
                        
                        damage(enemy,player.currentPunch.power);
                    }
                }
            }

//            if (this.currentFrame === startingFrame+2 && enemy.currentState === "blocking") {
//                yIncrement /= 2;
//            }
            this.move(0,-yIncrement);
        } else {
            var yIncrement = this.currentPunch.distance/(this.punchSpeed);
            this.move(0,yIncrement);
            if (this.skin.y > neutralY) {
                this.moveTo(this.skin.x,neutralY);
            }
            var sinceEnded = counter-this.endedPunch;
            if (this.currentPunch.high) {
                var startingFrame = 3;
            } else {
                var startingFrame = 1
            }
            if (sinceEnded % this.punchSpeed === 0) {
                if (this.currentFrame > startingFrame) {
                    this.currentFrame--;
                    this.changeFrame(this.currentColumn,this.currentFrame);
                } else {
                    this.currentState = "neutral";
                    this.beganPunch = undefined;
                    this.currentFrame = 0;
                    this.currentColumn = 0;
                    this.changeFrame(this.currentColumn,this.currentFrame);
                    if (!this.currentPunch.left && this.skin.scale.x < 0) {
                        this.flipX();
                    }
                    this.currentPunch = {left:true,high:false,distance:this.punchDistance,power:this.basePower};
                    this.withdrawing = false;
//                    if (enemy.currentState === "reeling") {
//                        enemy.currentState = "neutral";
//                        enemy.currentFrame = 0;
//                        enemy.currentColumn = 0;
//                        enemy.changeFrame(enemy.currentColumn,enemy.currentFrame);
//                        if (enemy.sprite.scale.x < 0) {
//                            enemy.flipX();
//                        }
//                    }
                }

            }
        }


    }

    this.dodge = function(direction) {
//        if (this.currentState !== "left" && this.currentState !== "right") {
        if (this.currentState === "neutral") {
            playSound(fwitSound1);

            this.currentState = direction;
            this.beganDodge = counter;
            this.currentFrame = 0;
            this.currentColumn = 1;
            this.changeFrame(this.currentColumn,this.currentFrame);
            if (direction === "right" && this.skin.scale.x > 0) {
                this.flipX();
            }
        } else {

        }
        var sinceDodge = counter-this.beganDodge;
        if (direction === "left") {
            var movePerFrame = this.dodgeDistance/(this.dodgeSpeed/2);
        } else {
            var movePerFrame = -(this.dodgeDistance/(this.dodgeSpeed/2));
        }

        var maxDistance = Math.ceil(this.dodgeSpeed/2);
        var holding = false;

        if (sinceDodge < maxDistance) {
            if (sinceDodge >= Math.ceil(this.dodgeSpeed*0.35) && this.currentFrame === 0) {
                this.currentFrame = 1;
                this.changeFrame(this.currentColumn,this.currentFrame);
                if (direction === "right" && this.skin.scale.x > 0) {
                    this.flipX();
                }
            }
            this.move(-movePerFrame,0);
        }
        if (sinceDodge > maxDistance) {
            if ((pressingA || pressingD || holdingLeft || holdingRight) && this.dodgeHoldTime > 0) {
                this.dodgeHoldTime--;
            } else {
                if (sinceDodge >= Math.ceil(this.dodgeSpeed*0.65) && this.currentFrame === 1) {
                    this.currentFrame = 0;
                    this.changeFrame(this.currentColumn,this.currentFrame);
                    if (direction === "right" && this.skin.scale.x > 0) {
                        this.flipX();
                    }
                }
                this.move(movePerFrame,0);
                if (Math.abs((neutralX)-this.skin.x) < Math.abs(movePerFrame)) {
                    this.moveTo(neutralX,this.skin.y);
                }
            }
        }
        if (this.skin.x === neutralX) {
            this.currentState = "neutral";
            this.currentColumn = 0;
            this.beganDodge = undefined;
            this.dodgeHoldTime = this.dodgeHoldMax;
            this.changeFrame(this.currentColumn,this.currentFrame);
            if (direction === "right") {
                this.flipX();
            }
        }
    }

}
