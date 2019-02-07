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

let rowsY = 100;
let paddlePlayerX = 0;
let paddlePlayerY = 10;
let ballMoving = false;
let ballRadius = 5;

let level = 0;
let levels = [
  {
    blocksRows : 2,
    blocksHeight : 50,
    blocksWidth : 90,
    blockNumPerRow : 6
  },
  {
    blocksRows : 4,
    blocksHeight : 40,
    blocksWidth : 90,
    blockNumPerRow : 8
  },
  {
    blocksRows : 8,
    blocksHeight : 20,
    blocksWidth : 50,
    blockNumPerRow : 12
  }
]

let blockCollision = [];
let startGame = true;
let lifes = 5;
let gameScore = 0;
let scorePerBlock = 20;
let scoreToWin = 0;
let wonGame = false;
let lostGame = false;

window.onload = () => {
  //getting the canvas
  canvas = document.getElementById('canvasGame');


  //getting 2d context from canvas
  canvasContext = canvas.getContext('2d');

  //setting the interval of refresh for the app
  setInterval(() => {
    moveEverything();
    drawEverything();
  }, second / fps);

  //event listener for the mouse move
  canvas.addEventListener('mousemove', (event) => {
    let mousePos = calculateMousePaddle(event);
    paddlePlayerX = mousePos.x - (paddleWidth / 2);
  });

  //Setting paddle to the bottom of the canvas
  paddlePlayerY = canvas.height - (paddleHeight + paddlePlayerY);

  //determine the first level socore to win
  scoreToWin = (levels[level].blockNumPerRow * levels[level].blocksRows * scorePerBlock);

  //event listener for clicks event
  canvas.addEventListener('click', (event) => {

    //if ball is not moving and the player dosnt win the game
    if (!ballMoving && !wonGame) {
      //the click start the ball at random speed
      let randomNum = Math.floor(Math.random() * 20) - 10;
      ballSpeedX = (randomNum < 3 && randomNum > -3) ? -5 : randomNum;
      ballSpeedY = (ballSpeedY > 0) ? (-1 * ballSpeedY) : ballSpeedY;
      ballMoving = true;
    }

    //if the player wins the game
    if(wonGame){
      restartBall();
      //increase the game level
      level++;
      //reset all flags and variables
      wonGame = false;
      startGame = true;
      blockCollision = [];

      //if level is the last level set lostGame flag to true to reset the game
      if (level == levels.length) {
        lostGame = true;
      }else{
        //else increase the scoreToWin with the new level blocks
        scoreToWin += (levels[level].blockNumPerRow * levels[level].blocksRows * scorePerBlock);
      }
    }

    //if flag lostGame true restart the game
    if(lostGame){
      restartBall();

      //restart the level to 0 and set the score to win to the first level
      level = 0;
      scoreToWin = (levels[level].blockNumPerRow * levels[level].blocksRows * scorePerBlock);

      //reset all the variables and flags
      lostGame = false;
      gameScore = 0;
      lifes = 5;
      startGame = true;
      blockCollision = [];
    }
  });

}

//function to draw the flags in the top left corner
drawLifes = () => {
  let lifeX = 10;
  for (var i = 0; i < lifes; i++) {
    colorGame(lifeX, 10, 5, 10, 'white');
    lifeX+=10;
  }
}

//function to draw the score of the player in the top right corner
drawScore = () => {
  canvasContext.fillStyle = 'white';
  canvasContext.fillText(gameScore,(canvas.width-50),25)
}

//function to detect the movement of the mouse pointer
calculateMousePaddle = (event) => {
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;
  //get the value of the mouse in X axis
  let mouseX = event.clientX - rect.left - root.scrollLeft;
  let positionMouse = {
    x: mouseX,
  };
  return positionMouse;
}

//retart the ball in the game and set the flags
restartBall = () => {
  //if wonGame flag dont rest lifes
  if (!wonGame) {
    lifes--;
  }
  //set flag ballMoving to false to reset the ball near to paddleº
  ballMoving = false;
  //if you finish yout lifes set lostGame to true
  if (lifes == 0) {
    lostGame = true;
  }
}

//function to move everything in the gameº
moveEverything = () => {

  //if ballMoving is true the ball starts moving in the board
  if (ballMoving) {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
  } else {
    //if th ballMoving flag is false the ball stays at the top of the paddle
    ballY = paddlePlayerY - (ballRadius * 2);
    ballX = paddlePlayerX + (paddleWidth / 2);
  }

  //if the ball hits the left and right border of the canvas
  //change the direction of the ball
  if (ballX > (canvas.width - ballRadius)) {
    ballSpeedX = -ballSpeedX;
  } else if (ballX < ballRadius) {
    ballSpeedX = -ballSpeedX;
  }

  let deltaX = 0;

  //if ball hits the bottom border restart the ball
  if (ballY >= (canvas.height - 5)) {
    restartBall();
  } else if (ballY < ballRadius) {
    //if the ball hits the top border change direction of ball
    ballSpeedY = -ballSpeedY;
  } else if ((ballX > paddlePlayerX) && (ballX < (paddlePlayerX + paddleWidth)) && (ballY == (paddlePlayerY - paddleHeight))) {
    //if the ball hits the paddle (posXBall > startXPaddle) and (posXBall < (startXPaddle + paddleXSize)) and (posYBall == (startYPaddle - paddleYSize))
    //change the direction
    ballSpeedY = -ballSpeedY;
    //calculate the deltaY to change the speed when the ball hit the paddle
    let deltaY = ballY - (paddlePlayerY + paddleWidth / 2);
    ballSpeedY = deltaY * 0.20;

    //calculate the deltaX to change the speed when the ball hit the paddle in certain position
    if ((ballX > paddlePlayerX) && (ballX < (paddlePlayerX + paddleWidth/3))) {
      //if the ball hits the left side of the paddle
      calculateBallSpeedX();
    }
    else if ((ballX > (paddlePlayerX + ((paddleWidth/3)*2))) && (ballX < (paddlePlayerX + paddleWidth))) {
      //if the ball hits the right side of the paddle
      calculateBallSpeedX();
    }
  }
}

//function to calculate the deltaX
calculateBallSpeedX = () => {
  ballSpeedX = -ballSpeedX;
  deltaX = ballX - (paddlePlayerX + paddleWidth / 2);
  ballSpeedX = deltaX * 0.20;
}

//function to draw all the game
drawEverything = () => {

  //this line draws the space for the game
  colorGame(0, 0, canvas.width, canvas.height, 'black');

  //if the player won the game show the screen of winner
  if (wonGame) {
    canvasContext.fillStyle = 'white';
    canvasContext.fillText("You won the game",((canvas.width/2)-50),200)
    return
  }
  //if the player lose the game show the screen of losser
  if (lostGame) {
    canvasContext.fillStyle = 'white';
    canvasContext.fillText("You lost the game!!",((canvas.width/2)-50),200)
    return
  }

  //this line draws the paddle
  colorGame(paddlePlayerX, paddlePlayerY, paddleWidth, paddleHeight, 'white');

  //this line draws the ball
  colorBall(ballX, ballY, ballRadius, 'white')

  //this line draws the blocks
  createBlocks();

  //this line draws the lifes
  drawLifes();

  //this line draws the score
  drawScore();

  //check the block collisions
  checkBlockCollision();

}

//create the blocks to destroy
createBlocks = () => {
  //set the variables
  let counter = 0;
  let row = rowsY;

  //canculates the space between the blocks
  let spaceX = ((canvas.width - (levels[level].blocksWidth * levels[level].blockNumPerRow))/(levels[level].blockNumPerRow+2));

  //draws the block depending the row that I want
  for (var x = 0; x < levels[level].blocksRows; x++) {
    for (var i = 0; i < levels[level].blockNumPerRow; i++) {

      //if game started it will only draw the blocks with satatus live true
      if (!startGame) {
        if (blockCollision[counter].live) {
          colorGame(spaceX, row,  levels[level].blocksWidth,  levels[level].blocksHeight, 'white')
        }
      } else {
        //if the game is not started draw all the blocks
        colorGame(spaceX, row,  levels[level].blocksWidth,  levels[level].blocksHeight, 'white')
      }

      //store all the collisions for the blocks
      if (startGame) {
        blockCollision.push({
          top: row,
          right: spaceX + levels[level].blocksWidth,
          bottom: row +  levels[level].blocksHeight,
          left: spaceX,
          live: true
        })
      }

      //make the next space between 2 blocks horizontally
      spaceX += levels[level].blocksWidth + ((canvas.width - (levels[level].blocksWidth * levels[level].blockNumPerRow))/(levels[level].blockNumPerRow+2));
      counter++;
    }

    //make the next space between 2 blocks vertically
    row += levels[level].blocksHeight + 10;
    spaceX = ((canvas.width - (levels[level].blocksWidth * levels[level].blockNumPerRow))/(levels[level].blockNumPerRow+2));
  }

  //set the variable startGame to false
  startGame = false;
}

//verify if the ball collide to a block
checkBlockCollision = () => {
  for (var i = 0; i < blockCollision.length; i++) {
    if (blockCollision[i].live && ballX >= (blockCollision[i].left) && ballX <= blockCollision[i].right && ballY >= blockCollision[i].top && ballY <= blockCollision[i].bottom) {
      //if the ball collide to a block change the game score and the direction of the ballº
      ballSpeedY = -ballSpeedY;
      gameScore += scorePerBlock;
      blockCollision[i].live = false;
      //if the score is equal to the calcul of the score make the wonGame flag true
      if (gameScore == scoreToWin) {
        wonGame = true;
      }
    }
  }
}

//draw the ball in the game
colorBall = (leftX, topY, width, color) => {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(leftX, topY, width, 0, Math.PI * 2, true);
  canvasContext.fill();
}

//funcition to draw all the other components
colorGame = (leftX, topY, width, height, color) => {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(leftX, topY, width, height);
}
