"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.afd = exports.afn = exports.upset = exports.toFixed = void 0;
const matrix_1 = require("./matrix");
function toFixed(num, fix) {
    const amount = 10 ** fix;
    return ~~(num * amount) / amount;
}
exports.toFixed = toFixed;
function upset(xs, ys) {
    let xss = xs.dataSync();
    let yss = ys.dataSync();
    for (let i = 1; i < ys.shape[0]; i++) {
        let random = Math.floor(Math.random() * (i + 1));
        [xss[i], xss[random]] = [xss[random], xss[i]];
        [yss[i], yss[r