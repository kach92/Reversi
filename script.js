console.log("Hello  ")
var boardLength = 8;
var counter = 0;
var boardArray = [];
var directionToGo = [];


var blackScore = document.getElementById("black-score");
var whiteScore = document.getElementById("white-score");

var addTile = function(event){

    var getX = parseInt(event.target.getAttribute("x-axis"));
    var getY = parseInt(event.target.getAttribute("y-axis"));
    var getSym = counter%2===0? "W":"B"

    if(checkOKtoPlace(getSym,getX,getY)){
        var aTile = document.createElement("div");
        aTile.setAttribute("class","tiles");

        if(getSym === "W"){
            aTile.style.backgroundColor="white";
            boardArray[getY][getX] = getSym;

         }else{
            aTile.style.backgroundColor="black";
            boardArray[getY][getX] = getSym;
         }
         changeRespectiveTiles(event.target,getSym,getX,getY);

        counter++;
        event.target.appendChild(aTile);
        event.target.removeEventListener("click",addTile);
    }
    else{
        console.log("Invalid Move")
    }
    var whiteCount = 0;
    var blackCount = 0;
    for(var i=0;i<boardLength;i++){
        for(var j=0;j<boardLength;j++){
            if(boardArray[i][j] === "W")
                whiteCount += 1;
            else if(boardArray[i][j] === "B")
                blackCount +=1;

        }
    }

    blackScore.innerHTML = blackCount;
    whiteScore.innerHTML = whiteCount;

}


var createBoardArray = function(){
    boardArray = [];
    for(i=0;i<boardLength;i++){
        var anArray = [];
        for(j=0;j<boardLength;j++){
            anArray.push(null);
        }
        boardArray.push(anArray);
    }
}

var initialize = function(){

    var firstTileId = (boardLength/2-1)*boardLength+(boardLength/2-1);
    var secondTileId = (boardLength/2)*boardLength+boardLength/2;
    var aCounter = 0;
    for(var i=(firstTileId);i<(firstTileId+2);i++){
        var getSquare = document.getElementById(i);
        var getX = parseInt(getSquare.getAttribute("x-axis"));
        var getY = parseInt(getSquare.getAttribute("y-axis"));
        var aTile = document.createElement("div");
        aTile.setAttribute("class","tiles");
        if(aCounter%2===0){

            aTile.style.backgroundColor = "white";
            boardArray[getY][getX]="W"

        }else{
            aTile.style.backgroundColor = "black";
            boardArray[getY][getX]="B"
        }
        getSquare.appendChild(aTile);
        getSquare.removeEventListener("click",addTile);
        aCounter++;
    }
    for(var i=secondTileId;i>secondTileId-2;i--){
        var getSquare = document.getElementById(i);
        var getX = getSquare.getAttribute("x-axis");
        var getY = getSquare.getAttribute("y-axis");
        var aTile = document.createElement("div");
        aTile.setAttribute("class","tiles");
        if(aCounter%2===0){

            aTile.style.backgroundColor = "white";
            boardArray[getY][getX]="W"

        }else{
            aTile.style.backgroundColor = "black";
            boardArray[getY][getX]="B"
        }
        getSquare.appendChild(aTile);
        getSquare.removeEventListener("click",addTile);
        aCounter++;
    }

}

var checkOKtoPlace = function(sym,x,y){

    var arr = [checkTopLeft(sym,x,y),checkTop(sym,x,y),checkTopRight(sym,x,y),checkRight(sym,x,y),checkBottomRight(sym,x,y),checkBottom(sym,x,y),checkBottomLeft(sym,x,y),checkLeft(sym,x,y)];
    directionToGo = arr;
    if(arr.includes(true)){
        return true
    }else{
        return false
    }
}




//check top left
var checkTopLeft = function(sym,x,y){
    if(x<2||y<2){
        return false;
    }else{
        if(boardArray[y-1][x-1]!==null){
            if(boardArray[y-1][x-1]!==sym){
                var minCount = Math.min(x,y)+1;
                for(i=2;i<minCount;i++){
                    if(boardArray[y-i][x-i]===sym){
                        return true
                    }else if(boardArray[y-i][x-i]===null){
                        return false
                    }else if(boardArray[y-i][x-i]===undefined){
                        return false
                    }
                }
            }else{
                return false
            }
        }else{
            return false
        }
    }

}
//check top
var checkTop = function(sym,x,y){
    if(y<2){
        return false
    }else{
        if(boardArray[y-1][x]!==null){
            if(boardArray[y-1][x]!==sym){
                var minCount = y+1
                for(i=2;i<minCount;i++){
                    if(boardArray[y-i][x]===sym){
                        return true
                    }else if(boardArray[y-i][x]===null){
                        return false
                    }else if(boardArray[y-i][x]===undefined){
                        return false
                    }
                }
            }else{
                return false
            }
        }else{
            return false
        }
    }
}
    //check top right
var checkTopRight = function(sym,x,y){
    if(y<2||x>(boardLength-3)){
        return false
    }else{
        if(boardArray[y-1][x+1]!==null){
            if(boardArray[y-1][x+1]!==sym){
                var minCount = Math.min((boardLength-x-1),y)+1;
                for(i=2;i<minCount;i++){
                    if(boardArray[y-i][x+i]===sym){
                        return true
                    }else if(boardArray[y-i][x+i]===null){
                        return false
                    }else if(boardArray[y-i][x+i]===undefined){
                        return false
                    }
                }
            }else{
                return false
            }
        }else{
            return false
        }
    }
}
//check right
var checkRight = function(sym,x,y){
    if(x>(boardLength-3)){
        return false
    }else{
        if(boardArray[y][x+1]!==null){
            if(boardArray[y][x+1]!==sym){
                var minCount = boardLength-x;
                for(i=2;i<boardLength;i++){
                    if(boardArray[y][x+i]===sym){
                        return true
                    }else if(boardArray[y][x+i]===null){
                        return false
                    }else if(boardArray[y][x+i]===undefined){
                        return false
                    }
                }
            }else{
                return false
            }
        }else{
            return false
        }
    }
}

//check bottom right
var checkBottomRight = function(sym,x,y){
    if(x>(boardLength-3)||y > (boardLength-3)){
        return false
    }else{

        if(boardArray[y+1][x+1]!==null){
            if(boardArray[y+1][x+1]!==sym){
                var minCount = Math.min(boardLength-x,boardLength-y);
                for(i=2;i<minCount;i++){
                    if(boardArray[y+i][x+i]===sym){
                        return true
                    }else if(boardArray[y+i][x+i]===null){
                        return false
                    }else if(boardArray[y+i][x+i]===undefined){
                        return false
                    }
                }
            }else{
                return false
            }
        }else{
            return false
        }
    }
}
//check bottom
var checkBottom = function(sym,x,y){
     if(y > (boardLength-3)){
        return false
    }else{

        if(boardArray[y+1][x]!==null){
            if(boardArray[y+1][x]!==sym){
                var minCount = boardLength-y;
                for(i=2;i<minCount;i++){
                    if(boardArray[y+i][x]===sym){
                        return true
                    }else if(boardArray[y+i][x]===null){
                        return false
                    }else if(boardArray[y+i][x]===undefined){
                        return false
                    }
                }
            }else{
                return false
            }
        }else{
            return false
        }
    }
}

//check bottom left
var checkBottomLeft = function(sym,x,y){
    if(y > (boardLength-3) || x<2){
        return false
    }else{
        if(boardArray[y+1][x-1]!==null){
            if(boardArray[y+1][x-1]!==sym){
                var minCount = Math.min(boardLength-y-1,x)+1;
                for(i=2;i<minCount;i++){
                    if(boardArray[y+i][x-i]===sym){
                        return true
                    }else if(boardArray[y+i][x-i]===null){
                        return false
                    }else if(boardArray[y+i][x-i]===undefined){
                        return false
                    }
                }
            }else{
                return false
            }
        }else{
            return false
        }
    }
}

//check left
var checkLeft = function(sym,x,y){
    if(x<2){
        return false
    }else{
        if(boardArray[y][x-1]!==null && boardArray[y][x-1]!== undefined){
            if(boardArray[y][x-1]!==sym){
                var minCount =x+1;
                for(i=2;i<minCount;i++){
                    if(boardArray[y][x-i]===sym){
                        return true
                    }else if(boardArray[y][x-i]===null){
                        return false
                    }else if(boardArray[y][x-i]===undefined){
                        return false
                    }
                }
            }else{
                return false
            }
        }else{
            return false
        }
    }
}

var changeRespectiveTiles = function(target,sym,x,y){
    var topLeftSettle = false;
    var topSettle = false;
    var topRightSettle = false;
    var rightSettle = false;
    var bottomRightSettle = false;
    var bottomSettle = false;
    var bottomLeftSettle = false;
    var leftSettle = false;

    for(i=0;i<boardLength;i++){
        switch (i){
            case 0:
                if(directionToGo[i]){
                    while(!topLeftSettle){
                        if(boardArray[y-1][x-1]!==null){
                            var i=1;
                            while(boardArray[y-i][x-i]!==sym){
                                boardArray[y-i][x-i]=sym;
                                if(sym === "W")
                                    document.getElementById(boardLength*(y-i)+(x-i)).firstChild.style.backgroundColor = "white";
                                else
                                    document.getElementById(boardLength*(y-i)+(x-i)).firstChild.style.backgroundColor = "black";
                                i++;
                            }
                            topLeftSettle = true;

                        }else{
                            topLeftSettle = true;
                        }
                    }
                }
                break;
            case 1:
                if(directionToGo[i]){
                    while(!topSettle){
                        if(boardArray[y-1][x]!==null){
                            var i=1;
                            while(boardArray[y-i][x]!==sym){
                                boardArray[y-i][x]=sym;
                                if(sym === "W")
                                    document.getElementById(boardLength*(y-i)+x).firstChild.style.backgroundColor = "white";
                                else
                                    document.getElementById(boardLength*(y-i)+x).firstChild.style.backgroundColor = "black";
                                i++;
                            }
                            topSettle = true;

                        }else{
                            topSettle = true;
                        }
                    }
                }
                break;
            case 2:
                if(directionToGo[i]){
                    while(!topRightSettle){
                        if(boardArray[y-1][x+1]!==null){
                            var i=1;
                            while(boardArray[y-i][x+i]!==sym){
                                boardArray[y-i][x+i]=sym;
                                if(sym === "W")
                                    document.getElementById(boardLength*(y-i)+(x+i)).firstChild.style.backgroundColor = "white";
                                else
                                    document.getElementById(boardLength*(y-i)+(x+i)).firstChild.style.backgroundColor = "black";
                                i++;
                            }
                            topRightSettle = true;

                        }else{
                            topRightSettle = true;
                        }
                    }

                }
                break;
            case 3:
                if(directionToGo[i]){
                     while(!rightSettle){
                        if(boardArray[y][x+1]!==null){
                            var i=1;
                            while(boardArray[y][x+i]!==sym){
                                boardArray[y][x+i]=sym;
                                if(sym === "W")
                                    document.getElementById(boardLength*y+(x+i)).firstChild.style.backgroundColor = "white";
                                else
                                    document.getElementById(boardLength*y+(x+i)).firstChild.style.backgroundColor = "black";
                                i++;
                            }
                            rightSettle = true;

                        }else{
                            rightSettle = true;
                        }
                    }
                }
                break;
            case 4:
                if(directionToGo[i]){
                    while(!bottomRightSettle){
                        if(boardArray[y+1][x+1]!==null){
                            var i=1;
                            while(boardArray[y+i][x+i]!==sym){
                                boardArray[y+i][x+i]=sym;
                                if(sym === "W")
                                    document.getElementById(boardLength*(y+i)+(x+i)).firstChild.style.backgroundColor = "white";
                                else
                                    document.getElementById(boardLength*(y+i)+(x+i)).firstChild.style.backgroundColor = "black";
                                i++;
                            }
                            bottomRightSettle = true;

                        }else{
                            bottomRightSettle = true;
                        }
                    }

                }
                break;
            case 5:
                if(directionToGo[i]){
                    while(!bottomSettle){
                        if(boardArray[y+1][x]!==null){
                            var i=1;
                            while(boardArray[y+i][x]!==sym){
                                boardArray[y+i][x]=sym;
                                if(sym === "W")
                                    document.getElementById(boardLength*(y+i)+x).firstChild.style.backgroundColor = "white";
                                else
                                    document.getElementById(boardLength*(y+i)+x).firstChild.style.backgroundColor = "black";
                                i++;
                            }
                            bottomSettle = true;

                        }else{
                            bottomSettle = true;
                        }
                    }

                }
                break;
            case 6:
                if(directionToGo[i]){
                    while(!bottomLeftSettle){
                        if(boardArray[y+1][x-1]!==null){
                            var i=1;
                            while(boardArray[y+i][x-i]!==sym){
                                boardArray[y+i][x-i]=sym;
                                if(sym === "W")
                                    document.getElementById(boardLength*(y+i)+(x-i)).firstChild.style.backgroundColor = "white";
                                else
                                    document.getElementById(boardLength*(y+i)+(x-i)).firstChild.style.backgroundColor = "black";
                                i++;
                            }
                            bottomLeftSettle = true;

                        }else{
                            bottomLeftSettle = true;
                        }
                    }

                }
                break;
            case 7:
                if(directionToGo[i]){
                    while(!leftSettle){
                        if(boardArray[y][x-1]!==null){
                            var i=1;
                            while(boardArray[y][x-i]!==sym){
                                boardArray[y][x-i]=sym;
                                if(sym === "W")
                                    document.getElementById(boardLength*y+(x-i)).firstChild.style.backgroundColor = "white";
                                else
                                    document.getElementById(boardLength*y+(x-i)).firstChild.style.backgroundColor = "black";
                                i++;
                            }
                            leftSettle = true;

                        }else{
                            leftSettle = true;
                        }
                    }

                }
                break;
        }
    }


}



var drawCheck = function(){
    var nullCount = 0;
    for(i=0;i<boardLength;i++){
        for(j=0;j<boardLength;j++){
            if(boardArray[i][j]){
                //check top left
                if(boardArray[i-1][j-1]===null){

                }
                //check top
                else if(boardArray[i-1][j]===null){

                }
                //check top right
                else if(boardArray[i-1][j+1]===null){

                }
                //check right
                else if(boardArray[i][j+1]===null){

                }
                //check bottom right
                else if(boardArray[i+1][j+1]===null){

                }
                //check bottom
                else if(boardArray[i+1][j]===null){

                }
                //check bottom left
                else if(boardArray[i+1][j-1]===null){

                }
                //check left
                else if(boardArray[i][j-1]===null){

                }

            }
        }
    }
}



document.addEventListener("DOMContentLoaded",function(){
    createBoard();
    var k = 0;
    var getSquares = document.querySelectorAll(".col");
    for(i=0;i<boardLength;i++){
        for(j=0;j<boardLength;j++){
            getSquares[k].setAttribute("x-axis",j);
            getSquares[k].setAttribute("y-axis",i);
            getSquares[k].setAttribute("id",k);
            getSquares[k].addEventListener("click",addTile)
            k++;
        }
    }
    createBoardArray();
    initialize();

})

var createBoard = function(){
    var container = document.querySelector(".main-container");

    for(var i=0;i<boardLength;i++){
        var row = document.createElement("div");
        row.setAttribute("class","row");
        for(var j=0;j<boardLength;j++){
            var square = document.createElement("div")
            square.setAttribute("class","col square")
            row.appendChild(square);
        }
        container.appendChild(row);
    }



}








