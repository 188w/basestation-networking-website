import { Matrix } from "./matrix";
export declare type ActivationFunction = 'Sigmoid' | 'Relu' | 'Tanh' | 'Softmax';
export declare type Mode = 'sgd' | 'bgd' | 'mbgd';
export declare type NetShape = [number, (number | [number, ActivationFunction]), ...(number | [number, ActivationFunction])[]];
export interface BPNetOptions {
    mode?: Mode;
    rate?: number;
    w?: Matrix[];
    b?: Matrix[];
    scale?: Matrix;
}
export interface TrainingOptions {
    epochs: number;
    batchSize: number;
    async: boolean;
    onBatch?: (batch: number, size: number, loss: numbe