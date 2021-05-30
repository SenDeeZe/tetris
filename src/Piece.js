const SIZE = 22
const tetrominos = {
  'I': [
    [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0]
  ],
  'J': [
    [1,0,0],
    [1,1,1],
    [0,0,0],
  ],
  'L': [
    [0,0,1],
    [1,1,1],
    [0,0,0],
  ],
  'O': [
    [1,1],
    [1,1],
  ],
  'S': [
    [0,1,1],
    [1,1,0],
    [0,0,0],
  ],
  'Z': [
    [1,1,0],
    [0,1,1],
    [0,0,0],
  ],
  'T': [
    [0,1,0],
    [1,1,1],
    [0,0,0],
  ],
  'П': [
    [1,1,1],
    [1,0,1],
    [0,0,0],
  ]
};

export default class Piece {
  constructor(column, row, color, type) {
    this.row = row
  	this.column = column
  	this.color = color
    this.type = type
    this.matrix = tetrominos[this.type]
  }

  shift(di, dj) {
    this.column += di
    this.row += dj
  }

  draw(ctx) {
    ctx.fillStyle = this.color
    ctx.strokeStyle = this.color
    for(let i = 0; i < this.matrix.length; i++) {
      for(let j = 0; j < this.matrix.length; j++) {
        if (this.matrix[i][j]) {
          const [x, y] = toCoords(this.row + i, this.column + j)
          drawRoundRect(ctx, y, x, 20, 20, 5, true, false)
        }
      }
    }
  }
}

export function toCoords(i, j) {
  return [i * SIZE + 1, j * SIZE + 1]
}

export function drawRoundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === 'undefined') {
    stroke = true
  }
  if (typeof radius === 'undefined') {
    radius = 5
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius}
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0}
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side]
    }
  }
  ctx.beginPath()
  ctx.moveTo(x + radius.tl, y)
  ctx.lineTo(x + width - radius.tr, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
  ctx.lineTo(x + width, y + height - radius.br)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
  ctx.lineTo(x + radius.bl, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
  ctx.lineTo(x, y + radius.tl)
  ctx.quadraticCurveTo(x, y, x + radius.tl, y)
  ctx.closePath()
  if (fill) {
    ctx.fill()
  }
  if (stroke) {
    ctx.stroke()
  }
}