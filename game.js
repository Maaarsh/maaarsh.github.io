/*
Individual Assignment 3: JavaScript Game
CSC 317 Section 1
Name: Marshall Toro
Student ID: 924086043
Github Username: Maaarsh
*/

var player;
var house;
var enemy = [];
var playerHealth = 100;
var enemyHealth = 50;
var lastHit = 0;
var lastEnemyX = 0;
var canAttack = true;
var isBlocking = false;
var isCrouching = false;
var enemySpawnInterval = 150;
var minDist = 100;
var maxDist = 500;

function startGame() {
  myGameArea.start();
  var height = 50;
  player = new component(30, height, "rgb(255, 0, 0)", 270, 270); // Create player
  player.color = "rgb(255, 0, 0)";

  //house = new component(95, 120, "rgb(0, 0, 255)", 0, 150); // Create house
}

// P key to restart the game
window.addEventListener('keydown', function (e) {
  if (e.keyCode === 80) { // P key
    // Reset game variables
    playerHealth = 100;
    enemy = [];
    lastHit = 0;
    lastEnemyX = 0;
    canAttack = true;
    isBlocking = false;
    isCrouching = false;
    enemySpawnInterval = 150;
    minDist = 100;
    maxDist = 500;
    playerpos = 270; // Reset player position
    player.x = 270; // Reset player x position
    player.y = myGameArea.canvas.height - player.height; // Reset player y position

    // Restart the game
    myGameArea.stop();
    myGameArea.start();
  }
}
);

var myGameArea = {
    canvas : document.createElement("canvas"),
    lastDirection: null,
    start : function() {
        // Set canvas size
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");

        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;

            if (e.keyCode === 65) {
              myGameArea.lastDirection = 'left';
            } else if (e.keyCode === 68) {
                myGameArea.lastDirection = 'right';
            }
        });

        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false;

            if (e.keyCode === 39 || e.keyCode === 37) {
              canAttack = true;
            }
        });

    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);
    },
    stop : function() {
        clearInterval(this.interval);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  function component(width, height, color, x, y) {
      this.gamearea = myGameArea;
      this.width = width;
      this.height = height;
      this.speedX = 0;
      this.speedY = 0;
      this.grav = 0.2;
      this.gravSpeed = 0;
      this.jumping = false;
      this.x = x;
      this.y = y;
      this.color = color;

      this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }

      this.newPos = function() {
          this.gravSpeed += this.grav;
          this.x += this.speedX;
          this.y += this.speedY + this.gravSpeed;
          this.hitBottom();
          this.hitLeft();
          this.hitRight();
      }

      this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);  
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
          crash = false;
        }
        return crash;
      }

      // Prevents the player from falling through the floor
      this.hitBottom = function() {
          var bottom = myGameArea.canvas.height - this.height;
          if (this.y > bottom) {
              this.y = bottom;
              this.gravSpeed = 0;
              this.jumping = false;
          }
      }

      // Prevents the player from moving off the left side of the screen
      this.hitLeft = function() {
        if (this.x < screenLeft) {
            this.x = screenLeft;
        }
      }

      // Prevents the player from moving to right past the middle of the screen
      // this.hitRight = function() {
      //   var rightBoundary = (myGameArea.canvas.width - this.width)/2;
      //   if (this.x > rightBoundary) {
      //       this.x = rightBoundary;
      //   }
      // }

      // Prevents the player from moving off the right side of the screen
      this.hitRight = function() {
        var right = myGameArea.canvas.width - this.width;
        if (this.x > right) {
            this.x = right;
        }
      }
  }

  function updateGameArea() {
      myGameArea.clear();
      player.speedX = 0;
      player.speedY = 0;
      var x, y;
      var fist = null;

      /* ========== PLAYER ACTIONS ========== */
      // A key (move left)
      if (myGameArea.keys && myGameArea.keys[65] && myGameArea.lastDirection === 'left') {
        let canMoveLeft = true;
        for (let i = 0; i < enemy.length; i++) {
          if (player.crashWith(enemy[i])) {
            if (player.x < enemy[i].x + enemy[i].width && player.x + player.width > enemy[i].x) {
              canMoveLeft = false;
              break;
            }
          }
        }
        if (canMoveLeft) {
          player.speedX = -2;
        }
      }

      // D key (move right)
      if (myGameArea.keys && myGameArea.keys[68] && myGameArea.lastDirection === 'right') {
        let canMoveRight = true;

        // If player is colliding with an enemy, prevent movement
        for (let i = 0; i < enemy.length; i++) {
          if (player.crashWith(enemy[i])) {
            if (player.x + player.width > enemy[i].x && player.x < enemy[i].x + enemy[i].width) {
              canMoveRight = false;
              break;
            }
          }
        }

        if (canMoveRight) {
          player.speedX = 2;
        }
      }

      // Stop moving if no keys are pressed
      if (!myGameArea.keys[65] && !myGameArea.keys[68]) {
        myGameArea.speedX = 0;
      }

      // W key (jump)
      if (myGameArea.keys && myGameArea.keys[87] && !player.jumping) {
        player.gravSpeed = -5;
        player.jumping = true;
      }
      // S key (fast fall)
      if (myGameArea.keys && myGameArea.keys[83] && player.jumping) {
        player.grav = 1;
      } else {
        player.grav = 0.2;
      }

      // Shift key (crouch)
      if (myGameArea.keys && myGameArea.keys[16]) {
        var isCrouching = true;
        if (!player.jumping) { // If not jumping, remove top half for crouch
          player.height = 30;
          pos = player.y;
          player.y = pos + 20;
        } else { // If jumping, remove bottom part for crouch
          player.height = 30;
        }
      } else { // If not crouching, reset height
        isCrouching = false;
        player.height = 50;
      }

      // Right arrow key (right attack)
      if (myGameArea.keys && myGameArea.keys[39] && canAttack) {
        for (let i = 0; i < enemy.length; i++) {
          canAttack = false;
          fist = new component(50, 10, "rgb(255, 0, 0)", player.x, player.y + player.height / 3);
          if (isCrouching == true && player.jumping == false) {
            fist.y = player.y - 10;
          }
          fist.update();
          
          if (fist.crashWith(enemy[i])) {
            enemy[i].health -= 10;
            // console.log('Right attack');
            // console.log('Enemy health: ', enemy[i].health);

            if (enemy[i].health <= 0) {
              enemy.splice(i, 1);
              i--;
            }

            canAttack = false;
            break;
          }
        }
      }

      if (fist) {
        fist.update();
      }

      // Left arrow key (left attack)
      if (myGameArea.keys && myGameArea.keys[37] && canAttack) {
        for (let i = 0; i < enemy.length; i++) {
          canAttack = false;
          fist = new component(50, 10, "rgb(255, 0, 0)", player.x - player.width/1.5, player.y + player.height / 3);
          if (isCrouching == true && player.jumping == false) {
            fist.y = player.y - 10;
          }
          fist.update();

          if (fist.crashWith(enemy[i])) {
            enemy[i].health -= 10;
            // console.log('Left attack');
            // console.log('Enemy health: ', enemy[i].health);

            if (enemy[i].health <= 0) {
              enemy.splice(i, 1);
              i--;
            }

            canAttack = false;
            break;
          }
        }
      }

      // Up arrow key (up attack)

      // Down arrow key (down attack)

      // Space key (block)
      if (myGameArea.keys && myGameArea.keys[32]) {
        player.color = "rgb(0, 0, 255)";            setTimeout(() => {
          player.color = "rgb(255, 0, 0)";
        }, 50);
        player.speedX = player.speedX / 2;
        isBlocking = true;
        canAttack = false;
        // console.log('Blocking');
      } else {
        isBlocking = false;
        // console.log('Not blocking');
      }

      /* ========== ENEMIES ========== */
      // Check for collisions with enemies
      for (i = 0; i < enemy.length; i += 1) {
        if (player.crashWith(enemy[i])) {
          // Enemy attacks player
          var currentTime = new Date();
          if (currentTime - lastHit >= 500) {
            // If the player is blocking, reduce damage by half
            if (isBlocking) {
              playerHealth -= 5;
              isBlocking = false;
            } else {
              playerHealth -= 10;
            }
            lastHit = currentTime;
          }
        }
      }
      // console.log('Player health: ', playerHealth);
      if (playerHealth <= 0) {
        myGameArea.stop();
        console.log('Game over');
        healthAndScore();
        return;
      }

      // Create new enemies
      if (myGameArea.frameNo % 500 === 0 && enemySpawnInterval > 50) {
        enemySpawnInterval -= 10;
        console.log('Enemy spawn interval: ', enemySpawnInterval);
      }

      myGameArea.frameNo += 1;
      // minDist = 100;
      // maxDist = 500;
      if (myGameArea.frameNo % 500 === 0 && maxDist > 200) {
        maxDist -= 10;
        console.log('Max Distance: ', maxDist);
      }
      dist = Math.floor(Math.random() * (maxDist - minDist + 1) + minDist);
      if (myGameArea.frameNo == 1 || everyInterval(enemySpawnInterval)) {
          x = myGameArea.canvas.width + dist;

          if (x - lastEnemyX < minDist) {
              x = lastEnemyX + minDist;
          }

          var enemyHeight = 30;
          y = myGameArea.canvas.height - enemyHeight;

          var newEnemy = new component(10, enemyHeight, "rgb(33, 190, 33)", x, y);
          newEnemy.color = "rgb(33, 190, 33)";
          newEnemy.health = 50;
          newEnemy.speedX = -1;
          enemy.push(newEnemy);

          lastEnemyX = x;
      }

      // Update and move enemies
      for (i = 0; i < enemy.length; i += 1) {
        if (myGameArea.frameNo % 500 === 0 && enemy[i].speedX > -5) {
          enemy[i].speedX -= 0.1;
          console.log('Enemy speed: ', enemy[i].speedX);
        }
          if (player.crashWith(enemy[i])) {
              enemy[i].x += 0;
              enemy[i].update();
          } else {
            enemy[i].x += enemy[i].speedX;
            enemy[i].update();
          }
          // Enemy starts going other way when it reaches the left side of the screen
          if (enemy[i].x <= 0) {
              enemy[i].speedX = 1;
          }
          // Enemy starts going other way when it reaches the right side of the screen
          if (enemy[i].x >= myGameArea.canvas.width - enemy[i].width) {
              enemy[i].speedX = -1;
          }
      }
      player.newPos();
      player.update();
      healthAndScore();
  }

  function healthAndScore() {
    // Display player health
    myGameArea.context.fillStyle = "black";
    myGameArea.context.font = "20px Arial";
    myGameArea.context.fillText("Health: " + playerHealth, 10, 20);

    // Display score
    myGameArea.context.fillStyle = "black";
    myGameArea.context.font = "20px Arial";
    myGameArea.context.fillText("Score: " + myGameArea.frameNo, 10, 40);
  }

  function everyInterval(n) {
      return (myGameArea.frameNo / n) % 1 === 0;
      // if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
      // return false
  }

  function getEnemyPlayerDist(player, enemy) {
    var dx = player.x - enemy.x;
    // return Math.sqrt(dx * dx);
    var dy = player.y - enemy.y;
    return Math.sqrt(dx * dx + dy * dy);
  }