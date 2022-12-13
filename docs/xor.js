import { BPNet, Matrix, toFixed } from './infers.esm.js'

const container = document.getElementById('container')
const canvas = document.getElementById('canvas')
const buts = document.querySelectorAll('#buts button')
const rateNode = document.getElementById('rate')
const modeNode = document.getElementById('mode')

const ctx = canvas.getContext('2d')
let [W, H] = [container.getBoundingClientRect().width, 500]

const model = new BPNet([2, [6