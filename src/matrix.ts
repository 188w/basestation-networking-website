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
    this.shape