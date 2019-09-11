requestFullscreen = function (ele) {
    if (ele.requestFullscreen) {
        ele.requestFullscreen();
    } else if (ele.webkitRequestFullscreen) {
        ele.webkitRequestFullscreen();
    } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
    } else if (ele.msRequestFullscreen) {
        ele.msRequestFullscreen();
    } else {
        // Fallback
        console.log('Fullscreen API is not supported.');
    }
};
exitFullscreen = function () {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else {
        // Fallback
        console.log('Fullscreen API is not supported.');
    }
};
document.onkeydown = function(event) {
    anyKeyPressedAt = counter;
    if (!playerStarted) {
        
    }

    if (event.keyCode == 16) {
        pressingShift = true;
    };
    if (event.keyCode == 81) {
        if (!pressingQ) {
            pressedQAt = counter;
        };
        pressingQ = true;
    };
    if (event.keyCode == 87 || event.keyCode == 38) {
        if (!pressingW) {
            pressedWAt = counter;
        };
        pressingW = true;
    };
    if (event.keyCode == 69) {
        pressedEAt = counter;
        pressingE = true;
    };
    if (event.keyCode == 83 || event.keyCode == 40) {
        pressedSAt = counter;
        pressingS = true;
    };
    if (event.keyCode == 65 || event.keyCode == 37) {
        if (player.currentState !== "right") {
        pressingA = true;
        pressedAAt = counter;
        };
    };
    if (event.keyCode == 68 || event.keyCode == 39) {
        event.preventDefault();
        if (player.currentState !== "left") {
        pressingD = true;
        pressedDAt = counter;
        }

    };
    if (event.keyCode == 88) {
        pressingX = true;
        pressedXAt = counter;
    };
    if (event.keyCode == 90) {
        pressingZ = true;
        pressedZAt = counter;
    };

    if (event.keyCode == 67) {
        pressingC = true;
    };
    if (event.keyCode == 32) {

        if (!pressingSpace) {
            pressedSpaceAt = counter;            

        };
        pressingSpace = true;
        event.preventDefault();
    };
    if (event.keyCode == 16) {
        pressingLShift = true;
    };
    if (event.keyCode == 17) {
        pressingLCtrl = true;
    };
    if (event.keyCode == 83) {
        pressingS = true;
        pressedSAt = counter;
    };
    if (event.keyCode == 79) {
        pressingO = true;
        pressedOAt = counter;
    };
    if (event.keyCode == 80) {
        pressingP = true;
        pressedPAt = counter;
    };
    if (event.keyCode == 67) {
        pressingC = true;
        pressedCAt = counter;
    };
    if([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
        event.preventDefault();
    }
};

document.onkeyup = function(event) {
    if (event.keyCode == 16) {
        pressingShift = false;
    };
    if (event.keyCode == 87 || event.keyCode == 38) {
        pressingW = false;
    };
    if (event.keyCode == 83 || event.keyCode == 40) {
        pressingS = false;
        releasedS = counter;
    };
    if (event.keyCode == 65 || event.keyCode == 37) { // left
        pressingA = false;
    };
    if (event.keyCode == 68 || event.keyCode == 39) { // right
        event.preventDefault();
        pressingD = false;

    };
    if (event.keyCode == 32) {
        pressingSpace = false;
    };
    if (event.keyCode == 90) {
        pressingZ = false;
    };
    if (event.keyCode == 88) {
        pressingX = false;
    };
    if (event.keyCode == 67) {
        pressingC = false;
    };
    if (event.keyCode == 81) {
        pressingQ = false;
    };
    if (event.keyCode == 69) {
        pressingE = false;
    };
    if (event.keyCode == 16) {
        pressingLShift = false;
    };
    if (event.keyCode == 17) {
        pressingLCtrl = false;
    };
    if (event.keyCode == 83) {
        pressingS = false;
    };
    if (event.keyCode == 79) {
        pressingO = false;
    };
    if (event.keyCode == 80) {
        pressingP = false;
    };
    if (event.keyCode == 67) {
        pressingC = false;
    };
};
titleLogoText2 = "assets/titlelogo2.png";

// document.getElementById('title-screen').onmousedown = function(event) {
//     if (titleScreen.style.opacity == 1) {

    
//     if (!playerStartedAt && event.button === 0) {
//         document.getElementById('start-button').style.opacity = 0.2;
//         document.getElementById('start-button').style.backgroundColor = "transparent";

//         document.getElementById('start-button').innerHTML = "LOADING..."
//         // alert("tap")
//         document.getElementById('title-logo').src = titleLogoText2;
//         document.body.style.backgroundColor = this.style.backgroundColor = "#0496fc"
        
//         document.getElementById('start-message').style.visibility = "visible";
//         // document.getElementById('options-button').style.visibility = "hidden";
//         // document.getElementById('start-button').style.visibility = "hidden";

//         playerStartedAt = counter;
//         dismissTitleScreen(fullscreen);
//         setTimeout(function(){

//             renderGame(gameWidth,gameHeight);
//             gameStarted = true;
//         },200);

//         console.log("CLICK TITLE")
        

//     }

//     }
// }
// document.onmousedown = function(event) {
//     // alert("tapped")
//     if (event.button === 0) {
//         LMBDown = true;
//         clicked = counter;
//     } else if (event.button === 2) {
//         RMBDown = true;
//         rightClicked = counter;
//     }
// }
// document.onmouseup = function(event) {
//     if (event.button === 0) {
//         LMBDown = false;
//         LMBReleased = counter;
//     } else if (event.button === 2) {
//         RMBDown = false;
//         RMBReleased = counter;
//     }
// }

