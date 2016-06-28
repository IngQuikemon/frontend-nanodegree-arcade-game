/**
 * Defines the object for basic structure of an ingame character.
 * @constructor
 * @param {int} startX - The starting coordinate in which the object is going
 * to be rendered on the X axis.
 * @param {int} startY - The starting coordinate in which the object is going
 * to be rendered on the Y axis.
 * @param {string} image - The image label that is going to describe the object.
 */
var Character = function(startX,startY,image) {
  this.posX = 0;
  this.posY = 0;
  this.cordX = startX;
  this.cordY = startY;
  this.image = image;
}
/**
 * Updates the position of the character based on the coordinates defined.
 */
Character.prototype.update = function(){
  //apply code required to make the character move based on input or time
  this.posX = this.cordX * 101;
  this.posY = (this.cordY * 83) - 42;
}
/**
 * Renders the object based on the position and the image defined on the object.
 * @param {object} ctx - The value of the context that renders in the canvas.
 */
 Character.prototype.render = function(ctx){
  ctx.drawImage(Resources.get(this.image), this.posX, this.posY);
}

/**
 * Defines the object required to render a gem.
 * @constructor
 * @param {int} startX - The starting coordinate in which the object is going
 * to be rendered on the X axis.
 * @param {int} startY - The starting coordinate in which the object is going
 * to be rendered on the Y axis.
 * @param {string} image - The image label that is going to describe the object.
 * @param {int} points - Defines the amount of points awarded for the gem.
 */
var Gem = function(startX,startY,image,points){
  Character.call(this,startX,startY,image);
  this.points = points;
  this.display = true;
}
Gem.prototype = Object.create(Character.prototype);
Gem.prototype.constructor = Gem;
/**
 * Renders the object based on the position and the image defined on the object.
 * @param {object} ctx - The value of the context that renders in the canvas.
 */
Gem.prototype.render = function(ctx){
  ctx.drawImage(Resources.get(this.image), this.posX + 25, this.posY + 75,50,85);
}

/**
 * Defines the object required to render a rock.
 * @constructor
 * @param {int} startX - The starting coordinate in which the object is going
 * to be rendered on the X axis.
 * @param {int} startY - The starting coordinate in which the object is going
 * to be rendered on the Y axis.
 * @param {string} image - The image label that is going to describe the object.
 */
var Rock = function(startX,startY,image){
  Character.call(this,startX,startY,image);
}
Rock.prototype = Object.create(Character.prototype);
Rock.prototype.constructor = Rock;

/**
 * Defines the object required to render an enemy.
 * @constructor
 * @param {int} startX - The starting coordinate in which the object is going
 * to be rendered on the X axis.
 * @param {int} startY - The starting coordinate in which the object is going
 * to be rendered on the Y axis.
 * @param {string} image - The image label that is going to describe the object.
 */
var Enemy = function(startX,startY,image){
  Character.call(this,startX,startY,image);
  this.velocity = generateRandom(3);
}
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;
/**
 * Overrides the update function to catter the special needs of the automatic
 * movement of the enemy object.
 */
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

/**
 * Defines the object required to render the player.
 * @constructor
 * @param {int} startX - The starting coordinate in which the object is going
 * to be rendered on the X axis.
 * @param {int} startY - The starting coordinate in which the object is going
 * to be rendered on the Y axis.
 * @param {string} image - The image label that is going to describe the object.
 */
var Player = function(startX,startY,image){
  Character.call(this,startX,startY,image);
  this.requestReset = false;
  this.score = 0;
  this.lifeCount = 3;
  this.goalReached = false;
  this.collide = false;
  this.previousX = startX;
  this.previousY = startY;
}
Player.prototype =  Object.create(Character.prototype);
Player.prototype.constructor = Player;
/**
 * Handles the input logic to update the player position in the game based
 * on the keys that the user press.
 * @param {stromg} keyInput - The value of the key pressed by the user.
 */
Player.prototype.handleInput = function(keyInput){
  //Create handling of input from keyboard.
  var movX = 0;
  var movY = 0;
  //Choose the command value based on the key pressed.
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
  //Saves the previous coordinate in case it crashes with a rock.
  this.previousX= this.cordX;
  this.previousY = this.cordY;
  //Applies the new coordinates for rendering the new player position.
  this.cordX = this.cordX + movX;
  this.cordY = this.cordY + movY;
  //Verifies if the player has reached the boundaries of the level.
  //If it does, it defaults the coordinate position to its safest one.
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
  if(this.cordY <= 1){
    this.cordY = 1;
  }
}
/**
 * Verifies collision with objects that are not moveable.
 * @param {array} rockList - The array containing the rock objects.
 */
Player.prototype.checkObjectCollisions = function(rockList){
  for(var x = 0; x < rockList.length; x++){
    var rock = rockList[x];
    //Verifies if the rock coordinates are the same as the player.
    if(this.cordY == rock.cordY && this.cordX == rock.cordX){
        //If it does, it places the player to the safes location prior to the
        //movement logic.
        this.cordX = this.previousX;
        this.cordY = this.previousY;
      }
   }
}

/**
 * Checks collisions against objects in the game.
 * @param {array} enemyList - The array of enemies within the game.
 * @param {array} gemList - The array of gems within the game.
 */
 Player.prototype.checkCollisions = function(enemyList,gemList){
  var pBound = this.posX + 50;
  //Verifies against the list of enemies.
  for(var x = 0; x < enemyList.length;x++){
    var enemy = enemyList[x];
    eBound = enemy.posX + 50;
    var distDiff = pBound - eBound;
    //Verifies if the player is in the same coordinates and range as the enemy.
    if(this.cordY == enemy.cordY && (distDiff < 65 && distDiff > - 65)){
        //If the player collides with an enemy, it marks the player as collide.
        player.collide = true;
    }
  }
  //Verifies against gem collection
  for(var x = 0; x < gemList.length;x++){
    var gem = gemList[x];
    if(gem.display){
        //If the gem is being rendered.
        //Verify if the gem coordinates are the same as the player.
        if(this.cordY == gem.cordY && this.cordX == gem.cordX){
            //if it does, it adds the points to the player and make the gem
            //not render anymore.
            this.score += gem.points;
            gem.display=false;
        }
     }
  }
  //If player reaches the safest point on the other side of the road, it marks
  //the player as goal reached.
  if(player.cordY == 1){
    player.goalReached = true;
  }
}
/**
 * Handle the life count logic for the player.
 */
Player.prototype.checkLifeCount = function(){
  if(this.lifeCount <= 0){
    //If the life count is 0, it resets the player score and life counters.
    this.lifeCount = 3;
    this.score = 0;
  }
  else{ //If not, then it will only substract a life to the player.
    this.lifeCount = this.lifeCount - 1;
  }
}
