import { WebSocketServer } from "ws"
import { EventEmitter } from "../eventEmitter/eventEmitter.js"
import { Game } from "../game.js"

const eventEmitter = new EventEmitter()
const game = new Game(eventEmitter)

const settings = await game.getSettings()

game.start()

const wssServer = new WebSocketServer({ port: 3001 })

wssServer.on("connection", function connection(ws) {
 game.eventEmitter.subscribe("unitPositionChanged", () => {
  const message = {
   type: "event",
   eventName: "unitPositionChanged",
  }
  ws.send(JSON.stringify(message))
 })

 ws.send(JSON.stringify(settings))

 ws.on("message", async function message(data) {
  const action = JSON.parse(data)
  const result = await game[action.procedure]()

  const response = {
   procedure: action.procedure,
   result: result,
   type: "response",
  }

  ws.send(JSON.stringify(response))

  console.log("received: %s", data)
 })

 //ws.send('something');
})
