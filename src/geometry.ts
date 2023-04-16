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
    let X = Math.max(this.start.X, this.en