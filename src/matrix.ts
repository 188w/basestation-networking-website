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
    return index
  }

  /**
   * 连接两个矩阵
   * 从底部连接
   */
  connect(b: Matrix) {
    if (this.shape[1] !== b.shape[1]) {
      throw new Error('Matrix column inconsistent')
    }
    let tmp = this.dataSync().concat(b.dataSync())
    return new Matrix(tmp)
  }

  /**
   * 返回新的归零矩阵
   */
  zeroed() {
    return this.atomicOperation(_ => 0)
  }

  /**
   * 克隆当前矩阵
   */
  clone() {
    return new Matrix(this.dataSync())
  }

  /**
   * 获取某一行的均值
   * @param row
   */
  getMeanOfRow(row: number) {
    let tmp = this.getRow(row)
    return tmp.reduce((p, c) => p + c) / tmp.length
  }

  /**
   * 矩阵所有值求和
   */
  sum() {
    let s = 0
    for (let i = 0; i < this.shape[0]; i++) {
      for (let j = 0; j < this.shape[1]; j++) {
        s += this.get(i, j)
      }
    }
    return s
  }

  /**
   * 矩阵mxn每列求和
   * @returns Matrix 1 x n
   */
  columnSum() {
    let n = []
    for (let i = 0; i < this.shape[1]; i++) {
      n.push(this.getCol(i).reduce((p, c) => p + c))
    }
    return new Matrix([n])
  }

  /**
   * 返回拷贝后的二维数组
   */
  dataSync() {
    let n = []
    for (let i = 0; i < this.shape[0]; i++) {
      let m = []
      for (let j = 0; j < this.shape[1]; j++) {
        m.push(this.get(i, j))
      }
      n.push(m)
    }
    return n
  }

  /**
   * 对比矩阵的形状
   * @param b 
   */
  equalsShape(b: Matrix) {
    return this.shape[0] === b.shape[0] && this.shape[1] === b.shape[1]
  }

  /**
   * 对比两个矩阵
   * @param b 
   */
  equals(b: Matrix) {
    if (!this.equalsShape(b)) {
      return false
    }
    for (let i = 0; i < this.shape[0]; i++) {
      for (let j = 0; j < this.shape[1]; j++) {
        if (this.get(i, j) !== b.get(i, j)) return false
      }
    }
    return true
  }

  /**
   * 生成nxn单位矩阵
   * @param row 
   */
  static generateIdentity(row: number) {
    let t = this.generate(row, row, 0)
    let col = 0
    for (let n = 0; n < t.shape[0]; n++) {
      t.update(n, col++, 1)
    }
    return t
  }

  /**
   * 生成矩阵
   * @param row 
   * @param col 
   * @param opt //默认为-0.5 ~ 0.5随机值
   */
  static generate(row: number, col: number, opt: GenerateMatrixOptions | number = { range: [-0.5, 0.5] }) {
    let n = []
    for (let i = 0; i < row; i++) {
      let m = []
      for (let j = 0; j < col; j++) {
        let v = 0
        if (typeof opt === 'number') {
          v = opt
        } else {
          let [min, max] = [Math.min(...opt.range), Math.max(...opt.range)]
          let b = min < 0 || max < 0 ? -1 : 0
          v = Math.random() * (max - min) + min + b
          if (opt.integer) {
            v = ~~v
          }
        }
        m.push(v)
      }
      n.push(m)
    }
    return new Matrix(n)
  }

  /**
   * 更新原矩阵
   * @param row 
   * @param col 
   * @param val 
   * @param oper 
   */
  update(row: number, col: number, val: number, oper?: '+