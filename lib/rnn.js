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
   