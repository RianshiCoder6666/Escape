var bg, catImg, mouseImg, catNotMoving, mouseNotMoving, playButton, resetImg;
var seeds, wheat, cheese, obstacle1;
var jumpSound, collideSound, winSound;
var foodsGroup, obstaclesGroup;
var cat, mouse, garden, ground, playB, resetButton;
var score;

var gameState = 0;

function preload() {
  bg = loadImage("images/background.jpg");
  catImg = loadAnimation("images/cat1.png", "images/cat2.png", "images/cat3.png", "images/cat4.png");
  mouseImg =  loadAnimation("images/mouse1.png", "images/mouse2.png", "images/mouse3.png", "images/mouse4.png", "images/mouse5.png");
  catNotMoving = loadAnimation("images/cat1.png");
  mouseNotMoving = loadAnimation("images/mouse1.png");

  seeds = loadImage("images/seedsImg.png");
  wheat = loadImage("images/wheatImg.png");
  cheese = loadImage("images/cheeseImg.png");
  obstacle1 = loadImage("images/stone.png");

  jumpSound = loadSound("sounds/jump.wav");
  collideSound = loadSound("sounds/collided.wav");
  winSound = loadSound("sounds/winSound.wav");

  playButton = loadImage("images/playButton.png");
  resetImg = loadImage("images/reset.png");
}

function setup() {
  createCanvas(800, 400);
  
  garden = createSprite(width/2, 100, 400, 20);
  garden.addImage("garden", bg);
  garden.scale = 0.5;

  cat = createSprite(80, 270, 50, 50);
  cat.addAnimation("cat_notMoving", catNotMoving);
  cat.addAnimation("cat_running", catImg);
  cat.setCollider("rectangle", 0, 0, 100, 80);
  cat.scale = 1.1;

  mouse = createSprite(220, 275, 50, 50);
  mouse.addAnimation("mouse_notMoving", mouseNotMoving);
  mouse.addAnimation("mouse_running", mouseImg);
  mouse.setCollider("rectangle", 40, 15, 300, 200);
  mouse.scale = 0.35;

  ground = createSprite(width/2, 315, width, 5);
  ground.visible = false;

  foodsGroup = new Group();
  obstaclesGroup = new Group();

  playB = createSprite(250, 80, 50, 50);
  playB.addImage("playBut", playButton);
  playB.scale = 0.2;

  resetButton = createSprite(750, 50, 50, 50);
  resetButton.addImage("resetBut", resetImg);
  resetButton.scale = 0.08;
  resetButton.visible = false;

  score = 0;
}

function draw() {
  windowResized();

  background("white");  
  drawSprites();

  mouse.collide(ground);
  cat.collide(ground);

  if(gameState === 0) {

    textAlign(LEFT);
    textFont("Times New Roman");
    fill("green");
    textStyle(BOLD);
    textSize(40);
    text("ESCAPE OUT!", 40, 50);

    if(mousePressedOver(playB)) {
      gameState = 1;
      playB.visible = false;
    }
    
  }

  if(gameState === 1) {

    textFont("Times New Roman");
    fill(40, 175, 0);
    textSize(20);
    textAlign(CENTER);
    text("Score: " + score, 50, 50);

    cat.changeAnimation("cat_running", catImg);
    cat.frameDelay = 5;

    mouse.changeAnimation("mouse_running", mouseImg);
    mouse.frameDelay = 5;

    garden.velocityX = -3

    if(garden.x < 300) {
       garden.x = 500
    }
    
    if(touches.length > 0 && mouse.y >= 259 || keyDown("SPACE") && mouse.y >= 259) {
      jumpSound.play();
      mouse.velocityY = -15;
      touches = [];
    }

    if(obstaclesGroup.isTouching(cat)){
      cat.velocityY = -10;
    }

    cat.velocityY = cat.velocityY + 0.7;
    mouse.velocityY = mouse.velocityY + 0.7;

    spawnObstacles();
    spawnFoods();

    if(mouse.isTouching(obstaclesGroup)) {
      gameState = 2;
    }

    if(foodsGroup.isTouching(mouse)) {
      score += 1;
      foodsGroup.destroyEach();
    }

    if(score === 12) {
      gameState = 3;
    }

    lose();
    win();
  } 


}

function windowResized() {

  if(windowWidth < 750 || windowHeight < 350) {
    resizeCanvas(windowWidth, windowHeight);
  }
 
}

function spawnObstacles() {
  if(frameCount % 100 === 0) {

    var obstacle = createSprite(camera.position.x + 100, 290, 40, 40);
    obstacle.setCollider("circle", 0, 0, 160);
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(6 + 3*score/100)
    obstacle.scale = 0.15;      

    obstacle.lifetime = 400;
    obstaclesGroup.add(obstacle);
    
  }
}

function spawnFoods() {
 
  if (frameCount % 150 === 0) {

    var food = createSprite(700, 290, 200, 200);

    food.velocityX = -(6 + 3*score/100);
    food.scale = 5;

    var rand = Math.round(random(1, 3));
    switch(rand) {
      case 1: food.addImage("cheeseImg", cheese);
              break;
      case 2: food.addImage("wheatImg", wheat);
              break;
      case 3: food.addImage("seedImg", seeds);
              break;
      default: break;
    }
       
    food.scale = 0.05;
    food.lifetime = 400;
    
    food.setCollider("rectangle", 0, 0, food.width/2, food.height/2)
    foodsGroup.add(food);
    
  }
  
}

function lose() {

  if(gameState === 2) {
    swal({
      title: `You Lose`,
      text: "Oops, the mouse has been caught..",
      imageUrl:
        "https://raw.githubusercontent.com/RianshiCoder6666/image2/main/mouseSad.png",
      imageSize: "100x100",
      confirmButtonText: "Oh Ok"
    })

    collideSound.play();
    resetButton.visible = true;

    garden.velocityX = 0;
    mouse.remove();
    cat.remove();

    foodsGroup.destroyEach();
    obstaclesGroup.destroyEach();

  }
}

function win() {
  if(gameState === 3) {
    swal({
      title: `You Win!`,
      text: "Yay, the mouse has been saved!",
      imageUrl:
        "https://raw.githubusercontent.com/RianshiCoder6666/img3/main/happy_mouse-removebg-preview.png",
      imageSize: "100x100",
      confirmButtonText: "Oh Ok"
    })

    winSound.play();
    resetButton.visible = true;

    garden.velocityX = 0;
    mouse.remove();
    cat.remove();

    foodsGroup.destroyEach();
    obstaclesGroup.destroyEach();

  }
}

function mousePressed() {
  if(mousePressedOver(resetButton) && gameState === 2 || mousePressedOver(resetButton) && gameState === 3) {
    gameState = 0;
    resetButton.visible = false;
    
    obstaclesGroup.destroyEach();
    foodsGroup.destroyEach();
    
    cat.changeAnimation("cat_notMoving", catNotMoving);
    mouse.changeAnimation("mouse_notMoving", mouseNotMoving);
    
    score = 0;
    }
}