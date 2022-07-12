const cnv = document.getElementById("breakout");
const ctx = cnv.getContext("2d");
const paddleWidth = 100;
const paddleHeight = 20;
const paddleMarginBottom = 50;
ctx.lineWidth = 3;
let leftArrow;
let rightArrow;
const ballRadius = 8;
let life = 3;
let score = 0;
const score_unit = 10;
let level = 1;
const max_level = 3;
let game_over = false;


//creating a paddle
const paddle = {
  x: cnv.width / 2 - paddleWidth / 2,
  y: cnv.height - paddleMarginBottom - paddleHeight,
  width: paddleWidth,
  height: paddleHeight,
  dx: 5,
};

//drawing a paddle

const drawPaddle = () => {
  ctx.fillStyle = "#2e3548";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.strokeStyle = "#ffcd05";
  ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
};

//moving paddle

document.addEventListener("keydown", (e) => {
  if (e.key == "ArrowLeft") {
    leftArrow = true;
  }
  if (e.key == "ArrowRight") {
    rightArrow = true;
  }
});
document.addEventListener("keyup", (e) => {
  if (e.key == "ArrowLeft") {
    leftArrow = false;
  }
  if (e.key == "ArrowRight") {
    rightArrow = false;
  }
});
const movePaddle = () => {
  if (leftArrow && paddle.x > 0) {
    paddle.x -= paddle.dx;
  }

  if (rightArrow && paddle.x + paddle.width < cnv.width) {
    paddle.x += paddle.dx;
    console.log(paddle.dx);
  }
};

//creating a ball

const ball = {
  x: cnv.width / 2,
  y: paddle.y - paddle.height + ballRadius,
  speed: 4,
  dx: 3 * (Math.random() * 2 - 1),
  dy: -3,
  radius: ballRadius,
};

//drawing ball

const drawBall = () => {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffcd05";
  ctx.fill();
  ctx.strokeStyle = "#2e3548";
  ctx.stroke();
  ctx.closePath();
};

//moving ball

const moveBall = () => {
  ball.x += ball.dx;
  ball.y += ball.dy;
};

//ball and wall collisions

const ballWallCollision = () => {
    
  if (ball.x + ball.radius > cnv.width || ball.x - ball.radius < 0) {
    wallHit.play();
    ball.dx = -ball.dx;
  }
  if (ball.y - ball.radius < 0) {
    wallHit.play();
    ball.dy = -ball.dy;
  }
  if (ball.y + ball.radius > cnv.height) {
    life--;
    resetBall();
  }
};

//resetting the ball

const resetBall = () => {
  ball.x = cnv.width / 2;
  ball.y = paddle.y - paddle.height + ballRadius;
  ball.dx = 3 * (Math.random() * 2 - 1);
  ball.dy = -3;
};

//ball and paddle collisions

const ballPaddleCollision = () => {
  if (
    ball.x < paddle.x + paddle.width &&
    ball.x > paddle.x &&
    ball.y > paddle.y &&
    paddle.y < paddle.y + paddle.height
  ) {
    paddleHit.play();
    let collidePoint = ball.x - (paddle.x + paddle.width / 2); // here we get -paadle.x/2 to paddle.width/2
    collidePoint = collidePoint / (paddle.width / 2); //we want to normalize it to -1 to 1
    let angle = (collidePoint * Math.PI) / 3; // it's a point hit on a paddle times 60 deg
    ball.dy = -ball.speed * Math.cos(angle);
    ball.dx = ball.speed * Math.sin(angle);
    
  }
};

//creating bricks

const brick = {
  row: 3,
  column: 5,
  marginTop: 40,
  width: 55,
  height: 20,
  offsetLeft: 20,
  offsetTop: 20,
  fillColor: "#2e3548",
  strokeColor: "#FFF",
};
//2dimentional array to store x and y position of every brick
//creating bricks
let bricks = [];

const createBricks = () => {
  for (let r = 0; r < brick.row; r++) {
    bricks[r] = [];
    for (let c = 0; c < brick.column; c++) {
      bricks[r][c] = {
        x: c * (brick.offsetLeft + brick.width) + brick.offsetLeft,
        y:
          r * (brick.height + brick.offsetTop) +
          brick.offsetTop +
          brick.marginTop,
          status: true
      };
    }
  }
};

createBricks();

//drawing bricks

const drawBricks = () => {
    for (let r = 0; r < brick.row; r++) {
        for (let c= 0; c < brick.column; c++) {
            //checking if that brick isn't broken, status= true
            if (bricks[r][c].status) {
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(bricks[r][c].x, bricks[r][c].y, brick.width, brick.height);
                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(bricks[r][c].x, bricks[r][c].y, brick.width, brick.height);
            }
        }
    }
}

//ball brick collision

const ballBrickCollision = () => {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c ++) {
            let b = bricks[r][c];
            if (b.status) {
                if (ball.x - ball.radius > b.x 
                    && ball.x - ball.radius < b.x + brick.width
                    && ball.y + ball.radius > b.y
                    && ball.y - ball.radius < b.y + brick.height) {
                        brickHit.play();
                        b.status = false;
                        ball.dy = -ball.dy;
                        score += score_unit
                    }
            }
        }
    }
}

//game stats

const showGameStats = (text, textX, textY, img, imgX, imgY) => {
ctx.fillStyle = '#FFF';
ctx.font = '25px Germania One';
ctx.fillText(text, textX, textY);
ctx.drawImage(img, imgX, imgY, width = 25, height = 25);
}


const draw = () => {
  drawPaddle();
  drawBall();
  drawBricks();
  showGameStats(score, 35, 25, scoreImage, 5, 5);
  showGameStats(life, cnv.width - 25, 25, liveImage, cnv.width - 55, 5);
  showGameStats(level, cnv.width / 2, 25, levelImage, cnv.width / 2 - 30, 5);
};

gameOver = () => {
if (life <= 0) {
    gameOverSound.play();
    lostGame();
    game_over = true;
}
}

const levelUp = () => {
    let levelIsDone = true;
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c ++) {
    levelIsDone = levelIsDone && !bricks[r][c].status;
        }
}
if (levelIsDone) {
    levelUpSound.play();
    if (level >= max_level){
        winGame();
        game_over = true;
        return;
    }
    brick.row ++;
    createBricks();
    ball.speed += .5;
    resetBall();
    level++;
}
}

const update = () => {
  movePaddle();
  moveBall();
  ballWallCollision();
  ballPaddleCollision();
  ballBrickCollision();
  gameOver();
  levelUp();
  //paddle.y -= 30;
};

const loop = () => {
  ctx.drawImage(BGImage, 0, 0);
  draw();
  update();
  if (!game_over ) {
  requestAnimationFrame(loop);
  }
};
loop();

const audioManager = () => {
    let imgSrc = soundElem.getAttribute('src');
    let soundImage = imgSrc == './images/soundon.png' ? './images/soundoff.png' : './images/soundon.png';
    soundElem.setAttribute('src', soundImage);

    wallHit.muted = wallHit.muted? false : true;
    brickHit.muted = brickHit.muted? false : true;
    paddleHit.muted = paddleHit.muted? false : true;
    levelUpSound.muted = levelupSound.muted? false : true;
    winSound.muted = winSound.muted? false : true;
    gameOverSound.muted = gameOverSound.muted? false : true;
}

const soundElem = document.getElementById('sound');
soundElem.addEventListener('click', audioManager)

const gameover = document.getElementById('gameover');
const win = document.getElementById('win');
const lost = document.getElementById('lost');
const restart = document.getElementById('restart');

restart.addEventListener('click', () => {
    location.reload();
})

const winGame = () => {
    gameover.style.display = 'block';
    win.style.display = 'block'
}
const lostGame = () => {
    gameover.style.display = 'block';
    lost.style.display = 'block'
}