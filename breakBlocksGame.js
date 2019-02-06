let canvas;
let canvasContext;
let fps = 30;
let second = 1000;
let ballX = 50;
let ballY = 50;
let ballSpeedX = 10;
let ballSpeedY = 5;

let paddleWidth = 100;
let paddleHeight = 10;

let paddlePlayerX = 0;
let paddlePlayerY = 10;

let ballMoving = false;
let ballRadius = 5;

let blockCollision = [];

let startGame = true;

window.onload = () => {
  canvas = document.getElementById('canvasGame');

  paddlePlayerY = canvas.height - (paddleHeight + paddlePlayerY);

  canvasContext = canvas.getContext('2d');
  setInterval(() => {
    moveEverything();
    drawEverything();
  },second/fps);

  canvas.addEventListener('mousemove', (event) => {
    let mousePos = calculateMousePaddle(event);
    paddlePlayerX = mousePos.x - (paddleWidth/2);
  });

  canvas.addEventListener('click', (event) => {
    if (!ballMoving) {
      let randomNum = Math.floor(Math.random() * 20) - 10;
      ballSpeedX = (randomNum < 3 && randomNum > -3)? -5:randomNum;
      ballSpeedY = (ballSpeedY > 0)? (-1*ballSpeedY):ballSpeedY;
      ballMoving = true;
    }
  });

}

calculateMousePaddle = (event) => {
   let rect = canvas.getBoundingClientRect();
   let root = document.documentElement;
   let mouseX = event.clientX - rect.left - root.scrollLeft;
   let mouseY = event.clientY - rect.top - root.scrollTop;
   let positionMouse = {
     x: mouseX,
     y: mouseY
   };
   return positionMouse;
}

restartBall = () => {
  ballMoving = false;
}

moveEverything = () => {

  if (ballMoving) {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
  }else{
    ballY = paddlePlayerY - (ballRadius*2);
    ballX = paddlePlayerX + (paddleWidth/2);
  }

  if(ballX >= (canvas.width-5)){
    ballSpeedX = -ballSpeedX;
  }else if(ballX <= 0){
    ballSpeedX = -ballSpeedX;
  }

  if(ballY >= (canvas.height-5)){
    restartBall();
  }else if(ballY <= 0){
    ballSpeedY = -ballSpeedY;
  }else if((ballX > paddlePlayerX) && (ballX < (paddlePlayerX + paddleWidth)) && (ballY == (paddlePlayerY - paddleHeight))){
    ballSpeedY = -ballSpeedY;
    let deltaY = ballY - (paddlePlayerY + paddleWidth/2);
    ballSpeedY = deltaY * 0.15;
  }
}

drawEverything = () => {


  //this line draws the space for the game
  colorGame(0,0,canvas.width,canvas.height,'black');

  //this line draws the paddle
  colorGame(paddlePlayerX,paddlePlayerY,paddleWidth,paddleHeight,'white');

  //this line draws the ball
  colorBall(ballX,ballY,ballRadius,'white')

  createBlocks();

  checkBlockCollision();

}

createBlocks = () => {
  let blockWidth = (canvas.width / 8)
  let counter = 0;
  for (var i = 5; i <= canvas.width; i+= blockWidth) {
    if (!startGame) {
      if (blockCollision[counter].live) {
        colorGame(i,100,90,40,'white')
      }
    }else{
      colorGame(i,100,90,40,'white')
    }
    if (startGame) {
      blockCollision.push({
        top: 100,
        right: i+blockWidth,
        bottom: 140,
        left: i,
        live: true
      })
    }
    counter++;
    }
    startGame = false;
}

checkBlockCollision = () => {
for (var i = 0; i < blockCollision.length; i++) {
  if(blockCollision[i].live && ballX >= (blockCollision[i].left) && ballX <= blockCollision[i].right && ballY >= blockCollision[i].top && ballY <= blockCollision[i].bottom){
    ballSpeedX = -ballSpeedX;
    ballSpeedY = -ballSpeedY;
    blockCollision[i].live = false;
  }
}
}

colorBall = (leftX,topY,width,color) => {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(leftX,topY,width,0,Math.PI*2,true);
  canvasContext.fill();
}

colorGame = (leftX,topY,width,height,color) =>{
  canvasContext.fillStyle = color;
  canvasContext.fillRect(leftX,topY,width,height);
}
