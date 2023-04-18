export class Point {
  constructor(public X: number, public Y: number) { }
  contrast(pt: Point) {
    return this.X === pt.X && this.Y === pt.Y
  }
}

export class Edge {
  start: Point
  end: Point
  constructor(cond1: [number, number], cond2: [number, number]) {
    this.start = new Point(cond1[0], cond1[1])
    this.end = new Point(cond2[0], cond2[1])
    if (this.start.contrast(this.end)) {
      throw new Error('两个点不能相同')
    }
  }
  minXY() {
    let X = Math.min(this.start.X, this.end.X)
    let Y = Math.min(this.start.Y, this.end.Y)
    return new Point(X, Y)
  }
  maxXY() {
    let X = Math.max(this.start.X, this.end.X)
    let Y = Math.max(this.start.Y, this.end.Y)
    return new Point(X, Y)
  }
  /**
   * 点是否在边的斜率上
   * @param pt 
   * @returns 
   */
  testPointIn(pt: Point): boolean {
    if (pt.contrast(this.start) || pt.contrast(this.end)) {
      return true
    }
    let slope1 = pt.X - this.start.X === 0 ? Infinity : (pt.Y - this.start.Y) / (pt.X - this.start.X)
    let slope2 = pt.X - this.end.X === 0 ? Infinity : (pt.Y - this.end.Y) / (pt.X - this.end.X)
    return slope1 === slope2
  }
  /**
   * 点内边内
   * @param pt 
   * @returns 
   */
  testPointInside(pt: Point): boolean {
    if (this.testPointIn(pt)) {
      let min = this.minXY()
      let max = this.maxXY()
      return (pt.X >= min.X && pt.X <= max.X) && (pt.Y >= min.Y && pt.Y <= max.Y)
    }
    return false
  }
}

export class Polygon