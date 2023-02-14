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
        let max = d[0];
        let index = 0;
        for (let i = 0; i < d.length; i++) {
            if (d[i] > max) {
                max = d[i];
                index = i;
            }
        }
        return index;
    }
    connect(b) {
        if (this.shape[1] !== b.shape[1]) {
            throw new Error('列数不统一');
        }
        let tmp = this.dataSync().concat(b.dataSync());
        return new Matrix(tmp);
    }
    zeroed() {
        return this.atomicOperation(_ => 0);
    }
    clone() {
        return new Matrix(this.dataSync());
    }
    getMeanOfRow(row) {
        let tmp = this.getRow(row);
        return tmp.reduce((p, c) => p + c) / tmp.length;
    }
    sum() {
        let s = 0;
        for (let i = 0; i < this.shape[0]; i++) {
            for (let j = 0; j < this.shape[1]; j++) {
                s += this.ge