import Piece from './Piece'
import GameField from './GameField'

const COLUMNS = 12
const ROWS = 24

const GREEN = '#45FD6B'
const RED = '#FC393E'
const YELLOW = '#FED248'
const BLUE = '#3B73FB'
const GREY = '#DBE1F1'

const COLORS = [
  GREEN,
  RED,
  YELLOW,
  BLUE,
  GREY
]

const types = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
const additionalTypes = ['П'];
let counter = 0
let frames = 0

const gameState = {}

export function init() {
  gameState.activePiece = new Piece(
    getRandomInt(COLUMNS - 4),
    0,
    getRandomColor(), 
    types[getRandomInt(types.length - 1)]
  )

  gameState.field = new GameField(ROWS, COLUMNS)
  gameState.prevSec = 0
}


export function update(time) {
  frames++
  const { prevSec, activePiece, field } = gameState
  if (activePiece) {
    if (prevSec != Math.ceil(time / field.speed)) {
      gameState.prevSec = Math.ceil(time / field.speed)
      if (field.isValidMove(activePiece.matrix, activePiece.column, activePiece.row + 1)) {
        activePiece.shift(0, 1)
      } else {
        field.placeTetromino(activePiece)
        gameState.activePiece = null
      }
    }
  } else if (!field.gameOver){
    counter++
    if (counter % 5 != 0) {
      gameState.activePiece = new Piece(
        getRandomInt(COLUMNS - 4),
        0,
        getRandomColor(),
        types[getRandomInt(types.length - 1)]
      )
    } else {
      gameState.activePiece = new Piece(
        getRandomInt(COLUMNS - 4),
        0,
        getRandomColor(),
        additionalTypes[getRandomInt(additionalTypes.length - 1)]
      )
    }
  }
}

function moveActivePieceRight() {
  const { activePiece, field } = gameState

  if (!activePiece) return

  if (field.isValidMove(activePiece.matrix, activePiece.column + 1, activePiece.row)) {
    activePiece.shift(1, 0)
  }
}

function moveActivePieceLeft() {
  const { activePiece, field } = gameState

  if (!activePiece) return

  if (field.isValidMove(activePiece.matrix, activePiece.column - 1, activePiece.row)) {
    activePiece.shift(-1, 0)
  }
}

function moveActivePieceDown() {
  const { activePiece, field } = gameState

  if (!activePiece) return

  if (!field.isValidMove(activePiece.matrix, activePiece.column, activePiece.row + 1)) {
    field.placeTetromino(activePiece)
    return 
  }
  activePiece.shift(0 ,1)
}

function rotateActivePiece() {
  const { activePiece, field } = gameState

  if (!activePiece) return

  const matrix = rotate(activePiece.matrix)

  if (field.isValidMove(matrix, activePiece.column, activePiece.row)) {
    activePiece.matrix = matrix
  }
}

function restartGame() {
  const field = gameState.field
  gameState.activePiece = null
  field.score = 0
  field.gameOver = false
  field.speed = 300
  for (let row = 0; row < field.rows; row++) {
    for (let col = 0; col < field.columns; col++) {
      field.playfield[row][col] = {value: 0, color: '#000000'};
    }
  }
}

export function draw(canvas, score) {
  const ctx = canvas.getContext('2d')
  const scoreCtx = score.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  scoreCtx.clearRect(0, 0, canvas.width, canvas.height)

  const { activePiece, field } = gameState

  if (activePiece) {
    activePiece.draw(ctx)
  }

  field.draw(canvas, ctx)

  scoreCtx.font = "24px monospace";
  scoreCtx.fillStyle = "#1C9905"
  scoreCtx.fillText(`Score:${field.score}`, 5, 30)
}

function onKeyDown(event) {
  const { key } = event
    if (key === "ArrowRight") {
      moveActivePieceRight()
    } else if (key === "ArrowLeft") {
      moveActivePieceLeft()
    } else if (key === "ArrowDown") {
      moveActivePieceDown()
    } else if (key === "ArrowUp") {
      rotateActivePiece()
    } else if (key === "r" || key === "R" || key === "К" || key === "к") {
      restartGame()
    }
}

document.addEventListener('keydown', onKeyDown)

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

function getRandomColor() {
  return COLORS[getRandomInt(COLORS.length)]
}

function rotate(matrix) {
  const N = matrix.length - 1;
  const result = matrix.map((row, i) =>
    row.map((val, j) => matrix[N - j][i])
  );
  return result;
}
