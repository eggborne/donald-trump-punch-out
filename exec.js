function update() {

//    player.dance(60);
    if (gameStarted) {

    if (player.currentState === "falling") {
        player.fall();
    }
    if (enemy.currentState === "falling") {
        enemy.fall();
    }
    if (player.currentState === "knockedOut") {
        // console.log("mashing " + currentMashSpeed())
        var mashSpeed = currentMashSpeed();
        var distanceToNeutral = knockoutY-neutralY;     
        player.move(0,-(distanceToNeutral/400)*mashSpeed);        
        if (counter % 8 === 0) {
            if (player.currentFrame === 1) {
                player.currentFrame = 0;
            } else {
                player.currentFrame = 1;
            }
            player.changeFrame(player.currentColumn,player.currentFrame);
        }
        if (player.skin.y <= neutralY) {
            player.moveTo(neutralX,neutralY);
            damage(player,-80)
            player.currentState = "neutral";
            player.currentColumn = 0;
            player.currentFrame = 0;
            player.outline.tint = macOutlineColor;
            player.changeFrame(player.currentColumn,player.currentFrame);
            player.recoveredAt = counter;
            fightersReady = counter;
            console.log("recovered at " + player.recoveredAt)
            if (buttonPanel) {
                buttonPanel.container.visible = true;
                getUpButtons.container.visible = false;
                getUpButtons.leftUpArrow.tint = getUpButtons.rightUpArrow.tint = 0xffffff;
            }
        }
    }
    if (enemy.currentState === "knockedOut") {
        if (counter === enemy.hitMatAt+enemy.getUpTime) {
            enemy.getUp();
        }
    } else if (enemy.currentState === "gettingUp") {
        enemy.getUp();
    }

    if ((enemy.sprite.y > enemy.neutralY*0.8 && playerPunched() && player.currentState === "neutral") || player.currentState === "punching" || player.withdrawing) {
        player.punch();  // arguments only used if thrown this frame
    }

    if (pressedAAt === counter && player.currentState === "neutral"|| player.currentState === "left") {
        player.dodge("left");
    }
    if (pressedDAt === counter && player.currentState === "neutral"|| player.currentState === "right") {
        player.dodge("right");
    }
    if (pressedSAt === counter && player.currentState === "neutral"|| player.currentState === "guarding") {
        player.guard();
    }
    if (pressedXAt === counter && player.currentState === "neutral"|| player.currentState === "ducking") {
        player.duck();
    }
    if (pressedQAt === counter && player.currentState === "neutral"|| player.currentState === "starPunching") {
        player.starPunch();
    }
    if (player.stamina === 0 && player.currentState === "neutral"|| player.currentState === "resting") {
        player.rest();
    }
    if (player.currentState === "reeling") {
        player.reel();
    };
    if (player.currentState === "neutral") {
       player.dance(50);
    };
    if ((counter === player.beganPunch+1 && enemy.currentState === "guarding") || enemy.currentState === "blocking") {
        enemy.blockPunch(player.currentPunch.left,player.currentPunch.high);
    }
    if (player.losingHealth) {
        damage(player,enemy.currentPunch.power);
    }
    if (player.gainingHealth) {
        damage(player,-80);
    }
    if (enemy.losingHealth) {
        damage(enemy,player.currentPunch.power);
    }
    if (enemy.gainingHealth) {
        damage(enemy,-80);
    }
    if (enemy.stunTime > 0 && enemy.currentState === "stunned") {
        enemy.stun();
    }
    if (enemy.currentState === "reeling") {
        enemy.reel()
    }
     // console.log("stunTime = " + enemy.stunTime)
    if (((counter === player.beganStarPunch+(player.starPunchSpeed/2.5) || counter === player.beganPunch+1) && enemy.currentState === "evading") || enemy.currentState === "left" || enemy.currentState === "right" || enemy.currentState === "ducking") {
        var duck = false;
        var counterAttack = false;
        if (player.currentState === "starPunching" || player.currentPunch.high) {
            duck = true;
            if (randomInt(3,3) === 3) {
                counterAttack = true;
            }
        }
        enemy.dodge(duck,counterAttack);
    }
    if (clockRunning && player.currentState !== "punching" && player.currentState !== "starPunching" && counter % 30 === 0 && (enemy.currentState === "neutral" || enemy.currentState === "guarding" || enemy.currentState === "evading")) {
        enemy.enterRandomRestState();
    }
    if (enemy.currentState === "windingUp" || pressedSpaceAt === counter || (counter % 60 === 0 && (enemy.currentState === "guarding" || enemy.currentState === "evading") && randomInt(0,5)) && player.currentState !== "knockedOut" && clockRunning && enemy.sprite.y === enemy.neutralY) {
        enemy.windUp(15,enemy.punches[randomInt(0,enemy.punches.length-1)]);
    }
    if (enemy.currentState === "punching") {
        enemy.punch();
    }
    if (enemy.currentState === "guarding" || enemy.currentState === "neutral" || enemy.currentState === "evading") {
        var danceSpeed = 20;
        if (enemy.sprite.x !== enemy.neutralX) {
            enemy.walkToCenter(enemy.sprite.width/48);
            danceSpeed = 4;
        }
        if (enemy.sprite.y !== enemy.tauntY && (player.currentState === "falling" || player.currentState === "knockedOut")) {
            enemy.moveToTauntPosition(enemy.sprite.width/64);
            danceSpeed = 6;
        }    
        if (enemy.sprite.y < enemy.neutralY && clockRunning) {
            enemy.walkToFightPosition(enemy.sprite.width/48);
            danceSpeed = 4;
        }
        enemy.dance(danceSpeed);
    }
    if (secondsLeftInRound === 180) {
        if (counter-ringArrivedOnscreenAt > introLength+30 && mario.sprite.x > mario.actionSpotX && !clockRunning) {
            mario.walkToPosition(mario.sprite.width/20);
        }
        if (mario.landedAt === counter) {
            fightersReady = counter;
        }
    }

    if (player.hitMatAt === counter || enemy.hitMatAt === counter || mario.container.visible) {
        if (!winnerDeclaredAt && mario.sprite.x > mario.actionSpotX && (player.currentState === "knockedOut" || enemy.currentState === "knockedOut")) {
            mario.walkToPosition(mario.sprite.width/20);
        } else if (counter > (fightersReady+120) && clockRunning) {
            if (mario.sprite.x < mario.startingX) {
                mario.walkOffscreen(mario.sprite.width/20);
            }
        } else if (counter >= fightersReady) {
            mario.startFight();
        } else {
            if ((player.currentState === "knockedOut" || enemy.currentState === "knockedOut") && (downCount <= 10)) {
                mario.count();
            } else {
                mario.declareKO();
            }
            
        }
    }

    if (!roundOver && clockRunning) {
        header.countDown();
    }
    
    // if (debugMode) {
         document.getElementById("debug").innerHTML = `E: `+enemy.currentState+`</br>P: `+player.currentState
    // }

    // if (pressedSpaceAt === counter) {

    // }

    renderer.render(stage);

    } else { // if gameStarted
        // if (titleScreen.style.opacity < 1) {
        //     titleScreen.style.opacity = counter/20;
        //     // console.log(titleScreen.style.opacity + "opac")
        // }
        
    }

    // if (counter < playerStartedAt+1000) {
    //         if (counter % 3 === 0) {
    //             // console.log(titleScreen.style.backgroundColor + " col")
    //             if (counter % 6 === 0) {
    //                 titleScreen.style.backgroundColor = "#ffffff";
    //             } else {
    //                 titleScreen.style.backgroundColor = "#0496fc";
    //             }
                
    //         }
    //     }
    
    // if (stage) {
    //     if (playerStartedAt) {
    //         $("#title-screen").animate({bottom: gameHeight},'slow');
    //         // preRoundScreen.container.y -= gameHeight/20;
    //         // ringContainer.y -= gameHeight/20;
    //         $("#game-canvas").animate({top: 0},'slow');
    //     } else if (!ringArrivedOnscreenAt && stage.y > -gameHeight) {
    //         var incrementY = gameHeight/20;
    //         stage.y -= incrementY;
    //         // $("#game-canvas").animate({top: -gameHeight},'slow');
            // if (stage.y <= -gameHeight) {
            //     stage.y = -gameHeight;
            //     ringArrivedOnscreenAt = counter;
            // }

    //     }
        // if (counter-ringArrivedOnscreenAt > 60 && roundScreen.container.y > 0) {
        //     roundScreen.container.y -= gameHeight/20;
        // }

    // } else {
    //     // console.log("no mario yet at " + counter)
    // }
    if (gameStarted && (counter-playerReadyAt > 90) && stage.y > -gameHeight) {
        // stage.y -= (gameHeight/20)
        // if (stage.y <= -gameHeight) {
            stage.y = -gameHeight;
            ringArrivedOnscreenAt = counter;
        // }
        
    }
    // if (counter-ringArrivedOnscreenAt > 60 && roundScreen.container.y > 0) {
    //     roundScreen.container.y -= gameHeight/20;
    // }

    counter++;   
    
    requestAnimationFrame(update)

}
