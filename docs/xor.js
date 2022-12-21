import { BPNet, Matrix, toFixed } from './infers.esm.js'

const container = document.getElementById('container')
const canvas = document.getElementById('canvas')
const buts = document.querySelectorAll('#buts button')
const rateNode = document.getElementById('rate')
const modeNode = document.getElementById('mode')

const ctx = canvas.getContext('2d')
let [W, H] = [container.getBoundingClientRect().width, 500]

const model = new BPNet([2, [6, 'Tanh'], [6, 'Tanh'], [2, 'Softmax']], { rate: Number(rateNode.value) })
let xs = new Matrix([[1, 0], [0, 1], [0, 0], [1, 1]])
let ys = new Matrix([[1, 0], [1, 0], [0, 1], [0, 1]])

rateNode.oninput = v => {
  model.rate = Number(v.target.value)
}

modeNode.onchange = v => {
  model.mode = v.target.value
}

function init() {
  W = container.getBoundingClientRect().width
  canvas.width = W
  canvas.height = H
  let hy = model.predictNet(xs)
  let loss = model.calcLoss(xs, ys)
  drawNet(ctx, model, hy, loss)
}

window.onresize = init
init()

buts.forEach(but => {
  but.addEventListener('click', () => {
    if (but.innerHTML === 'TRAIN') {
      but.disabled = true
      let epochs = Number(document.getElementById('epochs').value)
      model.fit(xs, ys, {
        epochs, async: true, onEpoch: (epoch, loss) => {
          let hy = model.predictNet(xs)
          hy[0] = xs
          drawNet(ctx, model, hy, loss, epoch)
        }, onTrainEnd: () => {
          but.disabled = false
        }
      })
      return
    }
    let tmp = but.innerHTML.split(', ').map(v => Number(v))
    let nxs = new Matrix([tmp])
    let loss = model.calcLoss(xs, ys)
    let hy = model.predictNet(nxs)
    hy[0] = nxs
    drawNet(ctx, model, hy, loss)
  })
})

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} x 
 * @param {number} y 
 * @param {number} r 
 * @param {string | number} n 
 */
function drawCircle(ctx, x, y, r, n) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.fillStyle = 'white'
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#222'
  ctx.font = "28px sans-serif";
  ctx.fillText(n, x - 8, y + 11)
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {{x: number, y: number}} p1 
 * @param {{x: number, y: number}} p2 
 */
function drawLine(ctx, p1, p2) {
  ctx.beginPath()
  ctx.moveTo(p1.x, p1.y)
  ctx.lineTo(p2.x, p2.y)
  ctx.stroke()
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 */
function clearCtx(ctx) {
  ctx.fillStyle = "#f6f6f6"
  ctx.fillRect(0, 0, W, H)
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param 