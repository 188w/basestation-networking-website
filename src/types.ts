import { Matrix } from "./matrix"

/**激活函数类型*/
export type ActivationFunction = 'Sigmoid' | 'Relu' | 'Tanh' | 'Softmax'

/**梯度更新方式*/
export type Mode = 'sgd' | 'bgd' | 'mbgd'

/**网络形状*/
export ty