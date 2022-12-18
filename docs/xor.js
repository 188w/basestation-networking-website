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
  can