var board = new Array();
var score = 0;
var hasConflicted = new Array();
//用于判断每个小格子是否发生变化
//游戏初始化
$(document).ready(function(){
    prepareForMobile();
    newgame();
});
function prepareForMobile(){
    if(documentWidth > 500){
        gridContainerWidth = 500;//根据页面自适应界面大小
        cellSpace = 20;
        cellSideLength = 100;
    }
    $('#grid-container').css('width',gridContainerWidth-2*cellSpace);
    $('#grid-container').css('height',gridContainerWidth-2*cellSpace);
    $('#grid-container').css('padding',cellSpace);
    $('#grid-container').css('border-radius',0.02*gridContainerWidth);

    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.02*cellSideLength);
}


function newgame(){
    //初始化棋盘
    init();
    //在随机的两个格子里生成数字
    generateOneNumber();
    generateOneNumber();
    isgameover();
}

function init(){
    for(var i=0; i<4; i++){
        for(var j=0; j<4; j++){
            var gridCell = $('#grid-cell-'+i+'-'+j);
            gridCell.css('top',getPosTop(i,j));
            gridCell.css('left',getPosLeft(i,j));
            //每个方格的位置由这两个函数决定，>>support2048.js
        }
    }

    for(var i = 0;i<4;i++){
        board[i]=new Array();
        hasConflicted[i] = new Array();
        for(var j=0;j<4;j++){
            board[i][j]=0;
            hasConflicted[i][j]= false;
        }
    }
    updateBoardView();
    score = 0;
}

function updateBoardView(){
    $(".number-cell").remove();
    //删除当前所有方格的值
    for(var i=0; i<4; i++){
        for(var j=0; j<4; j++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $('#number-cell-'+i+'-'+j);

            if(board[i][j] == 0){
                theNumberCell.css("width",'0');
                theNumberCell.css("height",'0')
                theNumberCell.css("top",getPosTop(i,j)+cellSideLength/2);
                theNumberCell.css("left",getPosLeft(i,j)+cellSideLength/2);
            }else{

                theNumberCell.css("width",cellSideLength);
                theNumberCell.css("height",cellSideLength);
                theNumberCell.css("top",getPosTop(i,j));
                theNumberCell.css("left",getPosLeft(i,j));
                theNumberCell.css("background-color",getNumberBackgroundColor(board[i][j]));
                theNumberCell.css("color",getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
            hasConflicted[i][j]=false;
            
        }
        
    }
    $('.number-cell').css('line-height',cellSideLength+'px');
    $('.number-cell').css('font-size',0.6*cellSideLength+'px');
}


function generateOneNumber(){
    //判断棋格是否有空间
    if(nospace(board)){
        return false;
    }   
    //随机生成一个位置
    var randx = parseInt( Math.floor(Math.random()*4));
    var randy = parseInt( Math.floor(Math.random()*4));
    //保证在剩最后一个格子的时候不会出现卡顿
    var times=0;
    while(times<30){
        if(board[randx][randy] == 0){
            break;
        }
        randx = parseInt( Math.floor(Math.random()*4));
        randy = parseInt( Math.floor(Math.random()*4));
        times++; 
    }
    if(times>30){
        for(var i=0; i<4; i++){
            for(var j=0; j<4; j++){
                if(board[i][j] == 0){
                    randx = i;
                    randy = j;
                }
            }
        }
    }
    //随机生成一个数字
    var randNumber = Math.random() < 0.5 ? 2:4;
    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumeberWithAnimation(randx,randy,randNumber);
    return true;
}


//游戏逻辑
$(document).keydown(function(event){
    switch(event.keyCode){
        
        case 37://left
        event.preventDefault()
            if(moveLeft()){
                setTimeout("generateOneNumber()",200);
                setTimeout("isgameover()",200);
            }
            break;
        case 38://up
        event.preventDefault()
        if(moveUp()){
            setTimeout("generateOneNumber()",200);
            setTimeout("isgameover()",200);
        }
            break;
        case 39://right
        event.preventDefault()
        if(moveRight()){
            setTimeout("generateOneNumber()",200);
            setTimeout("isgameover()",200);
        }
            break;
        case 40://down
        event.preventDefault()
        if(moveDown()){
            setTimeout("generateOneNumber()",200);
            setTimeout("isgameover()",200);
        }
            break;
        default:
            break;
    }
});

//手机触摸
document.addEventListener('touchstart',function(event){
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});

document.addEventListener('touchmove',function(event){
    event.preventDefault
},{passive:false});//chrome56以上版本必须设置passive：false属性，否则event.preventrDefault没有作用
document.addEventListener('touchend',function(event){
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltax = endx - startx;
    var deltay = endy - starty;

    if(Math.abs(deltax)<0.3*documentWidth && Math.abs(deltay)<0.3*documentWidth){
        return;
    }

    if(Math.abs(deltax)>=Math.abs(deltay)){
        if(deltax<0){
            if(moveLeft()){
                setTimeout("generateOneNumber()",200);
                setTimeout("isgameover()",200)
            }
        }
        else{
            if(moveRight()){
                setTimeout("generateOneNumber()",200);
                setTimeout("isgameover()",200)
            }
        }
    }
    else{
        if(deltay>0){
            if(moveDown()){
                setTimeout("generateOneNumber()",200);
                setTimeout("isgameover()",200)
            }
        }else{
            if(moveUp()){
                setTimeout("generateOneNumber()",200);
                setTimeout("isgameover()",200)
            }
        }
    }
});


function isgameover(){
    if(nospace(board)&&nomove(board)){
        gameOver();
    }
}

function gameOver(){
    alert("Game Over");
}

//--------------------------------上下左右游戏逻辑------------------------------------------------------------

function moveLeft(){
    if(!canMoveleft(board)){
        return false;
    }

    for(var i=0; i<4; i++){
        for(var j=1; j<4; j++){
            if(board[i][j] != 0){
                for(var k=0; k<j; k++){
                    if(board[i][k]==0 && noBlockHorizontal(i,k,j,board)){
                        //move()
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if(board[i][k]==board[i][j] && noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k]){
                        //move()
                        //add()
                        showMoveAnimation(i,j,i,k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updaterScore(score);
                        hasConflicted[i][k]=true;
                        
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}

//moveright
function moveRight(){
    if(!canMoveright(board)){
        return false;
    }

    for(var i=0; i<4; i++){
        for(var j=2; j>=0; j--){
            if(board[i][j] != 0){
                for(var k=3; k>j; k--){
                    if(board[i][k]==0 && noBlockHorizontal(i,j,k,board)){
                        //move()
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    }
                    else if(board[i][k]==board[i][j] && noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k]){
                        //move()
                        //add()
                        showMoveAnimation(i,j,i,k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updaterScore(score);
                        hasConflicted[i][k]=true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}

//moveup
function moveUp(){
    if(!canMoveup(board)){
        return false;
    }
    for(var j=0; j<4; j++){
        for(var i=1; i<4; i++){
            if(board[i][j] != 0){
                for(var k=0; k<i; k++){
                    if(board[k][j]==0 && noBlockupdown(j,k,i,board)){
                        //move()
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    }
                    else if(board[k][j]==board[i][j] && noBlockupdown(j,k,i,board)){
                        //move()
                        //add()
                        showMoveAnimation(i,j,k,j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updaterScore(score);
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}

//movedown
function moveDown(){
    if(!canMovedown(board)){
        return false;
    }
    for(var j=0; j<4; j++){
        for(var i=2; i>=0; i--){
            if(board[i][j] != 0){
                for(var k=3; k>i; k--){
                    if(board[k][j]==0 && noBlockupdown(j,i,k,board)){
                        //move()
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    }
                    else if(board[k][j]==board[i][j] && noBlockupdown(j,i,k,board) && !hasConflicted[k][j]){
                        //move()
                        //add()
                        showMoveAnimation(i,j,k,j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updaterScore[score];
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}