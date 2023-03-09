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
                s += this.get(i, j);
            }
        }
        return s;
    }
    columnSum() {
        let n = [];
        for (let i = 0; i < this.shape[1]; i++) {
            n.push(this.getCol(i).reduce((p, c) => p + c));
        }
        return new Matrix([n]);
    }
    dataSync() {
        let n = [];
        for (let i = 0; i < this.shape[0]; i++) {
            let m = [];
            for (let j = 0; j < this.shape[1]; j++) {
                m.push(this.get(i, j));
            }
            n.push(m);
        }
        return n;
    }
    equalsShape(b) {
        return this.shape[0] === b.shape[0] && this.shape[1] === b.shape[1];
    }
    equals(b) {
        if (!this.equalsShape(b)) {
            return false;
        }
        for (let i = 0; i < this.shape[0]; i++) {
            for (let j = 0; j < this.shape[1]; j++) {
                if (this.get(i, j) !== b.get(i, j))
                    return false;
            }
        }
        return true;
    }
    static generate(row, col, opt = { range: [-0.5, 0.5] }) {
        let n = [];
        for (let i = 0; i < row; i++) {
            let m = [];
            for (let j = 0; j < col; j++) {
                let v = 0;
                if (typeof opt === 'number') {
                    v = opt;
                }
                else {
                    let [min, max] = [Math.min(...opt.range), Math.max(...opt.range)];
                    let b = min < 0 || max < 0 ? -1 : 0;
                    v = Math.random() * (max - min) + min + b;
                    if (opt.integer) {
                        v = ~~v;
                    }
                }
                m.push(v);
            }
            n.push(m);
        }
        return new Matrix(n);
    }
    update(row, col, val, oper) {
        switch (oper) {
            case '+=':
                this.self[row][col] += val;
                break;
            case '-=':
                this.self[row][col] -= val;
                break;
            case '*=':
                this.self[row][col] *= val;
                break;
            case '/=':
                this.self[row][col] /= val;
                break;
            default:
                this.self[row][col] = val;
        }
    }
    expand(n, position) {
        let m = [];
        for (let i = 0; i < this.shape[0]; i++) {
            let rows = position === 'L' ? [n, ...this.getRow(i)] :
                position === 'R' ? [...this.getRow(i), n] : [...this.getRow(i)]