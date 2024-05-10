import { WebSocketServer } from "ws"

const wssServer = new WebSocketServer({ port: 3001 })

wssServer.on("connection", function connection(tunnel) {
 tunnel.on("error", console.error)

 tunnel.on("message", function message(data) {
  console.log("received: %s", data)
  tunnel.send("hello from server")
 })

 //tunnel.send('something');
})
