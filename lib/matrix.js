"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Matrix = void 0;
class Matrix {
    constructor(data) {
        if (!data[0])
            throw new Error('Matrix at least one row');
        let t = data.find((d, i) => data[i - 1] && d.length !== data[i - 1].length);
        if (t)
            throw new Error('Matrix column inconsistent');
        if (!data[0].length)
            throw new Error('Matrix has at least one element from row');
        this.shape = [data.length, data[0].length];
        this.self = data;
    }
    slice(start, end) {
        return new Matrix(this.self.slice(start, end));
    }
    argMax(row) {
        let d = this.getRow(row);
        let max = d[0]