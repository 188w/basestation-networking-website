
import { upset, afd, afn } from "./common"
import { Matrix } from "./matrix"
import type {
  TrainingOptions, Mode, BPNetOptions, NetShape
} from "./types"

export const defaultTrainingOptions = (m: number): TrainingOptions => ({
  epochs: 100,
  batchSize: m > 10 ? 10 : m,
  async: false
})

export class BPNet {
  /**权值*/
  w: Matrix[]
  /**偏值*/
  b: Matrix[]
  /**隐藏层层数*/
  hlayer: number
  /**缩放比*/
  scale?: Matrix
  /**梯度更新模式*/
  mode: Mode = 'sgd'
  /**学习率*/
  rate: number = 0.01
  constructor(
    public readonly shape: NetShape,
    opt: BPNetOptions = {}
  ) {
    this.hlayer = shape.length - 1
    if (this.hlayer < 1) {
      throw new Error('The network has at least two layers')
    }
    //初始化权值偏值
    this.w = []
    this.b = []
    for (let l = 0; l < this.hlayer; l++) {