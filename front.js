//import { Game } from "./game.js"
import { EventEmitter } from "./eventEmitter/eventEmitter.js"
import { GameRemoteProxy as Game } from "./game-remote-proxy.js"

const asyncStart = async () => {
 const eventEmitter = new EventEmitter()

 const game = new Game(eventEmitter)

 // game.settings.gridSize = {
 //  width: 6,
 //  height: 5,
 // }

 await game.start()

 const tableElement = document.querySelector("#grid")
 const scoreElement = document.querySelector("#score")

 let renderCounter = 0

 const render = async (counter) => {
  tableElement.innerHTML = ""
  scoreElement.innerHTML = ""

  const settings = await game.getSettings()
  if (counter < renderCounter) {
   console.log("Break")
   return
  }
  const score = await game.getScore()
  if (counter < renderCounter) {
   console.log("Break")
   return
  }
  const google = await game.getGoogle()
  if (counter < renderCounter) {
   console.log("Break")
   return
  }
  const player1 = await game.getPlayer1()
  if (counter < renderCounter) {
   console.log("Break")
   return
  }
  const player2 = await game.getPlayer2()
  if (counter < renderCounter) {
   console.log("Break")
   return
  }

  scoreElement.append(`player1: ${score[1].points} --- player2: ${score[2].points}`)

  for (let y = 1; y <= settings.gridSize.height; y++) {
   const trElement = document.createElement("tr")
   for (let x = 1; x <= settings.gridSize.width; x++) {
    const tdElement = document.createElement("td")

    if (google.position.x === x && google.position.y === y) {
     const googleElement = document.createElement("img")
     googleElement.src = "./assets/google.svg"
     tdElement.appendChild(googleElement)
    }
    if (player1.position.x === x && player1.position.y === y) {
     const player1Element = document.createElement("img")
     player1Element.src = "./assets/player1.svg"
     tdElement.appendChild(player1Element)
    }
    if (player2.position.x === x && player2.position.y === y) {
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
   case "KeyW":
    game.movePlayer2Up()
    break
   case "KeyS":
    game.movePlayer2Down()
    break
   case "KeyA":
    game.movePlayer2Left()
    break
   case "KeyD":
    game.movePlayer2Right()
    break
  }
 })

 game.eventEmitter.on("unitPositionChanged", () => {
  renderCounter++
  render(renderCounter)
 })

 render(renderCounter)
}

asyncStart()
