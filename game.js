export class Game {
 start() {
  if (this.#status === "pending") {
   this.#status = "in-process"
   this.#createUnits()
   this.#runGoogleJumpInterval()
  }
 }

 async stop() {
  clearInterval(this.#googleMovingIntervalId)
  this.#status = "stopped"
 }

 async #finish() {
  clearInterval(this.#googleMovingIntervalId)
  this.#status = "finished"
 }

 //----------------------------------------------------------

 #createUnits2() {
  const maxX = this.#settings.gridSize.width
  const maxY = this.#settings.gridSize.height
  const player1Position = new Position(Position.getNotCrossedPosition([], maxX, maxY))
  this.#player1 = new Player(player1Position, 1)
  const player2Position = new Position(Position.getNotCrossedPosition([player1Position], maxX, maxY))
  this.#player2 = new Player(player2Position, 2)
  const googlePosition = new Position(Position.getNotCrossedPosition([player1Position, player2Position], maxX, maxY))
  this.#google = new Google(googlePosition)
 }

 constructor(eventEmitter) {
  this.eventEmitter = eventEmitter
 }

 #getRandomPosition(coordinates) {
  let newX, newY
  do {
   newX = NumberUtil.getRandomNumber(this.#settings.gridSize.width)
   newY = NumberUtil.getRandomNumber(this.#settings.gridSize.height)
  } while (coordinates.some((el) => el.x === newX && el.y === newY))
  return new Position({ x: newX, y: newY })
 }

 #createUnits() {
  const player1Position = this.#getRandomPosition([])
  //this.#player1 = new Player(1, player1Position)
  this.#player1 = new Player(player1Position, 1)
  const player2Position = this.#getRandomPosition([player1Position])
  this.#player2 = new Player(player2Position, 2)
  //this.#player2 = new Player(2, player2Position)
  this.#moveGoogleToRandomPosition(true)
  console.log(this.#player1)
  console.log(this.#player2)
 }
 #moveGoogleToRandomPosition(excludeGoogle) {
  let notCrossedPosition = [this.#player1.position, this.#player2.position]
  if (!excludeGoogle) {
   notCrossedPosition.push(this.#google.position)
  }
  this.#google = new Google(this.#getRandomPosition(notCrossedPosition))
  this.eventEmitter.emit("unitChangePosition")
 }

 #checkBorders(player, delta) {
  //const newPosition = player.position.clone()
  if (delta.x) {
   return player.position.x + delta.x > this.#settings.gridSize.width || player.position.x + delta.x < 1
  }
  if (delta.y) {
   return player.position.y + delta.y > this.#settings.gridSize.height || player.position.y + delta.y < 1
  }
  return false
 }

 #runGoogleJumpInterval() {
  this.#googleMovingIntervalId = setInterval(() => {
   this.#moveGoogleToRandomPosition()
  }, this.#settings.googleJumpInterval)
 }

 #moveGoogle() {
  const googlePosition = new Position(
   Position.getNotCrossedPosition(
    [this.#player1.position, this.#player2.position, this.#google.position],
    this.#settings.gridSize.width,
    this.#settings.gridSize.height,
   ),
  )
  clearInterval(this.#googleMovingIntervalId)
  this.#google = new Google(googlePosition)
 }

 #checkOtherPlayer(movingPlayer, otherPlayer, delta) {
  const newPosition = movingPlayer.position.clone()
  if (delta.x) {
   return (
    movingPlayer.position.x + delta.x === otherPlayer.position.x && movingPlayer.position.y === otherPlayer.position.y
   )
  }
  if (delta.y) {
   return (
    movingPlayer.position.y + delta.y === otherPlayer.position.y && movingPlayer.position.x === otherPlayer.position.x
   )
  }
  return false
 }

 #checkGoogleCatching(player) {
  // const newPosition = player.position.clone()
  //
  // if (this.#google.position.equal(newPosition)) {
  //  clearInterval(this.#googleMovingIntervalId)
  //  this.#score[player.playerNumber].points += 1
  //  this.#moveGoogle()
  //  this.#runGoogleJumpInterval()
  if (this.#google.position.equal(player.position)) {
   this.score[player.id].points++
   if (this.score[player.id].points === this.#settings.pointsToWin) {
    this.#finish()
    this.google.position = new Position(this.settings.gridSize.width + 1, this.settings.gridSize.height + 1)
    // this.#moveGoogleToRandomPosition()
   } else {
    this.#moveGoogleToRandomPosition()
   }
  }
 }

 #movePlayer(movingPlayer, otherPlayer, delta) {
  const isBorder = this.#checkBorders(movingPlayer, delta)
  const isOtherPlayer = this.#checkOtherPlayer(movingPlayer, otherPlayer, delta)

  if (isBorder || isOtherPlayer) {
   return
  }
  if (delta.x) {
   movingPlayer.position.x = movingPlayer.position.x + delta.x
  }
  if (delta.y) {
   movingPlayer.position.y = movingPlayer.position.y + delta.y
  }

  this.#checkGoogleCatching(movingPlayer)
  this.eventEmitter.emit("unitChangePosition")
  // player.position.x += delta.x
 }

 //-------------------------------------------------------------------

 movePlayer1Right() {
  const delta = { x: 1 }
  this.#movePlayer(this.#player1, this.#player2, delta)
 }

 movePlayer1Left() {
  const delta = { x: -1 }
  this.#movePlayer(this.#player1, this.#player2, delta)
 }

 movePlayer1Up() {
  const delta = { y: -1 }
  this.#movePlayer(this.#player1, this.#player2, delta)
 }

 movePlayer1Down() {
  const delta = { y: 1 }
  this.#movePlayer(this.#player1, this.#player2, delta)
 }

 //----------------------------------------------------------------

 movePlayer2Right() {
  const delta = { x: 1 }
  this.#movePlayer(this.#player2, this.#player1, delta)
 }

 movePlayer2Left() {
  const delta = { x: -1 }
  this.#movePlayer(this.#player2, this.#player1, delta)
 }

 movePlayer2Up() {
  const delta = { y: -1 }
  this.#movePlayer(this.#player2, this.#player1, delta)
 }

 movePlayer2Down() {
  const delta = { y: 1 }
  this.#movePlayer(this.#player2, this.#player1, delta)
 }

 //-----------------------------------------------------------------

 #settings = {
  pointsToWin: 10,
  gridSize: {
   width: 4,
   height: 5,
  },
  googleJumpInterval: 2000,
 }
 #status = "pending"
 #player1
 #player2
 #google
 #score = {
  1: { points: 0 },
  2: { points: 0 },
 }
 #googleMovingIntervalId

 //--------------------------------------------------------------------

 async getPlayer1() {
  return this.#player1
 }

 async getPlayer2() {
  return this.#player2
 }

 async getGoogle() {
  return this.#google
 }

 async getStatus() {
  return this.#status
 }

 async getSettings() {
  return this.#settings
 }

 async getScore() {
  return this.#score
 }

 async setScore(newScore) {
  this.#score = newScore
 }

 async setSettings(newSettings) {
  //this.#settings = newSettings
  this.#settings = { ...this.#settings, ...newSettings }
  this.#settings.gridSize = newSettings.gridSize
   ? { ...this.#settings.gridSize, ...newSettings.gridSize }
   : this.#settings.gridSize
 }
}

class NumberUtil {
 static getRandomNumber(max) {
  return Math.floor(1 + Math.random() * max)
 }
}

class Position {
 constructor(obj) {
  this.x = obj.x
  this.y = obj.y
 }

 static getNotCrossedPosition(coordinates, maxX, maxY) {
  let x, y
  do {
   x = NumberUtil.getRandomNumber(maxX)
   y = NumberUtil.getRandomNumber(maxY)
  } while (coordinates.some((coord) => coord.x === x && coord.y === y))
  return { x, y }
 }

 clone() {
  return new Position({ x: this.x, y: this.y })
 }

 equal(otherPosition) {
  return otherPosition.x === this.x && otherPosition.y === this.y
 }
}

class Unit {
 constructor(position) {
  this.position = position
 }
}

class Google extends Unit {
 constructor(position) {
  super(position)
  {
   this.position = position
  }
 }
}

class Player extends Unit {
 constructor(position, playerNumber) {
  super(position)
  this.playerNumber = playerNumber
  //this.position = position
 }
}

// module.exports = {
//  Game,
// } // export for tests
