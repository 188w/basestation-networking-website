import { Matrix } from "./matrix";
import type { TrainingOptions, Mode, BPNetOptions, NetShape } from "./types";
export declare const defaultTrainingOptions: (m: number) => TrainingOptions;
export declare class BPNet {
    readonly shape: NetShape;
    w: Matrix[];
    b: Matrix[];
    hlayer: number;
    scale?: Matrix;
    mode: Mode;
    rate: number;
    constructor(shape: NetShape, opt?: BPNetOptions);
    unit(l: number): number;
    af(l: number): import("./types").ActivationFunction | undefined;
    toJSON(): string;
    static fromJSON(json: string): BPNet;
    forwardPropagation(xs: Ma