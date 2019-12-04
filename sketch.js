var trex, trex_running;
var ground, groundImage;
var edges;
var iground;
var r1,r2;
var cloud1;
var ob1, obs1, obs2, obs3, obs4, obs5, obs6;
var points = 0;
var val = 10;
var cloudGroup,obsGroup;
var PLAY=1;
var END=0;
var gameState=PLAY;
var game_over, gameover;
var _restart, restart;
var collided, _collided;
var high = 0;
var jump, die, chkpnt;
var clob;

function spawnClouds(){
  if(frameCount%60 === 0){  
    var cloud = createSprite(600+r1,100,10,10);
    cloud.addImage("cloud", cloud1);
    cloud.velocityX = -(3+1.5*frameCount/100);
    console.log(trex.depth);
    cloud.y = r2;
    cloud.lifetime = Math.round((600+r1)/2) + 10;
    trex.depth = cloud.depth + 1;
    cloud.scale = random(0.5,1);
    cloudsGroup.add(cloud);
  }
}

function obstacle(){
  if(frameCount%65 === 0){
    ob1 = createSprite(600+r1,170,10,10);
    clob = 600 + r1;
    ob1.velocityX -= val;
    ob1.scale = 0.6;
    switch(Math.round(random(1,6))){
        case 1:
          ob1.addImage("o1",obs1);
          break;
        case 2:
          ob1.addImage("o2",obs2);
          break; 
        case 3:
          ob1.addImage("o3",obs3);
          break;
        case 4:
          ob1.addImage("o4",obs4);
          break;
        case 5:
          ob1.addImage("o5",obs5)
          break;
        case 6:
          ob1.addImage("o6",obs6);
          break;
        default:
           break;
    }
    ob1.lifetime = Math.round((600+r1)/val)+10;
    obsGroup.add(ob1);
    console.log(ob1.lifetime);
    //ob1.debug = true;
  } 
}

function preload(){
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundImage = loadImage("ground2.png");
  cloud1 = loadImage("cloud.png");
  obs1 = loadImage("obstacle1.png");
  obs2 = loadImage("obstacle2.png");
  obs3 = loadImage("obstacle3.png");
  obs4 = loadImage("obstacle4.png");
  obs5 = loadImage("obstacle5.png");
  obs6 = loadImage("obstacle6.png");
  game_over = loadImage("gameOver.png");
  _restart = loadImage("restart.png");
  _collided = loadImage("trex_collided.png");
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
  chkpnt = loadSound("checkPoint.mp3");
}


function setup(){
  createCanvas(600, 200);
  edges = createEdgeSprites()
  trex = createSprite(50, 156, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.4;
  //trex.debug = true;
  trex.setCollider("rectangle",0,-10,50,trex.height,20);
  //trex.setCollider("rectangle", 150, 0, 400, trex.height);
  ground = createSprite(300, 190, 2377, 10);
  ground.addImage("ground", groundImage);
  iground = createSprite(300, 195, 600, 5);
  iground.visible = false;
  cloudsGroup=createGroup();
  obsGroup=createGroup();
  gameover = createSprite(300,100);
  gameover.scale = 0.6;
  gameover.addImage("KO",game_over);
  restart = createSprite(300,130);
  restart.addImage("restart",_restart);
  restart.scale = 0.3;
}

function draw(){
  background(20);
  r1=Math.round(random(60,200));
  r2=Math.round(random(10,100));
  if(gameState===PLAY){
    gameover.visible = false;
    restart.visible = false;
    if (trex.y >= 156.1) {
      if (keyDown("space")) {
        jump.play();
        trex.velocityY = -12 ;
      }
    }
  /*if(trex.isTouching(obsGroup)){
      jump.play();
      trex.velocityY = -12;
    }*/
  trex.velocityY = trex.velocityY + 1;
  ground.x -= val;
  if (ground.x < 0) {
    ground.x = 2377 / 2;
  }
  points = Math.round(frameCount/3);
  if(frameCount%300 === 0){
    chkpnt.play(); 
    val++;
  }
  if(obsGroup.isTouching(trex)){
    die.play();
    gameState = END;
  }
  spawnClouds();
  obstacle();
  }else if(gameState===END){
    trex.addImage("running",_collided);
    restart.visible = true;
    gameover.visible = true;
    obsGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    trex.velocityY = 0;
    obsGroup.setLifetimeEach(frameCount);
    cloudsGroup.setLifetimeEach(-1);
    if(mousePressedOver(restart)){
      obsGroup.destroyEach();
      cloudsGroup.destroyEach();
      trex.addAnimation("running", trex_running);
      gameState = PLAY;
      frameCount = 0;
      points = 0;
    }
  }
  // console.log(r1)
  //console.log(trex.y);
  strokeWeight(2);
  stroke("purple");
  text(points,500,15);
  text(high,10,15);
  trex.collide(iground);
  if(high <= points){
    high = points;
  }
  //if(trex.y > ground.y - 20){
  //  trex.y = ground.y - 20;
  //}
  //if(frameCount%5 === 0){
  //  points++; 
  //}
  drawSprites();
}