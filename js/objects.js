var Character = function(startX,startY,image) {
  this.posX = 0;
  this.posY = 0;
  this.cordX = startX;
  this.cordY = startY;
  this.image = image;
}
Character.prototype.update = function(){
  //apply code required to make the character move based on input or time
  this.posX = this.cordX * 101;
  this.posY = (this.cordY * 83) - 42;
}

Character.prototype.render = function(ctx){
  // code the rendering piece that will place the update character in the
  // map
  ctx.drawImage(Resources.get(this.image), this.posX, this.posY);
}

var Gem = function(startX,startY,image,points){
  Character.call(this,startX,startY,image);
  this.points = points;
  this.display = true;
}
Gem.prototype = Object.create(Character.prototype);
Gem.prototype.constructor = Gem;
Gem.prototype.render = function(ctx){
  ctx.drawImage(Resources.get(this.image), this.posX + 25, this.posY + 75,50,85);
}

var Rock = function(startX,startY,image){
  Character.call(this,startX,startY,image);
}
Rock.prototype = Object.create(Character.prototype);
Rock.prototype.constructor = Rock;

var Enemy = function(startX,startY,image){
  Character.call(this,startX,startY,image);
  this.velocity = generateRandom(3);
}
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.update = function(){
  this.posX = this.velocity + this.posX;
  this.posY = (this.cordY * 83) - 25;
  if(this.posX > 707){
    this.posX =-101;
    this.velocity = generateRandom(3);
  }
  if(this.posX < -101){
    this.posX = -101;
  }
}

var Player = function(startX,startY,image){
  Character.call(this,startX,startY,image);
  this.requestReset = false;
  this.score = 0;
  this.lifeCount = 3;
  this.goalReached = false;
  this.previousX = startX;
  this.previousY = startY;
}
Player.prototype =  Object.create(Character.prototype);
Player.prototype.constructor = Player;
Player.prototype.handleInput = function(keyInput){
  //Create handling of input from keyboard.
  var movX = 0;
  var movY = 0;
  switch(keyInput){
    case 'space':
      this.requestReset = true;
      break;
    case 'up':
      movY = -1;
    break;
    case 'down':
      movY = 1;
    break;
    case 'left':
      movX = -1;
    break;
    case 'right':
      movX = 1;
    break;
    default:
      movX = movY = 0;
      break;
  }
  this.previousX= this.cordX;
  this.previousY = this.cordY;
  this.cordX = this.cordX + movX;
  this.cordY = this.cordY + movY;
  if(this.cordX > 5)
  {
    this.cordX = 5;
  }
  if(this.cordX < 0){
    this.cordX = 0;
  }
  if(this.cordY > 7)
  {
    this.cordY = 7;
  }
  if(this.cordY < 1){
    this.cordY = 1;
    this.goalReached = true;
  }
}
Player.prototype.checkCollisions = function(enemyList,gemList,rockList){
  var pBound = this.posX + 50;
  for(var x = 0; x < enemyList.length;x++){
    var enemy = enemyList[x];
    eBound = enemy.posX + 50;
    var distDiff = pBound - eBound;
    if(this.cordY == enemy.cordY){
      if(distDiff < 65 && distDiff > - 65){
        return true;
      }
    }
  }
  for(var x = 0; x < gemList.length;x++){
    var gem = gemList[x];
    if(gem.display){
      if(this.cordY == gem.cordY){
        if(this.cordX == gem.cordX){
          this.score += gem.points;
          gem.display=false;
        }
      }
    }
  }
  for(var x = 0; x < rockList.length; x++){
    var rock = rockList[x];
    if(this.cordY == rock.cordY){
      if(this.cordX == rock.cordX){
        this.cordX = this.previousX;
        this.cordY = this.previousY;
      }
    }
  }
  return false;
}
Player.prototype.checkLifeCount = function(){
  if(this.lifeCount <= 0){
    this.lifeCount = 3;
    this.score = 0;
  }
  else{
    this.lifeCount = this.lifeCount - 1;
  }
}
