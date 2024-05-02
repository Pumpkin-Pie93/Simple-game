const { Game } = require("./game.js")

describe("game test", () => {
 it("init test", () => {
  const game = new Game()

  expect(game.settings.gridSize.width).toBe(4)
  expect(game.settings.gridSize.height).toBe(5)
 })

 it("start test", () => {
  const game = new Game()
  game.settings = {
   gridSize: {
    width: 4,
    height: 5,
   },
  }

  expect(game.settings.gridSize.width).toBe(4)
  expect(game.settings.gridSize.height).toBe(5)
 })
 it("start game", async () => {
  const game = new Game()
  game.settings = {
   gridSize: {
    width: 4,
    height: 5,
   },
  }
  expect(game.status).toBe("pending")

  await game.start()

  expect(game.status).toBe("in-process")
 })
 it("player1 and player2 should have unique coordinates", async () => {
  const game = new Game()
  game.settings = {
   gridSize: {
    width: 1,
    height: 3,
   },
  }
  await game.start()

  expect([1]).toContain(game.player1.position.x)
  expect([1, 2, 3]).toContain(game.player1.position.y)

  expect([1]).toContain(game.player2.position.x)
  expect([1, 2, 3]).toContain(game.player2.position.y)

  expect([1]).toContain(game.google.position.x)
  expect([1, 2, 3]).toContain(game.google.position.y)

  expect(game.google.position.x !== game.player1.position.x) ||
   (game.google.position.y !== game.player1.position.y && game.google.position.x !== game.player2.position.x) ||
   (game.google.position.y !== game.player2.position.y &&
    (game.player1.position.y !== game.player2.position.y || game.player1.position.x !== game.player2.position.x))
 })

 it("check google position after jump", async () => {
  const game = new Game()
  game.settings = {
   gridSize: {
    width: 1,
    height: 4,
   },
   googleJumpInterval: 100,
  }
  await game.start()

  const prevPosition = game.google.position.clone()
  await delay(150)

  expect(game.google.position.equal(prevPosition)).toBe(false)
 })
 it("catch google by player1 or player2 for one row", async () => {
  for (let i = 0; i < 10; i++) {
   const game = new Game()
   game.settings = {
    gridSize: {
     width: 3,
     height: 1,
    },
    googleJumpInterval: 100,
   }
   await game.start()
   // p1 p2 g | p1 g p2 | p2 p1 g | p2 g p1 | g p1 p2 | g p2 p1

   const deltaForPlayer1 = game.google.position.x - game.player1.position.x

   if (Math.abs(deltaForPlayer1) === 2) {
    const deltaForPlayer2 = game.google.position.x - game.player2.position.x
    if (deltaForPlayer2 > 0) {
     game.movePlayer2Right()
    } else {
     game.movePlayer2Left()
    }
    expect(game.score[1].points).toBe(0)
    expect(game.score[2].points).toBe(1)
   } else {
    if (deltaForPlayer1 > 0) {
     game.movePlayer1Right()
    } else {
     game.movePlayer1Left()
    }
    expect(game.score[1].points).toBe(1)
    expect(game.score[2].points).toBe(0)
   }
  }
 })
 it("check first or second player won", async () => {
  let game = new Game()
  game.settings = {
   pointsToWin: 3,
   gridSize: {
    width: 3,
    height: 1,
   },
   googleJumpInterval: 100,
  }
  game.score = {
   1: { points: 0 },
   2: { points: 0 },
  }

  await game.start()

  // p1 p2 g | p1 g p2 | p2 p1 g | p2 g p1 | g p1 p2 | g p2 p1

  const deltaForPlayer1 = game.google.position.x - game.player1.position.x

  if (Math.abs(deltaForPlayer1) === 2) {
   const deltaForPlayer2 = game.google.position.x - game.player2.position.x
   if (deltaForPlayer2 > 0) {
    game.movePlayer2Right()
    game.movePlayer2Left()
    game.movePlayer2Right()
   } else {
    game.movePlayer2Left()
    game.movePlayer2Right()
    game.movePlayer2Left()
   }
   expect(game.score[1].points).toBe(0)
   expect(game.score[2].points).toBe(3)
  } else {
   if (deltaForPlayer1 > 0) {
    game.movePlayer1Right()
    game.movePlayer1Left()
    game.movePlayer1Right()
   } else {
    game.movePlayer1Left()
    game.movePlayer1Right()
    game.movePlayer1Left()
   }
   expect(game.score[1].points).toBe(3)
   expect(game.score[2].points).toBe(0)
  }
  expect(game.status).toBe("finished")
 })
})

const delay = (ms) => {
 return new Promise((res) => {
  setTimeout(res, ms)
 })
}
