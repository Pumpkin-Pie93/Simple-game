class Game {
 start() {
  if (this.#status === "pending") {
   this.#status = "in-process"
  }
  this.#createUnits()
  this.#runGoogleMovingInterval()
 }

 async stop() {
  clearInterval(this.#googleMovingIntervalId)
  this.#status = "stopped"
 }
 async finish() {
  clearInterval(this.#googleMovingIntervalId)
  this.#status = "finished"
 }

 #runGoogleMovingInterval() {
  this.#googleMovingIntervalId = setInterval(() => {
   this.#moveGoogle()
   //  Position.getNotCrossedPosition(
   //   [this.#player1.position, this.#player2.position, this.#google.position],
   //   this.#settings.gridSize.width,
   //   this.#settings.gridSize.height,
   //  ),
   // )
   // this.#google = new Google(googlePosition)
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

 #checkBorders(player, delta) {
  const newPosition = player.position.clone()
  if (delta.x) newPosition.x += delta.x
  if (delta.y) newPosition.y += delta.y

  if (newPosition.x > this.#settings.gridSize.width || newPosition.x < 1) return true
  if (newPosition.y > this.#settings.gridSize.height || newPosition.y < 1) return true
  return false
 }

 #checkOtherPlayer(movingPlayer, otherPlayer, delta) {
  const newPosition = movingPlayer.position.clone()
  if (delta.x) newPosition.x += delta.x
  if (delta.y) newPosition.y += delta.y

  return otherPlayer.position.equal(newPosition)
 }

 #checkGoogleCatching(player, delta) {
  const newPosition = player.position.clone()
  // if (delta.x) newPosition.x += delta.x
  // if (delta.y) newPosition.y += delta.y

  if (this.#google.position.equal(newPosition)) {
   clearInterval(this.#googleMovingIntervalId)
   this.#score[player.playerNumber].points += 1
   this.#moveGoogle()
   this.#runGoogleMovingInterval()
  }
 }

 #movePlayer(player, otherPlayer, delta) {
  const isBorder = this.#checkBorders(player, delta)
  if (isBorder) return

  const isOtherPlayer = this.#checkOtherPlayer(player, otherPlayer, delta)
  if (isOtherPlayer) return

  if (delta.x) player.position.x += delta.x
  if (delta.y) player.position.y += delta.y

  this.#checkGoogleCatching(player, delta)

  player.position.x += delta.x
 }

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

 //---------
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

 get player1() {
  return this.#player1
 }

 get player2() {
  return this.#player2
 }

 get google() {
  return this.#google
 }

 get status() {
  return this.#status
 }

 get settings() {
  return this.#settings
 }

 get score() {
  return this.#score
 }

 set settings(newSettings) {
  //this.#settings = newSettings
  this.#settings = { ...this.#settings, ...newSettings }
  this.#settings.gridSize = newSettings.gridSize
   ? { ...this.#settings.gridSize, ...newSettings.gridSize }
   : this.#settings.gridSize
 }

 #createUnits() {
  const maxX = this.#settings.gridSize.width
  const maxY = this.#settings.gridSize.height
  const player1Position = new Position(Position.getNotCrossedPosition([], maxX, maxY))
  this.#player1 = new Player(player1Position, 1)
  const player2Position = new Position(Position.getNotCrossedPosition([player1Position], maxX, maxY))
  this.#player2 = new Player(player2Position, 2)
  const googlePosition = new Position(Position.getNotCrossedPosition([player1Position, player2Position], maxX, maxY))
  this.#google = new Google(googlePosition)
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
   ;(x = NumberUtil.getRandomNumber(maxX)), (y = NumberUtil.getRandomNumber(maxY))
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

module.exports = {
 Game,
}
