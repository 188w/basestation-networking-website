export interface GenerateMatrixOptions {
  range: [number, number],
  integer?: boolean
}

export class Matrix {
  shape: [number, number]
  private self: number[][]

  constructor(data: number[][]) {
    if (!data[0]) throw new Error('Matrix at least one row')
    let t = data.find((d, i) => data[i - 1] && d.length !== data[i - 1].length)
    if (t) throw new Error('Matrix column inconsistent')
    if (!data[0].length) throw new Error('Matrix has at least one element from row')
    this.shape = [data.length, data[0].length]
    this.self = data
  }

  /**
   * 上下分割矩阵
   */
  slice(start: number, end: number) {
    return new Matrix(this.self.slice(start, end))
  }

  /**
   * 返回行的最大值索引
   */
  argMax(row: number) {
    let d = this.getRow(row)
    let max = d[0]
    let index = 0
    for (let i = 0; i < d.length; i++) {
      if (d[i] > max) {
        max = d[i]
        index = i
      }
    }
 