"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RNN = void 0;
const src_1 = require("../src");
class RNN {
    constructor(opt) {
        this.indexWord = {};
        this.wordIndex = {};
        this.hidenSize = 10;
        this.finis = '/n';
        this.rate = 0.01;
        this.trainData = opt.trainData;
        if (opt.rate)
            this.rate = opt.rate;
        let temp = Array.from(new Set(this.trainData.map(v => v.split('')).flat(1)));
        for (let i = 0; i < temp.length; i++) {
            this.indexWord[temp[i]] = i;
            this.wordIndex[i] = temp[i];
        }
        this.inputSize = temp.length;
        this.outputSize = this.inputSize + 1;
        this.wordIndex[temp.length] = this.finis;
        this.indexWord[this.finis] = temp.length;
        this.U = src_1.Matrix.generate(this.hidenSize, this.inputSize);
        this.W = src_1.Matrix.generate(this.hidenSize, this.hidenSize);
        this.V = src_1.Matrix.generate(this.outputSize, this.hidenSize);
        this.firstSt = src_1.Matrix.generate(1, this.hidenSize, 0);
    }
    oneHotXs(inputIndex) {
        let xs = src_1.Matrix.generate(1, this.inputSize, 0);
        xs.update(0, inputIndex, 1);
        return xs;
    }
    oneHotYs(outputIndex) {
        let ys = src_1.Matrix.generate(1, this.outputSize, 0);
        ys.update(0, outputIndex, 1);
        return ys;
    }
    generateXs(input) {
        let temp = input.split('');
        return temp.map(s => {
            let nowIndex = this.indexWord[s];
            if (isNaN(nowIndex))
                throw new Error(`checked word non-existent from dictionary is ${s}`);
            return this.oneHotXs(nowIndex);
        });
    }
    generateYs(input) {
        let temp = input.split('');
        return temp.map((_, i) => {
            let nextWord = temp[i + 1] ? temp[i + 1] : this.finis;
            let nextIndex = this.indexWord[nextWord];
            return this.oneHotYs(nextIndex);
        });
    }
    forwardPropagation(xs) {
        let result = [];
        for (let i = 0; i < xs.length; i++) {
            let xst = xs[i];
            let lastSt = i === 0 ? this.firstSt : result[i - 1].st;
            let { st, yt } = this.calcForward(