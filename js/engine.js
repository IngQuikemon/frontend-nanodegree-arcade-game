/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /**
     * Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 606;
    canvas.height = 772;
    doc.body.appendChild(canvas);
    var allEnemies = [
      //enemies on first block
      new Enemy(0,2,'images/enemy-bug.png'),
      new Enemy(0,3,'images/enemy-bug.png'),
      //enemies on second block
      new Enemy(0,5,'images/enemy-bug.png'),
      new Enemy(0,6,'images/enemy-bug.png')
    ];
    var gemLocations = [2,3,5,6];
    var allGems = [
      new Gem( generateRandom(6) - 1,gemLocations[generateRandom(4)-1], 'images/Gem-Blue.png',100),
      new Gem( generateRandom(6) - 1,gemLocations[generateRandom(4)-1], 'images/Gem-Green.png',250),
      new Gem( generateRandom(6) - 1,gemLocations[generateRandom(4)-1], 'images/Gem-Orange.png',500)
    ];
    var rockLocations = [1,4];
    var allRocks = [
      new Rock(generateRandom(6) - 1,rockLocations[generateRandom(2)-1], 'images/Rock.png'),
      new Rock(generateRandom(6) - 1,rockLocations[generateRandom(2)-1], 'images/Rock.png'),
      new Rock(generateRandom(6) - 1,rockLocations[generateRandom(2)-1], 'images/Rock.png'),
      new Rock(generateRandom(6) - 1,rockLocations[generateRandom(2)-1], 'images/Rock.png')
    ];
    player = new Player(2,7,'images/char-boy.png');

    /**
     * This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /**
     * This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /**
     * This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        player.checkObjectCollisions(allRocks);
        updateEntities(dt);
        player.checkCollisions(allEnemies,allGems);
    }

    /**
     * Render the GAME OVER text as well as the instructions to restart
     * or continue the next life the player has.
     */
    function displayGameOver(){
      if(player.collide || player.goalReached){ //Verifies status of player
        //Finds the text to render based on the condition found.
        var displayText = player.lifeCount <= 0 ?
        'GAME OVER' : player.goalReached == true ?
        'GOAL REACHED' : 'YOU GOT HIT';
        //As well finds the instructions after something happened to the player.
        var displayContinue = player.goalReached == true ?
        'PRESS SPACE BAR TO CONTINUE' : 'PRESS SPACE BAR TO TRY AGAIN';
        //If something happened to the player, it renders the text found.
        ctx.moveTo(0,0);
        ctx.font = '54pt Candal';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.fillText(displayText,canvas.width/2,(3*128));
        ctx.strokeStyle = 'black';
        ctx.lineWidth=3;
        ctx.strokeText(displayText,canvas.width/2,3*128);
        ctx.font = '16pt Candal';
        ctx.fillStyle = 'white';
        ctx.fillText(displayContinue,canvas.width/2,(5*83));
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeText(displayContinue,canvas.width/2,(5*83));
        reset();
      }
    }
    /**
     * This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
      if(!player.collide && !player.goalReached){
        // If there has not been a collision or goal reached, keep updating
        // the game objects.
        allEnemies.forEach(function(enemy) {
            enemy.update();
        });
        allGems.forEach(function(gem){
            gem.update();
        });
        allRocks.forEach(function(rock){
            rock.update();
        });
        player.update();
      }
    }

    /**
     * This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png',    // Row 2 of 2 of grass
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png',   // Row 2 of 2 of grass
                'images/stone-block.png'   // Row 3 of 3 of stone
            ],
            numRows = 8,
            numCols = 6,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
        displayGameOver();
        renderPlayerScore();
    }

    /**
     * Renders the score of the player as well as the lifes left in the session
     * for the player. Once the lifes are gone, he will have to start from
     * scratch.
     */
     function renderPlayerScore(){
         ctx.beginPath();
         ctx.rect(0,0,606,45);
         ctx.fillStyle ='white';
         ctx.fill();
         ctx.font = '16pt Candal';
         ctx.textAlign = 'center';
         ctx.fillStyle = 'black';
         ctx.fillText('Score:' + player.score,canvas.width/2,25);
         ctx.drawImage(Resources.get(player.image), canvas.width-75, -5,25,45);
         ctx.fillText(player.lifeCount,canvas.width - 40,30)
     }
    /**
     * This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allGems.forEach(function(gem){
          if(gem.display){
             gem.render(ctx,Resources.get(gem.image));
          }
        });
        allEnemies.forEach(function(enemy) {
          enemy.render(ctx,Resources.get(enemy.image));
        });
        allRocks.forEach(function(rock){
          rock.render(ctx,Resources.get(rock.image));
        });
        player.render(ctx,Resources.get(player.image));
    }

    /**
     * This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset(){
      if(player.requestReset && (player.collide || player.goalReached)){
        if(player.goalReached){ //If the player has reached the goal.
          //It will reset the starting point.
          player.cordX = 2;
          player.cordY = 7;
          player.goalReached = false;
          //shuffles the gems locations
          allGems.forEach(function(gem){
            gem.display=true;
            gem.cordX = generateRandom(6) - 1;
            gem.cordY = gemLocations[generateRandom(4)-1];
          });
          //shuffles the rocks positions.
          allRocks.forEach(function(rock){
            rock.cordX = generateRandom(6) - 1;
            rock.cordY = rockLocations[generateRandom(2)-1];
          });
        }else{
          //if not, then it was an enemy collision, and resets the player
          //accordingly.
          player.cordX = 2;
          player.cordY = 7;
          player.collide = false;
          player.requestReset = false;
          player.checkLifeCount();
        }
      }else{
        //if it was none of goal or enemy collision, it puts back again
        //the request flag to reset the game as false.
        player.requestReset = false;
      }
    }

    /*
     * Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/Gem-Blue.png',
        'images/Gem-Green.png',
        'images/Gem-Orange.png',
        'images/Rock.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
