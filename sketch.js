var trex,trex_end, trex_running, trex_collided, PLAY = 1,
  WIN = 0;
  END = 0,
  gameState = PLAY,
  reset, gameOver;
var invisibleGround, groundImage, gameOverImg, resetImg;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;


function preload() {
  trex_running = loadAnimation("../images/trex1.png", "../images/trex3.png", "../images/trex4.png");
  trex_collided = loadImage("../images/trex_collided.png");

  gameOverImg = loadImage("../images/gameOver.png");
  resetImg = loadImage("../images/restart.png");

  groundImage = loadImage("../images/ground2.png");

  cloudImage = loadImage("../images/cloud.png");

  obstacle1 = loadImage("../images/obstacle1.png");
  obstacle2 = loadImage("../images/obstacle2.png");
  obstacle3 = loadImage("../images/obstacle3.png");
  obstacle4 = loadImage("../images/obstacle4.png");
  obstacle5 = loadImage("../images/obstacle5.png");
  obstacle6 = loadImage("../images/obstacle6.png");
}

function setup() {
  createCanvas(displayWidth , 200);

  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;

  trex_end = createSprite(0,0, 20, 50);
  trex_end.addImage("trex_collided",trex_collided);
  trex_end.scale = 0.5;

  invisibleGround = createSprite(5000, 190, 10000000, 10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  gameOver = createSprite(300,40, 10, 10);
  reset = createSprite(300, 80, 10, 10);
  gameOver.addImage("gameOver", gameOverImg);
  gameOver.scale = 0.5;
  reset.addImage("restart", resetImg);
  reset.scale = 0.5;


  score = 0;
}

function draw() {

    console.log(frameCount);
  background(180);

  imageMode(CENTER);
  image(groundImage, 5000, 180, 11500, 10);

    invisibleGround.x === camera.position.x;

  reset.x = camera.position.x;
  gameOver.x = camera.position.x;
  trex_end.x = camera.position.x;
  trex_end.y = 180;
  
  trex_end.y=trex.y-10;

  if (gameState === PLAY) {
    
    trex.visible=true;
    trex_end.visible=false;
    
    gameOver.visible = false;
    reset.visible = false;

     trex.velocityX = (6 + 3 * score / 100);

    if (keyDown("space")&&trex.y>155) {
      trex.velocityY = -12;
    }

    camera.position.x= trex.x;

    spawnClouds();
    spawnObstacles();

    if (trex.isTouching(obstaclesGroup)){
      gameState = END;
    }

    score = score + Math.round(getFrameRate() / 60);

    trex.velocityY = trex.velocityY + 0.8

    trex.collide(invisibleGround);
    
  } else if (gameState === END) {
    gameOver.visible = true;
    reset.visible = true;


    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    trex.visible=false;
    trex_end.visible=true;


    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    if (mousePressedOver(reset)) {
      restart();
    }

  }

  text("Score: " + score, camera.position.x + 450, 50);

if(score===10){
gameState = END;
textSize(25);
fill("white");  
text("Thanks for Bringing me Home :)", camera.position.x-150, camera.position.y-80);
trex.visible=true;
trex_end.visible=false;
trex.velocityX = 0;
gameOver.visible = false;

}

  drawSprites();
}

function spawnClouds() {

  if (frameCount % 60 === 0) {
    var cloud = createSprite(camera.position.x+ 700, 120, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;


    cloud.lifetime = 200;


    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;


    cloudsGroup.add(cloud);
  }

}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(camera.position.x +900, 165, 10, 40);


    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;

    obstaclesGroup.add(obstacle);
  }
}

function restart() {
  trex.x = 50
  gameState = PLAY;

  gameOver.visible = false;
  reset.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.addAnimation("trex");

  score = 0;
}