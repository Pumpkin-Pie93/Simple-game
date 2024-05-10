const ws = new WebSocket("ws://localhost:3001")

export class GameRemoteProxy {
 ws = null

 constructor(eventEmitter) {
  this.eventEmitter = eventEmitter
  this.ws = new WebSocket("ws://localhost:3001")
 }

 start() {}

 async stop() {}

 movePlayer1Right() {}

 movePlayer1Left() {}

 movePlayer1Up() {
  this.ws.send("hello from front")
 }

 movePlayer1Down() {}

 //----------------------------------------------------------------

 movePlayer2Right() {}

 movePlayer2Left() {}

 movePlayer2Up() {}

 movePlayer2Down() {}

 //--------------------------------------------------

 get player1() {
  return { x: 1, y: 3 }
 }

 get player2() {}

 get google() {}

 get status() {}

 get settings() {
  return { gridSize: { width: 6, height: 5 } }
 }

 get score() {
  return { 1: { points: 10 }, 2: { points: 6 } }
 }

 set settings(newSettings) {}
}
