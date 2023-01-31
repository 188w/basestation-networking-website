export declare class Point {
    X: number;
    Y: number;
    constructor(X: number, Y: number);
    contrast(pt: Point): boolean;
}
export declare class Edge {
    start: Point;
    end: Point;
    constructor(cond1: [number, number], cond2: [number, number]);
    minXY(): Point;
    maxXY(): Point;
    testPointIn(pt: Point): 