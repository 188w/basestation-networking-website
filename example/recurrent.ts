
class Tool {
  //返回数组中最大值的索引
  static maxi(w: number[]) {
    let maxv = w[0]
    let maxix = 0
    for (let i = 1; i < w.length; i++) {
      let v = w[i]
      if (v > maxv) {
        maxix = i
        maxv = v
      }
    }
    return maxix;
  }

  static softmax(m: Mat) {
    let out = new Mat(m.n, m.d); // probability volume
    let maxval = -999999;
    for (let i = 0, n = m.w.length; i < n; i++) { if (m.w[i] > maxval) maxval = m.w[i]; }

    let s = 0.0;
    for (let i = 0, n = m.w.length; i < n; i++) {
      out.w[i] = Math.exp(m.w[i] - maxval);
      s += out.w[i];
    }
    for (let i = 0, n = m.w.length; i < n; i++) { out.w[i] /= s; }

    return out;
  }
}

class Mat {
  w: number[]
  dw: number[] //对应求导
  constructor(
    public n: number, // rows
    public d: number //columns
  ) {
    this.w = new Array<number>(n * d).fill(0)
    this.dw = new Array<number>(n * d).fill(0)
  }

  static RandMat(n: number, d: number, std: number) {
    let m = new Mat(n, d)
    for (let i = 0; i < m.w.length; i++) {
      m.w[i] = 2 * std * Math.random() - std
    }
    return m
  }
}

function forwardRNN(G: Graph, model: Model, hidden_size: number, x: Mat, prev_hidden?: Mat) {
  prev_hidden = prev_hidden ? prev_hidden : new Mat(hidden_size, 1)

  let input_vector = x
  let hidden_prev = prev_hidden

  let h0 = G.mul(model['Wxh'], input_vector)
  let h1 = G.mul(model['Whh'], hidden_prev)

  let hidden = G.relu(G.add(G.add(h0, h1), model['bhh']))

  let output = G.add(G.mul(model['Whd'], hidden), model['bd']);
  return { 'h': hidden, 'o': output };
}

class Graph {
  backprop: (() => void)[] = []
  constructor(public needs_backprop: boolean) { }

  backward() {
    for (let i = this.backprop.length - 1; i >= 0; i--) {
      this.backprop[i]()
    }
  }

  rowPluck(m: Mat, ix: number) {
    let d = m.d;
    let out = new Mat(d, 1)
    for (let i = 0, n = d; i < n; i++) { out.w[i] = m.w[d * ix + i]; } // copy

    if (this.needs_backprop) {
      let backward = function () {
        for (let i = 0, n = d; i < n; i++) { m.dw[d * ix + i] += out.dw[i]; }
      }
      this.backprop.push(backward);
    }
    return out;
  }

  relu(m: Mat) {
    let out = new Mat(m.n, m.d);
    let n = m.w.length;
    for (let i = 0; i < n; i++) {
      out.w[i] = Math.max(0, m.w[i]); // relu
    }
    if (this.needs_backprop) {
      let backward = function () {
        for (let i = 0; i < n; i++) {
          m.dw[i] += m.w[i] > 0 ? out.dw[i] : 0.0;
        }
      }
      this.backprop.push(backward);
    }
    return out;
  }

  mul(m1: Mat, m2: Mat) {
    let n = m1.n;
    let d = m2.d;
    let out = new Mat(n, d);
    for (let i = 0; i < m1.n; i++) { // loop over rows of m1
      for (let j = 0; j < m2.d; j++) { // loop over cols of m2
        let dot = 0.0;
        for (let k = 0; k < m1.d; k++) { // dot product loop
          dot += m1.w[m1.d * i + k] * m2.w[m2.d * k + j];
        }
        out.w[d * i + j] = dot;
      }
    }

    if (this.needs_backprop) {
      let backward = function () {
        for (let i = 0; i < m1.n; i++) { // loop over rows of m1
          for (let j = 0; j < m2.d; j++) { // loop over cols of m2
            for (let k = 0; k < m1.d; k++) { // dot product loop
              let b = out.dw[d * i + j];
              m1.dw[m1.d * i + k] += m2.w[m2.d * k + j] * b;
              m2.dw[m2.d * k + j] += m1.w[m1.d * i + k] * b;
            }
          }