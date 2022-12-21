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
    drawNet(ctx