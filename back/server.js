import { WebSocketServer } from "ws"
import { EventEmitter } from "../eventEmitter/eventEmitter.js"
import { Game } from "../game.js"

const eventEmitter = new EventEmitter()
const game = new Game(eventEmitter)
game.start()
const settings = await game.getSettings()

const wssServer = new WebSocketServer({ port: 3001 })

wssServer.on("connection", function connection(ws) {
 ws.on("error", console.error)

 ws.send(JSON.stringify(settings))

 ws.on("message", function message(data) {
  console.log("received: %s", data)
 })

 //ws.send('something');
})
