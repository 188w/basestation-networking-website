import { Matrix } from "../src"

export class Optimize {
  /**
   * 交叉墒代价函数
   * 用于最后一层激活函数是sigmoid
   * 输出值域必须是 {0, 1}
   * - J = 1 / m * ∑m Cost
   * - y = 1 ? Cost = - Math.log(H(X[i]))
   * - y = 0 ? Cost = -Math.log(1 - H(X[i]))
   */
  crossCost(hy: Matrix, ys: Matrix) {
    let m = ys.shape[0]
    let t = hy.atomicOperation((h, i, j) => {
      let y = ys.get(i, j)
      return y === 1 ? -Math.log(h) : -Math.log(1 - h)
    }).columnSum()
    let tmp = t.getRow(0).m