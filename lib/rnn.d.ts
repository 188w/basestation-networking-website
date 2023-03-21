import { Matrix } from '../src';
import type { RNNOptions, RNNTrainingOptions, RNNForwardResult } from './types';
export declare class RNN {
    U: Matrix;
    W: Matrix;
    V: Matrix;
    indexWord: {
        [index: string]: number;
    };
    wordIndex: {
        [index: number]: string;
    };
    trainData: string[];
    inputSize: number;
    output