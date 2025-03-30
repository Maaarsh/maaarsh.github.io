Individual Assignment 3: JavaScript Game
CSC 317 Section 1
Name: Marshall Toro
Student ID: 924086043
Github Username: Maaarsh

============================================================

To do/Ideas:
* General:
  * ~~How to play instructions~~
  * ~~P to restart game~~
  * ~~Score~~

* Movement
  * ~~W to jump~~
  * ~~S to fast fall~~
  * ~~A to move left~~
  * ~~D to move right~~
  * ~~Can only move between left edge to middle of screen~~
    * ~~Pivoted to left edge to right edge~~
  * When moving right from middle of screen, background moves but player stays in middle
  * When moving left player can move up to edge of screen and background does not move
  * When moving right from left of screen, background does not move until player reaches middle of screen

* Combat
  * ~~Shift to crouch~~
  * ~~J to left punch~~
  * ~~L to right punch~~
  * I to up punch
  * ~~Player health bar~~
  * ~~Space bar to block~~

* Obstacles
  * ~~Enemies come in from right and attack player~~
  * Player has to jump over or crouch under obstacles

* Stretch Goals
  * Fix bugs
  * Enemies target player
  * Weapons
  * ~~Logo~~
  * ~~Sprites & animation~~

============================================================

Bugs:
* Player cannot move left or right when touching enemy
  * Should be: Player can move left but not right when enemy is touching them on the right; Player can move right but not left when enemy is touching them on the left
    * NOTE: Due to time constraints this is now a feature, not a bug

* Right Attack (right arrow key) attacks enemies to the left of the player
  * Should be: Right Attack (right arrow key) attacks enemies to the right of the player; Left Attack (left arrow key) attacks enemies to the left of the player (Left Attack TBC (To Be Coded))

* When player moves one way then, without letting go of intial button, starts holding button for opposite direction then lets go of the most recently pressed button, player stops moving
  * Should be: When player lets go of the 2nd button player goes to moving intial direction

* Constantly checking playerHealth over and over
  * Should be: Unsure but this seems like it would put unnecessary stress on the player's computer

* Player cannot move left or right when not in fullscreen
  * Should be: Player can move left and right regardless of window size

* Player character does not attack at seemingly random times
  * Should be: Player character should always attack in the appropiate direction when the player presses the corresponding button

* Enemies do not spawn if canvas is moved from its orginal location
  * Should be: Enemies spawn regardless of canvas location, would like canvas to be centered

* If player holds any action button (besides left/right attack) and then clicks to another tab, player character will remain doing the corresponding action until that button is pressed again
  * Should be: Stop all actions and/or pause game (not yet a feature) when player tabs out

* Player is unable to attack at all after blocking
  * Should be: Player cannot attack during blocking but can afterward

* Player can hold down attack key to repeatedly attack
  * Should be: Player should have to press the attack for each attack