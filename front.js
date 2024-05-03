import { Game } from "./game.js"
import { EventEmitter } from "./eventEmitter/eventEmitter.js"

const asyncStart = async () => {
 const eventEmitter = new EventEmitter()

 const game = new Game(eventEmitter)

 game.settings.gridSize = {
  width: 6,
  height: 5,
 }

 await game.start()

 console.log(game.player1.position)

 const tableElement = document.querySelector("#grid")

 const render = () => {
  tableElement.innerHTML = ""
  for (let y = 1; y <= game.settings.gridSize.height; y++) {
   const trElement = document.createElement("tr")
   for (let x = 1; x <= game.settings.gridSize.width; x++) {
    const tdElement = document.createElement("td")

    if (game.google.position.x === x && game.google.position.y === y) {
     const googleElement = document.createElement("img")
     googleElement.src = "./assets/google.svg"
     tdElement.appendChild(googleElement)
    }
    if (game.player1.position.x === x && game.player1.position.y === y) {
     const player1Element = document.createElement("img")
     player1Element.src = "./assets/player1.svg"
     tdElement.appendChild(player1Element)
    }
    if (game.player2.position.x === x && game.player2.position.y === y) {
     const player2Element = document.createElement("img")
     player2Element.src = "./assets/player2.svg"
     tdElement.appendChild(player2Element)
    }
    trElement.appendChild(tdElement)
   }
   tableElement.appendChild(trElement)
  }
 }

 window.addEventListener("keydown", (e) => {
  switch (e.code) {
   case "ArrowUp":
    game.movePlayer1Up()
    break
   case "ArrowDown":
    game.movePlayer1Down()
    break
   case "ArrowLeft":
    game.movePlayer1Left()
    break
   case "ArrowRight":
    game.movePlayer1Right()
    break
  }
 })

 game.eventEmitter.on("unitChangePosition", () => {
  render()
 })

 render()
}

asyncStart()