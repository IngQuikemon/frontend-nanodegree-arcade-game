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

var Enemy = function(startX,startY,image){
  Character.call(this,startX,startY,image);
  this.velocity = ((Math.floor((Math.random() * 10)) % 2) + 1);
}
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.update = function(){
  this.posX = this.velocity + this.posX;
  this.posY = (this.cordY * 83) - 25;
  if(this.posX > 707){
    this.posX =-101;
  }
  if(this.posX < -101){
    this.posX = -101;
  }
}

var Player = function(startX,startY,image){
  Character.call(this,startX,startY,image);
  this.requestReset = false;
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
  }
}
Player.prototype.checkCollisions = function(enemyList){
  var pBoundXL = (this.cordX * 101) + 34;
  var pBoundXR = ((this.cordX * 101) + 101)-34;
  for(var x = 0; x < enemyList.length;x++){
    var enemy = enemyList[x];
    eBoundXL = enemy.posX;
    eBoundXR = enemy.posX + 101;
    if(this.cordY == enemy.cordY){
      if(eBoundXL > pBoundXL && eBoundXL < pBoundXR){
        return true;
      }
      if(eBoundXR > pBoundXL && eBoundXR < pBoundXR){
        return true;
      }
    }
  }
  return false;
}
