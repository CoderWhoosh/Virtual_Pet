//Create variables here
var doggy, dog, happyDog, database, foodS, foodStock;
var database;
//var hr,response,rjson,datetime;
var feed, plusFood;
var feedTime,lastFed;
var foodObj;
var changeGameState, readGameState;
var bedroomImg,gardenImg,washroomImg;
var gameState,currentTime;

function preload()
{
  //load images here
  dog = loadImage("Dog.png");
  happyDog = loadImage("Happy.png");
  sadDogImg = loadImage("deadDog.png");

  bedroomImg = loadImage("Bed Room.png");
  gardenImg = loadImage("Garden.png");
  washroomImg = loadImage("Wash Room.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000, 500);
  foodObj =  new Food();
  foodStock = database.ref("Food");
  foodStock.on("value",function(data){
    foodS = data.val();
    foodObj.updateFoodStock(foodS);
  });
  feedTime = database.ref("fedTime");
  feedTime.on("value",function(data){
    lastFed = data.val();
  });
  readGameState = database.ref("gameState");
  readGameState.on("value",function(data){
    gameState = data.val();
  });
  console.log(gameState);
  doggy = createSprite(700,250,20,20);
  doggy.addImage(dog);
  doggy.scale = 0.3;

  
  /*
  milk = createSprite(x,y);
  milk.addImage(milkImage);
  milk.scale = 0.1;
  milk.visible = false;
  */
  feed = createButton("Feed the Dog");
  feed.position(600,75);
  feed.mousePressed(feedDog);

  plusFood = createButton("Increase Food");
  plusFood.position(700,75);
  plusFood.mousePressed(addFood);
}


function draw() {  
  background(46, 139, 87);
  //get current time
  currentTime = hour();
  if(currentTime === lastFed+1){
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime === lastFed+2){
    update("Sleeping");
    foodObj.bedroom();
  }
  else if(currentTime>lastFed+2 && currentTime<lastFed+4){
    update("Bathing");
    foodObj.washroom();
  }
  else{
    update("Hungry");
    foodObj.display();
  }
  
  if(gameState !== "Hungry"){
    feed.hide();
    plusFood.hide();
    doggy.remove();
  }
  else{
    feed.show();
    plusFood.show();
    doggy.addImage(sadDogImg);
  }
  drawSprites();
  //add styles here
  fill("white");
  textSize(20);
  if(lastFed>=12){
    text("Last Fed at : "+ lastFed%12 +"PM",50,100)
  }
  else if(lastFed===0){
    text("Last Fed at : 12 AM",50,100);
  }
  else{
    text("Last Fed at : "+ lastFed +"AM",50,100);
  }
}
function feedDog(){
  update("NotHungry");
  doggy.addImage(happyDog);
  //milk.visible = false;
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref("/").update({
    Food:foodObj.getFoodStock(),
    fedTime:hour()
  })
}
function addFood(){
  foodS++;
  database.ref("/").update({
    Food:foodS
  })
  //milk.visible = true;
}
function update(state){
  database.ref('/').update({
    gameState: state
  })
}
/*
async function getTime(){
  response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  rjson = await response.json();
  datetime = rjson.datetime;
  hr = datetime.slice(11,13);
}
*/