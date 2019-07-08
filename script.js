console.log("Hello  ")
var boardLength = 8;
var counter = 1;
var boardArray = [];
var directionToGo = [];
var botMode = false;
var demo = false;
var dualBotMode = null;
var botTurn = false;
var singlePlayerMode = false;
var predictorArray = [];
var mode = null;
var player1Name = "AI - Black";
var player2Name = "AI - White";


var blackScore = document.getElementById("black-score");
var whiteScore = document.getElementById("white-score");


///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////                            Player Click
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////


var addTile = function(event) {

    var getX = parseInt(event.target.getAttribute("x-axis"));
    var getY = parseInt(event.target.getAttribute("y-axis"));
    var getSym = counter % 2 === 0 ? "W" : "B"
    var roughtCount = 0;



    if (checkOKtoPlace(getSym, getX, getY)) {
        removePredictionDots();
        var aTile = document.createElement("div");

        if (getSym === "W") {
            aTile.setAttribute("class", "white-tiles");
            boardArray[getY][getX] = getSym;

        } else {
            aTile.setAttribute("class", "black-tiles");
            boardArray[getY][getX] = getSym;
        }
        changeRespectiveTiles(event.target, getSym, getX, getY);
        tilePlaceSound();
        counter++;
        event.target.appendChild(aTile);
        event.target.removeEventListener("click", addTile);
        // event.target.removeEventListener("click", tilePlaceSound);



        ////////////////////////////////////////////////////////////
        ///////////     Do Tiles Counting           ///////////////
        ////////////////////////////////////////////////////////////
        var whiteCount = 0;
        var blackCount = 0;
        for (var i = 0; i < boardLength; i++) {
            for (var j = 0; j < boardLength; j++) {

                if (boardArray[i][j] === "W")
                    whiteCount += 1;
                else if (boardArray[i][j] === "B")
                    blackCount += 1;

            }
        }
        blackScore.innerHTML = blackCount;
        whiteScore.innerHTML = whiteCount;
        ////////////////////////////////////////////////////////


        //check any move left///////////////////////////
        //updated getSym as next sym to play//////////
        getSym = counter % 2 === 0 ? "W" : "B"
        console.log(getSym + "turn");
        for (var y = 0; y < boardLength; y++) {
            for (var x = 0; x < boardLength; x++) {
                if (boardArray[y][x] === null) {
                    if (checkOKtoPlace(getSym, x, y)) {
                        roughtCount++;
                    }
                }

            }
        }
        if (roughtCount > 0) {
            console.log(getSym + "still can");
            glowchange(getSym);
            if (singlePlayerMode) {
                tempStopAllClicks();
            } else {
                predictionDots(getSym);
            }

        } else {
            console.log(getSym + "cannot d");
            stopGlow1();
            stopGlow2();
            botMode = false;
            tempStopAllClicks();
            checkWin();
        }
        ///////////////////////////////////////////////////



        //bot mode on and off
        if (botMode) {

            setTimeout(aiTurn, 3000);
        }

    } else {
        console.log("Invalid Move")
        invalid.play();
    }

}

var predictionDots = function(sym) {
    predictorArray = [];
    for (var y = 0; y < boardLength; y++) {
        for (var x = 0; x < boardLength; x++) {
            if (boardArray[y][x] === null) {
                if (checkOKtoPlace(sym, x, y)) {
                    var createPredictor = document.createElement("div");
                    createPredictor.setAttribute("class", "predictor");
                    createPredictor.setAttribute("x-axis", x);
                    createPredictor.setAttribute("y-axis", y);
                    createPredictor.setAttribute("onclick", "event.stopPropagation()");
                    var id = y * boardLength + x;
                    document.getElementById(id).appendChild(createPredictor);
                    predictorArray.push(id);
                }
            }

        }
    }
}

var removePredictionDots = function(sym) {
    for (var i = 0; i < predictorArray.length; i++) {
        var target = document.getElementById(predictorArray[i]);
        target.removeChild(target.firstChild);
    }
}


var startGlow1 = function() {
    document.getElementById("glow-1").style.visibility = "visible";
}

var startGlow2 = function() {
    document.getElementById("glow-2").style.visibility = "visible";
}

var stopGlow1 = function() {
    document.getElementById("glow-1").style.visibility = "hidden";
}

var stopGlow2 = function() {
    document.getElementById("glow-2").style.visibility = "hidden";
}

//change glow
var glowchange = function(sym) {
    if (sym === "W") {
        stopGlow1();
        startGlow2();
    } else {
        startGlow1();
        stopGlow2();
    }
}

var createBoardArray = function() {
    boardArray = [];
    for (i = 0; i < boardLength; i++) {
        var anArray = [];
        for (j = 0; j < boardLength; j++) {
            anArray.push(null);
        }
        boardArray.push(anArray);
    }
}

var initialize = function() {

    var firstTileId = (boardLength / 2 - 1) * boardLength + (boardLength / 2 - 1);
    var secondTileId = (boardLength / 2) * boardLength + boardLength / 2;
    var aCounter = 0;
    for (var i = (firstTileId); i < (firstTileId + 2); i++) {
        var getSquare = document.getElementById(i);
        var getX = parseInt(getSquare.getAttribute("x-axis"));
        var getY = parseInt(getSquare.getAttribute("y-axis"));
        var aTile = document.createElement("div");

        if (aCounter % 2 === 0) {

            aTile.setAttribute("class", "white-tiles");
            boardArray[getY][getX] = "W"

        } else {
            aTile.setAttribute("class", "black-tiles");
            boardArray[getY][getX] = "B"
        }
        getSquare.appendChild(aTile);
        getSquare.removeEventListener("click", addTile);
        // getSquare.removeEventListener("click", tilePlaceSound);
        aCounter++;
    }
    for (var i = secondTileId; i > secondTileId - 2; i--) {
        var getSquare = document.getElementById(i);
        var getX = getSquare.getAttribute("x-axis");
        var getY = getSquare.getAttribute("y-axis");
        var aTile = document.createElement("div");
        if (aCounter % 2 === 0) {

            aTile.setAttribute("class", "white-tiles");
            boardArray[getY][getX] = "W"

        } else {
            aTile.setAttribute("class", "black-tiles");
            boardArray[getY][getX] = "B"
        }
        getSquare.appendChild(aTile);
        getSquare.removeEventListener("click", addTile);
        // getSquare.removeEventListener("click", tilePlaceSound);
        aCounter++;
    }

}

var checkOKtoPlace = function(sym, x, y) {

    var arr = [checkTopLeft(sym, x, y), checkTop(sym, x, y), checkTopRight(sym, x, y), checkRight(sym, x, y), checkBottomRight(sym, x, y), checkBottom(sym, x, y), checkBottomLeft(sym, x, y), checkLeft(sym, x, y)];
    directionToGo = arr;
    if (arr.includes(true)) {
        return true
    } else {
        return false
    }
}



//check top left
var checkTopLeft = function(sym, x, y) {
    if (x < 2 || y < 2) {
        return false;
    } else {

        if (boardArray[y - 1][x - 1] !== null) {

            if (boardArray[y - 1][x - 1] !== sym) {
                var minCount = Math.min(x, y) + 1;
                for (i = 2; i < minCount; i++) {
                    if (boardArray[y - i][x - i] === sym) {
                        return true
                    } else if (boardArray[y - i][x - i] === null) {
                        return false
                    } else if (boardArray[y - i][x - i] === undefined) {
                        return false
                    }
                }
            } else {
                return false
            }
        } else {
            return false
        }
    }

}
//check top
var checkTop = function(sym, x, y) {
    if (y < 2) {
        return false
    } else {
        if (boardArray[y - 1][x] !== null) {
            if (boardArray[y - 1][x] !== sym) {
                var minCount = y + 1
                for (i = 2; i < minCount; i++) {
                    if (boardArray[y - i][x] === sym) {
                        return true
                    } else if (boardArray[y - i][x] === null) {
                        return false
                    } else if (boardArray[y - i][x] === undefined) {
                        return false
                    }
                }
            } else {
                return false
            }
        } else {
            return false
        }
    }
}
//check top right
var checkTopRight = function(sym, x, y) {
    if (y < 2 || x > (boardLength - 3)) {
        return false
    } else {
        if (boardArray[y - 1][x + 1] !== null) {
            if (boardArray[y - 1][x + 1] !== sym) {
                var minCount = Math.min((boardLength - x - 1), y) + 1;
                for (i = 2; i < minCount; i++) {
                    if (boardArray[y - i][x + i] === sym) {
                        return true
                    } else if (boardArray[y - i][x + i] === null) {
                        return false
                    } else if (boardArray[y - i][x + i] === undefined) {
                        return false
                    }
                }
            } else {
                return false
            }
        } else {
            return false
        }
    }
}
//check right
var checkRight = function(sym, x, y) {
    if (x > (boardLength - 3)) {
        return false
    } else {
        if (boardArray[y][x + 1] !== null) {
            if (boardArray[y][x + 1] !== sym) {
                var minCount = boardLength - x;
                for (i = 2; i < boardLength; i++) {
                    if (boardArray[y][x + i] === sym) {
                        return true
                    } else if (boardArray[y][x + i] === null) {
                        return false
                    } else if (boardArray[y][x + i] === undefined) {
                        return false
                    }
                }
            } else {
                return false
            }
        } else {
            return false
        }
    }
}

//check bottom right
var checkBottomRight = function(sym, x, y) {
    if (x > (boardLength - 3) || y > (boardLength - 3)) {
        return false
    } else {

        if (boardArray[y + 1][x + 1] !== null) {
            if (boardArray[y + 1][x + 1] !== sym) {
                var minCount = Math.min(boardLength - x, boardLength - y);
                for (i = 2; i < minCount; i++) {
                    if (boardArray[y + i][x + i] === sym) {
                        return true
                    } else if (boardArray[y + i][x + i] === null) {
                        return false
                    } else if (boardArray[y + i][x + i] === undefined) {
                        return false
                    }
                }
            } else {
                return false
            }
        } else {
            return false
        }
    }
}
//check bottom
var checkBottom = function(sym, x, y) {
    if (y > (boardLength - 3)) {
        return false
    } else {

        if (boardArray[y + 1][x] !== null) {
            if (boardArray[y + 1][x] !== sym) {
                var minCount = boardLength - y;
                for (i = 2; i < minCount; i++) {
                    if (boardArray[y + i][x] === sym) {
                        return true
                    } else if (boardArray[y + i][x] === null) {
                        return false
                    } else if (boardArray[y + i][x] === undefined) {
                        return false
                    }
                }
            } else {
                return false
            }
        } else {
            return false
        }
    }
}

//check bottom left
var checkBottomLeft = function(sym, x, y) {
    if (y > (boardLength - 3) || x < 2) {
        return false
    } else {
        if (boardArray[y + 1][x - 1] !== null) {
            if (boardArray[y + 1][x - 1] !== sym) {
                var minCount = Math.min(boardLength - y - 1, x) + 1;
                for (i = 2; i < minCount; i++) {
                    if (boardArray[y + i][x - i] === sym) {
                        return true
                    } else if (boardArray[y + i][x - i] === null) {
                        return false
                    } else if (boardArray[y + i][x - i] === undefined) {
                        return false
                    }
                }
            } else {
                return false
            }
        } else {
            return false
        }
    }
}

//check left
var checkLeft = function(sym, x, y) {
    if (x < 2) {
        return false
    } else {
        if (boardArray[y][x - 1] !== null) {
            if (boardArray[y][x - 1] !== sym) {
                var minCount = x + 1;
                for (i = 2; i < minCount; i++) {
                    if (boardArray[y][x - i] === sym) {
                        return true
                    } else if (boardArray[y][x - i] === null) {
                        return false
                    } else if (boardArray[y][x - i] === undefined) {
                        return false
                    }
                }
            } else {
                return false
            }
        } else {
            return false
        }
    }
}

var changeRespectiveTiles = function(target, sym, x, y) {
    var topLeftSettle = false;
    var topSettle = false;
    var topRightSettle = false;
    var rightSettle = false;
    var bottomRightSettle = false;
    var bottomSettle = false;
    var bottomLeftSettle = false;
    var leftSettle = false;

    for (i = 0; i < boardLength; i++) {
        switch (i) {
            case 0:
                if (directionToGo[i]) {
                    while (!topLeftSettle) {
                        if (boardArray[y - 1][x - 1] !== null) {
                            var i = 1;
                            while (boardArray[y - i][x - i] !== sym) {
                                boardArray[y - i][x - i] = sym;
                                if (sym === "W")
                                    document.getElementById(boardLength * (y - i) + (x - i)).firstChild.setAttribute("class", "white-tiles");
                                else
                                    document.getElementById(boardLength * (y - i) + (x - i)).firstChild.setAttribute("class", "black-tiles");
                                i++;
                            }
                            topLeftSettle = true;

                        } else {
                            topLeftSettle = true;
                        }
                    }
                }
                break;
            case 1:
                if (directionToGo[i]) {
                    while (!topSettle) {
                        if (boardArray[y - 1][x] !== null) {
                            var i = 1;
                            while (boardArray[y - i][x] !== sym) {
                                boardArray[y - i][x] = sym;
                                if (sym === "W")
                                    document.getElementById(boardLength * (y - i) + x).firstChild.setAttribute("class", "white-tiles");
                                else
                                    document.getElementById(boardLength * (y - i) + x).firstChild.setAttribute("class", "black-tiles");
                                i++;
                            }
                            topSettle = true;

                        } else {
                            topSettle = true;
                        }
                    }
                }
                break;
            case 2:
                if (directionToGo[i]) {
                    while (!topRightSettle) {
                        if (boardArray[y - 1][x + 1] !== null) {
                            var i = 1;
                            while (boardArray[y - i][x + i] !== sym) {
                                boardArray[y - i][x + i] = sym;
                                if (sym === "W")
                                    document.getElementById(boardLength * (y - i) + (x + i)).firstChild.setAttribute("class", "white-tiles");
                                else
                                    document.getElementById(boardLength * (y - i) + (x + i)).firstChild.setAttribute("class", "black-tiles");
                                i++;
                            }
                            topRightSettle = true;

                        } else {
                            topRightSettle = true;
                        }
                    }

                }
                break;
            case 3:
                if (directionToGo[i]) {
                    while (!rightSettle) {
                        if (boardArray[y][x + 1] !== null) {
                            var i = 1;
                            while (boardArray[y][x + i] !== sym) {
                                boardArray[y][x + i] = sym;
                                if (sym === "W")
                                    document.getElementById(boardLength * y + (x + i)).firstChild.setAttribute("class", "white-tiles");
                                else
                                    document.getElementById(boardLength * y + (x + i)).firstChild.setAttribute("class", "black-tiles");
                                i++;
                            }
                            rightSettle = true;

                        } else {
                            rightSettle = true;
                        }
                    }
                }
                break;
            case 4:
                if (directionToGo[i]) {
                    while (!bottomRightSettle) {
                        if (boardArray[y + 1][x + 1] !== null) {
                            var i = 1;
                            while (boardArray[y + i][x + i] !== sym) {
                                boardArray[y + i][x + i] = sym;
                                if (sym === "W")
                                    document.getElementById(boardLength * (y + i) + (x + i)).firstChild.setAttribute("class", "white-tiles");
                                else
                                    document.getElementById(boardLength * (y + i) + (x + i)).firstChild.setAttribute("class", "black-tiles");
                                i++;
                            }
                            bottomRightSettle = true;

                        } else {
                            bottomRightSettle = true;
                        }
                    }

                }
                break;
            case 5:
                if (directionToGo[i]) {
                    while (!bottomSettle) {
                        if (boardArray[y + 1][x] !== null) {
                            var i = 1;
                            while (boardArray[y + i][x] !== sym) {
                                boardArray[y + i][x] = sym;
                                if (sym === "W")
                                    document.getElementById(boardLength * (y + i) + x).firstChild.setAttribute("class", "white-tiles");
                                else
                                    document.getElementById(boardLength * (y + i) + x).firstChild.setAttribute("class", "black-tiles");
                                i++;
                            }
                            bottomSettle = true;

                        } else {
                            bottomSettle = true;
                        }
                    }

                }
                break;
            case 6:
                if (directionToGo[i]) {

                    while (!bottomLeftSettle) {
                        if (boardArray[y + 1][x - 1] !== null) {
                            var i = 1;
                            while (boardArray[y + i][x - i] !== sym) {
                                boardArray[y + i][x - i] = sym;
                                if (sym === "W")
                                    document.getElementById(boardLength * (y + i) + (x - i)).firstChild.setAttribute("class", "white-tiles");
                                else
                                    document.getElementById(boardLength * (y + i) + (x - i)).firstChild.setAttribute("class", "black-tiles");
                                i++;
                            }
                            bottomLeftSettle = true;

                        } else {
                            bottomLeftSettle = true;
                        }
                    }

                }
                break;
            case 7:
                if (directionToGo[i]) {
                    while (!leftSettle) {
                        if (boardArray[y][x - 1] !== null) {
                            var i = 1;
                            while (boardArray[y][x - i] !== sym) {
                                boardArray[y][x - i] = sym;
                                if (sym === "W")
                                    document.getElementById(boardLength * y + (x - i)).firstChild.setAttribute("class", "white-tiles");
                                else
                                    document.getElementById(boardLength * y + (x - i)).firstChild.setAttribute("class", "black-tiles");
                                i++;
                            }
                            leftSettle = true;

                        } else {
                            leftSettle = true;
                        }
                    }

                }
                break;
        }
    }


}
//////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
//////                AI Mode
///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

var aiTurn = function() {



    if (botMode) {
        var getSym = counter % 2 === 0 ? "W" : "B"
        var objArray = [];
        var maxChanged = 0;
        var getX = null;
        var getY = null;
        var roughtCount = 0;

        ////////////collect all playable square and total changes that it will make,save it in an array of object///////////
        for (var y = 0; y < boardLength; y++) {
            for (var x = 0; x < boardLength; x++) {
                if (boardArray[y][x] === null) {

                    if (checkOKtoPlace(getSym, x, y)) {

                        accumulator(objArray, getSym, x, y);

                    }
                }

            }
        }
        //check which square gives max change
        for (i = 0; i < objArray.length; i++) {
            if (objArray[i].total >= maxChanged) {
                maxChanged = objArray[i].total
            }
        }

        //take x and y axis of max change
        var randomArray = [];
        for (j = 0; j < objArray.length; j++) {
            if (objArray[j].total === maxChanged) {
                randomArray.push(objArray[j]);

            }
        }
        var theOne = randomArray[Math.floor(Math.random() * randomArray.length)];
        getX = theOne["x-axis"];
        getY = theOne["y-axis"];;
        ///////////////////////////////////////////////////////////////////////////////////


        ////////////do the move///////////////////////////////////////////////////
        checkOKtoPlace(getSym, getX, getY);
        var getTarget = document.getElementById(getY * boardLength + getX);
        var aTile = document.createElement("div");
        if (getSym === "W") {
            aTile.setAttribute("class", "white-tiles");
            boardArray[getY][getX] = getSym;

        } else {
            aTile.setAttribute("class", "black-tiles");
            boardArray[getY][getX] = getSym;
        }
        changeRespectiveTiles(getTarget, getSym, getX, getY);
        tilePlaceSound();
        counter++;
        getTarget.appendChild(aTile);
        getTarget.removeEventListener("click", addTile);
        getTarget.removeEventListener("click", tilePlaceSound);
        ////////////////////////////////////////////////////////////////////////////



        /////////////Count whole board and update tiles
        var whiteCount = 0;
        var blackCount = 0;

        for (var i = 0; i < boardLength; i++) {
            for (var j = 0; j < boardLength; j++) {

                if (boardArray[i][j] === "W")
                    whiteCount += 1;
                else if (boardArray[i][j] === "B")
                    blackCount += 1;

            }
        }
        blackScore.innerHTML = blackCount;
        whiteScore.innerHTML = whiteCount;
        ////////////////////////////////////////////////


        /////////Check anymore playable empty square
        getSym = counter % 2 === 0 ? "W" : "B"
        console.log(getSym + "turn");
        for (var y = 0; y < boardLength; y++) {
            for (var x = 0; x < boardLength; x++) {
                if (boardArray[y][x] === null) {
                    if (checkOKtoPlace(getSym, x, y)) {
                        roughtCount++;
                    }
                }

            }
        }

        if (roughtCount > 0) {
            console.log(getSym + "still can");
            glowchange(getSym);
            if (singlePlayerMode) {
                startBackAllClicks();
                predictionDots(getSym);
            }


        } else {
            console.log(getSym + "cannot d");
            stopGlow1();
            stopGlow2();
            botMode = false;
            checkWin();
        }
    } else {
        if (demo) {
            demo = false;
            stopDualBotMode();
        }

    }

}

var stopDualBotMode = function() {
    clearInterval(dualBotMode);
}

var accumulator = function(arr, sym, x, y) {
    var topLeftSettle = false;
    var topSettle = false;
    var topRightSettle = false;
    var rightSettle = false;
    var bottomRightSettle = false;
    var bottomSettle = false;
    var bottomLeftSettle = false;
    var leftSettle = false;
    var totalChanged = 0;

    for (i = 0; i < boardLength; i++) {
        switch (i) {
            case 0:
                if (directionToGo[i]) {
                    while (!topLeftSettle) {
                        if (boardArray[y - 1][x - 1] !== null) {
                            var i = 1;
                            while (boardArray[y - i][x - i] !== sym) {
                                totalChanged++;
                                i++;
                            }
                            topLeftSettle = true;

                        } else {
                            topLeftSettle = true;
                        }
                    }
                }
                break;
            case 1:
                if (directionToGo[i]) {
                    while (!topSettle) {
                        if (boardArray[y - 1][x] !== null) {
                            var i = 1;
                            while (boardArray[y - i][x] !== sym) {
                                totalChanged++;
                                i++;
                            }
                            topSettle = true;

                        } else {
                            topSettle = true;
                        }
                    }
                }
                break;
            case 2:
                if (directionToGo[i]) {
                    while (!topRightSettle) {
                        if (boardArray[y - 1][x + 1] !== null) {
                            var i = 1;
                            while (boardArray[y - i][x + i] !== sym) {
                                totalChanged++;
                                i++;
                            }
                            topRightSettle = true;

                        } else {
                            topRightSettle = true;
                        }
                    }

                }
                break;
            case 3:
                if (directionToGo[i]) {
                    while (!rightSettle) {
                        if (boardArray[y][x + 1] !== null) {
                            var i = 1;
                            while (boardArray[y][x + i] !== sym) {
                                totalChanged++;
                                i++;
                            }
                            rightSettle = true;

                        } else {
                            rightSettle = true;
                        }
                    }
                }
                break;
            case 4:
                if (directionToGo[i]) {
                    while (!bottomRightSettle) {
                        if (boardArray[y + 1][x + 1] !== null) {
                            var i = 1;
                            while (boardArray[y + i][x + i] !== sym) {

                                totalChanged++;
                                i++;
                            }
                            bottomRightSettle = true;

                        } else {
                            bottomRightSettle = true;
                        }
                    }

                }
                break;
            case 5:
                if (directionToGo[i]) {
                    while (!bottomSettle) {
                        if (boardArray[y + 1][x] !== null) {
                            var i = 1;
                            while (boardArray[y + i][x] !== sym) {

                                totalChanged++;
                                i++;
                            }
                            bottomSettle = true;

                        } else {
                            bottomSettle = true;
                        }
                    }

                }
                break;
            case 6:
                if (directionToGo[i]) {
                    while (!bottomLeftSettle) {
                        if (boardArray[y + 1][x - 1] !== null) {
                            var i = 1;
                            while (boardArray[y + i][x - i] !== sym) {
                                totalChanged++;
                                i++;
                            }
                            bottomLeftSettle = true;

                        } else {
                            bottomLeftSettle = true;
                        }
                    }

                }
                break;
            case 7:
                if (directionToGo[i]) {
                    while (!leftSettle) {
                        if (boardArray[y][x - 1] !== null) {
                            var i = 1;
                            while (boardArray[y][x - i] !== sym) {
                                totalChanged++;
                                i++;
                            }
                            leftSettle = true;

                        } else {
                            leftSettle = true;
                        }
                    }

                }
                break;
        }
    }

    arr.push({
        "x-axis": x,
        "y-axis": y,
        total: totalChanged
    });


}


var allBoardInitialisation = function(noclick = false) {
    createBoard();
    var k = 0;
    var getSquares = document.querySelectorAll(".col");
    for (i = 0; i < boardLength; i++) {
        for (j = 0; j < boardLength; j++) {
            getSquares[k].setAttribute("x-axis", j);
            getSquares[k].setAttribute("y-axis", i);
            getSquares[k].setAttribute("id", k);

            if (demo) {
                console.log("no clicking");
            } else {
                getSquares[k].addEventListener("click", addTile);
            }

            // getSquares[k].addEventListener("click", tilePlaceSound)
            k++;
        }
    }
    createBoardArray();
    initialize();
    document.querySelector(".score-container").style.visibility = "visible";

    if (demo) {
        dualBotMode = setInterval(aiTurn, 3000);
        botMode = true;
    }
}

var tilePlaceSound = function() {
    place.play();
}

var createBoard = function() {
    var container = document.querySelector(".main-container");
    var boardContainer = document.createElement("div");
    boardContainer.setAttribute("class", "main-board");
    var boardFrame = document.createElement("div");
    boardFrame.setAttribute("class", "board-frame");

    var squareColorCounter = 0;

    for (var i = 0; i < boardLength; i++) {
        var row = document.createElement("div");
        row.setAttribute("class", "row");
        squareColorCounter++;
        for (var j = 0; j < boardLength; j++) {
            var square = document.createElement("div")
            square.setAttribute("class", "col square")
            if (squareColorCounter % 2 === 1) {
                square.style.backgroundColor = "#86B50F";
            }
            squareColorCounter++;
            row.appendChild(square);
        }
        boardContainer.appendChild(row);
    }
    boardFrame.appendChild(boardContainer);
    container.appendChild(boardFrame);


}



var askPlayerInfoContainer = function(mode) {
    var mainPageContainer = document.querySelector(".main-page-container")

    var player1 = document.createElement("div");
    player1.innerHTML = "Player 1";
    player1.setAttribute("class", "name main-player");

    var player1Input = document.createElement("input");
    player1Input.setAttribute("type", "text");
    player1Input.setAttribute("id", "player-1-input");

    var playerInputContainer = document.createElement("div");
    playerInputContainer.setAttribute("class", "player-input-container");
    playerInputContainer.appendChild(player1);
    playerInputContainer.appendChild(player1Input);

    mainPageContainer.appendChild(playerInputContainer);



    if (mode === "2") {
        var player2 = document.createElement("div");
        player2.innerHTML = "Player 2";
        player2.setAttribute("class", "name main-player player2");

        var player2Input = document.createElement("input");
        player2Input.setAttribute("type", "text");
        player2Input.setAttribute("id", "player-2-input");

        var playerInputContainer2 = document.createElement("div");
        playerInputContainer2.setAttribute("class", "player-input-container");
        playerInputContainer2.appendChild(player2);
        playerInputContainer2.appendChild(player2Input);

        mainPageContainer.appendChild(playerInputContainer2);

    }

    var startGameButton = document.createElement("div");
    startGameButton.setAttribute("class", "selections");
    startGameButton.setAttribute("onmousedown", "beep.play()");
    startGameButton.setAttribute("id", "start-game");
    startGameButton.innerHTML = "Start Game";
    startGameButton.addEventListener("click", preStartGame(mode));
    mainPageContainer.appendChild(startGameButton);
}

var clearMainPageContainer = function() {
    var mainPageContainer = document.querySelector(".main-page-container")
    while (mainPageContainer.firstChild) {
        mainPageContainer.removeChild(mainPageContainer.firstChild);

    }
}

var removeMainPageContainer = function() {
    var mainContainer = document.querySelector(".main-container")
    while (mainContainer.firstChild) {
        mainContainer.removeChild(mainContainer.firstChild);
    }
}

var preStartGame = function(mode) {

    return function() {
        takeOffShroud();
        if (mode === "single") {
            singlePlayerMode = true;

            var takeName1 = document.getElementById("player-1-input").value;

            if (takeName1 === "") {
                document.getElementById("player-name").innerHTML = "Guest-1"
                player1Name = "Guest-1";
            } else {
                document.getElementById("player-name").innerHTML = takeName1;
                player1Name = takeName1;
            }
            botMode = true;
            removeMainPageContainer();
            allBoardInitialisation();
            var getSym = counter % 2 === 0 ? "W" : "B"
            startGlow1();
            stopGlow2();
            predictionDots(getSym);
        } else if (mode === "2") {

            var takeName1 = document.getElementById("player-1-input").value;
            var takeName2 = document.getElementById("player-2-input").value;

            if (takeName1 === "") {
                document.getElementById("player-name").innerHTML = "Guest-1"
                player1Name = "Guest-1";
            } else {
                document.getElementById("player-name").innerHTML = takeName1;
                player1Name = takeName1;
            }

            if (takeName2 === "") {
                document.getElementById("bot-name").innerHTML = "Guest-2";
                player2Name = "Guest-2";
            } else {
                document.getElementById("bot-name").innerHTML = takeName2;
                player2Name = takeName2;
            }
            removeMainPageContainer();
            allBoardInitialisation();
            startGlow1();
            stopGlow2();
            var getSym = counter % 2 === 0 ? "W" : "B"
            predictionDots(getSym);
        } else if (mode === "demo") {
            demo = true;
            removeMainPageContainer();
            allBoardInitialisation();
            startGlow1();
            stopGlow2();
        }
    }
}

var tempStopAllClicks = function() {
    for (var y = 0; y < boardLength; y++) {
        for (var x = 0; x < boardLength; x++) {
            if (boardArray[y][x] === null) {
                document.getElementById(y * boardLength + x).removeEventListener("click", addTile);
            }

        }
    }
}

var startBackAllClicks = function() {
    for (var y = 0; y < boardLength; y++) {
        for (var x = 0; x < boardLength; x++) {
            if (boardArray[y][x] === null) {
                document.getElementById(y * boardLength + x).addEventListener("click", addTile);
            }

        }
    }

}

var checkWin = function() {
    var getWinDisplay = document.querySelector(".win-lose-draw");
    var getDarkShroud = document.querySelector(".dark-shroud");
    var getResultContainer = document.querySelector(".resultContainer");

    if (parseInt(blackScore.innerHTML) > parseInt(whiteScore.innerHTML)) {

        getWinDisplay.innerHTML = `${player1Name} Win!`;
        getDarkShroud.style.visibility = "visible";
        // getWinDisplay.style.animation = "fadein 2s";

    } else if (parseInt(blackScore.innerHTML) === parseInt(whiteScore.innerHTML)) {

        getWinDisplay.innerHTML = "It is a Draw!!";
        getDarkShroud.style.visibility = "visible";
        // getWinDisplay.style.animation = "fadein 2s";
        // getResultContainer.style.animation ="fadein 2s 2s forwards";
    } else if (parseInt(blackScore.innerHTML) < parseInt(whiteScore.innerHTML)) {

        getWinDisplay.innerHTML = `${player2Name} Win!`;
        getDarkShroud.style.visibility = "visible";
        // getWinDisplay.style.animation = "fadein 2s";
        // getResultContainer.style.animation ="fadein 2s 2s forwards";
    }
}

var takeOffShroud = function() {
    document.querySelector(".dark-shroud").style.visibility = "hidden";
}


////////////////////////////////////////////////////////////////////////////////////////
//////////////////////                                      //////////////////////
//////////////////////    DOCUMENT ON LOAD                    //////////////////////
//////////////////////                                             //////////////////////
////////////////////////////////////////////////////////////////////////////////////////

var restart = function() {
    takeOffShroud();
    var mainContainer = document.querySelector(".main-container");
    while (mainContainer.firstChild) {
        mainContainer.removeChild(mainContainer.firstChild);
    }
    allBoardInitialisation();
    counter = 1;
    var getSym = counter % 2 === 0 ? "W" : "B"
    blackScore.innerHTML = "2";
    whiteScore.innerHTML = "2";
    if (mode === "single") {
        botMode = true;
        var getSym = counter % 2 === 0 ? "W" : "B";

        allBoardInitialisation();
        predictionDots(getSym);
    } else if (mode === "2") {
        var getSym = counter % 2 === 0 ? "W" : "B";

        allBoardInitialisation();
        predictionDots(getSym);

    } else {
        botMode = true;
        demo = true;

        allBoardInitialisation();
    }


}

var initAllBackToMainPage = function() {
    takeOffShroud();
    stopGlow1();
    stopGlow2();

    var mainContainer = document.querySelector(".main-container");
    while (mainContainer.firstChild) {
        mainContainer.removeChild(mainContainer.firstChild);
    }

    botMode = false;
    demo = false;
    counter = 1;
    document.querySelector(".score-container").style.visibility = "hidden";
    blackScore.innerHTML = "2";
    whiteScore.innerHTML = "2";

    var mainPageContainer = document.createElement("div");
    mainPageContainer.setAttribute("class", "main-page-container");
    var button1 = document.createElement("button");
    button1.setAttribute("class", "selections");
    button1.setAttribute("onmousedown", "beep.play()");
    button1.setAttribute("id", "single-player");
    button1.innerHTML = "Single Player";

    var button2 = document.createElement("button");
    button2.setAttribute("class", "selections");
    button2.setAttribute("onmousedown", "beep.play()");
    button2.setAttribute("id", "2-players");
    button2.innerHTML = "2 Players";

    var button3 = document.createElement("button");
    button3.setAttribute("class", "selections");
    button3.setAttribute("onmousedown", "beep.play()");
    button3.setAttribute("id", "demo");
    button3.innerHTML = "Demo";

    mainPageContainer.appendChild(button1);
    mainPageContainer.appendChild(button2);
    mainPageContainer.appendChild(button3);

    mainContainer.appendChild(mainPageContainer);


    document.getElementById("single-player").addEventListener("click", function() {
        clearMainPageContainer();
        mode = "single"
        askPlayerInfoContainer(mode);

    })

    document.getElementById("2-players").addEventListener("click", function() {
        clearMainPageContainer();
        mode = "2"
        askPlayerInfoContainer(mode);
    })

    document.getElementById("demo").addEventListener("click", function() {
        clearMainPageContainer();
        mode = "demo";
        setTimeout(preStartGame(mode), 100);
    })
}

document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("single-player").addEventListener("click", function() {
        clearMainPageContainer();
        mode = "single"
        askPlayerInfoContainer(mode);

    })

    document.getElementById("2-players").addEventListener("click", function() {
        clearMainPageContainer();
        mode = "2"
        askPlayerInfoContainer(mode);
    })

    document.getElementById("demo").addEventListener("click", function() {
        clearMainPageContainer();
        mode = "demo";
        setTimeout(preStartGame(mode), 100);
    })



})