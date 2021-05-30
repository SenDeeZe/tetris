import {
  toCoords,
  drawRoundRect
} from './Piece'

export default class GameField {
  constructor(rows, columns) {
    this.rows = rows
    this.columns = columns
    this.playfield = []
    for (let row = 0; row < this.rows; row++) {
      this.playfield[row] = [];
      for (let col = 0; col < this.columns; col++) {
        this.playfield[row][col] = {value: 0, color: '#000000'};
      }
    }
    this.gameOver = false
    this.score = 0
    this.speed = 500
  }

  draw(canvas, ctx) {
    for (let row = 0; row < this.playfield.length; row++) {
      for (let col = 0; col < this.playfield[0].length; col++) {  
        if (this.playfield[row][col].value) {
          ctx.fillStyle = this.playfield[row][col].color
          ctx.strokeStyle = this.playfield[row][col].color
          const [x, y] = toCoords(row, col)
          drawRoundRect(ctx, y, x, 20, 20, 5, true, false)
        }
      }
    }

    if (this.gameOver) {
      this.showGameOver(canvas, ctx)
    }
  }

  isValidMove(matrix, cellCol, cellRow) {
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix.length; col++) {
        if (matrix[row][col] && (
            cellCol + col < 0 ||
            cellCol + col === this.playfield[0].length ||
            cellRow + row === this.playfield.length ||
            this.playfield[cellRow + row][cellCol + col].value)
          ) {
            return false
        }
      }
    }
    return true
  }

  placeTetromino(tetromino) {
    for (let row = 0; row < tetromino.matrix.length; row++) {
      for (let col = 0; col < tetromino.matrix.length; col++) {
        if (tetromino.matrix[row][col]) {
          if (tetromino.row + row <= 1) {
           this.gameOver = true
          }
          this.playfield[tetromino.row + row][tetromino.column + col] = {value: 1, color: tetromino.color};
        }
      }
    }
    
    for (let row = this.playfield.length - 1; row >= 0; row--) {
      if (this.playfield[row].every(el => { return el.value === 1 })) {
        this.score += 100
        if (this.speed > 20) {
          this.speed -= 20
        }
        for (let r = row; r > 0; r--) {
          for (let c = 0; c < this.playfield[r].length; c++) {
            this.playfield[r][c] = this.playfield[r-1][c];
          }
        }
        for (let col = 0; col < this.playfield[0].length; col++) {
          this.playfield[0][col] = {value: 0, color: '#000000'}
        }
        row++
      }
    }
  }

  showGameOver(canvas, context) {
    context.fillStyle = 'black';
    context.globalAlpha = 0.75;
    context.fillRect(0, canvas.height / 2 - 60, canvas.width, 140);
    context.globalAlpha = 1;
    context.fillStyle = 'white';
    context.font = '36px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2 - 30);;
    context.fillText(`Score:${this.score}`, canvas.width / 2, canvas.height / 2 + 10);
    context.font = '18px monospace';
    context.fillText('Press R to restart', canvas.width / 2, canvas.height / 2 + 50);
  }
}
