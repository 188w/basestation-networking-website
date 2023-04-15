import { ActivationFunction } from "./types";
import { Matrix } from "./matrix";

/**
 * 按小数位向下取整
 * @param num 源
 * @param fix 位
 */
export function toFixed(num: number, fix: number): number {
  const amount = 10 ** fix
  return ~~(num * amount) / amount
}

/**
 * 打乱特征和标签矩阵，
 * 两个矩阵行数必须统一
 */
export function upset(xs: Matrix, ys: Matrix) {
  let xss = xs.dataSync()
  let yss = ys.dataSync()
  for (let i = 1; i < ys.shape[0]; i++) {
    let random = Math.floor(Math.random() * (i + 1))