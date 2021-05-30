import {
  init,
  update,
  draw
} from './tetris'

const canvas = document.getElementById('cnvs')
const score = document.getElementById('score')

const tickLength = 15 //ms
let lastTick
let stopCycle

function run() {
  stopCycle = window.requestAnimationFrame(run)

  const nextTick = lastTick + tickLength
  
    lastTick = nextTick
    update(nextTick)

  draw(canvas, score)
}

lastTick = performance.now()
init()
run()
