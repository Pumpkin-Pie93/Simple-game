//const ws = new WebSocket("ws://localhost:3001")

export class GameRemoteProxy {
 ws = null

 constructor(eventEmitter) {
  this.eventEmitter = eventEmitter
  this.ws = new WebSocket("ws://localhost:3001")
 }

 start() {}

 async stop() {}
 //----------------------------Player 1 moving------------------------------
 movePlayer1Right() {}

 movePlayer1Left() {}

 movePlayer1Up() {
  this.ws.send("hello from front")
 }

 movePlayer1Down() {}

 //---------------------------Player 2 moving------------------------------

 movePlayer2Right() {}

 movePlayer2Left() {}

 movePlayer2Up() {}

 movePlayer2Down() {}

 //-------------------------Get/Set----------------------------------------

 async getPlayer1() {
  return { x: 1, y: 3 }
 }

 async getPlayer2() {}

 async getGoogle() {}

 async getStatus() {}

 async getSettings() {
  return { gridSize: { width: 6, height: 5 } }
 }
 async setSettings(newSettings) {}

 async getScore() {
  return { 1: { points: 10 }, 2: { points: 6 } }
 }
 async setScore(newScore) {}
}
