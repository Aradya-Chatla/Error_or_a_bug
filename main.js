var PLAY = 1;
var END = 0;
var gameState = PLAY;

var dog, dog_running, dog_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound;


function preload(){
  dog_running = loadAnimation("Qw5w-0.png","Qw5w-1.png","Qw5w-2.png","Qw5w-3.png",
  "Qw5w-4.png","Qw5w-5.png","Qw5w-6.png","Qw5w-7.png","Qw5w-8.png","Qw5w-9.png");

  //dog_collided = loadAnimation("dog_collided.png");
  
  groundImage = loadImage("grass.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("rock.jpg");
  obstacle2 = loadImage("rock.jpg");
  obstacle3 = loadImage("rock.jpg");
  obstacle4 = loadImage("rock.jpg");
  obstacle5 = loadImage("rock.jpg");
  obstacle6 = loadImage("rock.jpg");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
  
  dog = createSprite(50,180,20,50);
  dog.addAnimation("running", dog_running);
  //dog.addAnimation("collided" ,dog_collided);
  dog.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
   gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  dog.setCollider("circle",0,0,40);
  dog.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //displaying score
  text("Score: "+ score, 500,50);
  
  console.log("this is ",gameState)
  
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //move the ground
    ground.velocityX = -(4 + 3 * score / 100);
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& dog.y >= 100) {
        dog.velocityY = -12;
        jumpSound.play();
    }
    
    if(score > 0 && score % 100 === 0) {
      checkPointSound.play();
    }

    //add gravity
    dog.velocityY = dog.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(dog)){
        gameState = END;
        dieSound.play();
        //dog.velocityY = -10;
        //jumpSound.play();
    }
  }
   else if (gameState === END) {
     console.log("hey")
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      dog.velocityY = 0
     
      //change the dog animation
      //dog.changeAnimation("collided", dog_collided);
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     
     if (mousePressedOver(restart)) {
      reset();
    }
   }
  
 
  //stop dog from falling down
  dog.collide(invisibleGround);
  
  drawSprites();
}

function reset() {
  gameState = PLAY;

  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  dog.changeAnimation("running");
  score = 0;
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score / 100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 134;
    
    //adjust the depth
    cloud.depth = dog.depth;
    dog.depth = dog.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}