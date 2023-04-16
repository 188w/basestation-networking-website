export class Point {
  constructor(public X: number, public Y: number) { }
  contrast(pt: Point) {
    return this.X === pt.X && this.Y === pt.Y
  }
}

export class Edge {
  start: Point
  end: Point
  