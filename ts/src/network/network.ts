// network.ts is a TypeScript file that represents the neural network architecture in the project. 


export type NeuralNet = {
  layers: number[]
  weights: number[]
  biases: number[]
  weightOffsets: number[]   // where each layer's weights start
  biasOffsets: number[]
}

  // The createNetwork function is responsible for creating a neural network with the specified number of layers and
  // nodes in each layer. It takes an array of numbers as input, where each number represents the number of nodes 
  // in a corresponding layer. It returns an object representing the neural network.
 
export function createNetwork(layers: number[]): NeuralNet {
  // The weights and biases are stored in flat arrays, where the weights are organized by connections between layers. 
  // The first numbers in the weights array coincide with the connections betwen layer 2,node 1 and each node in 
  // layer 1 and so on.
  const weights: number[] = []
  const biases: number[] = []
  const weightOffsets: number[] = []
  const biasOffsets: number[] = []
  let weightTotal : number = 0
  let biasTotal : number = 0

  for (let layer = 0; layer < layers.length - 1; layer++) {
    const inputNodes = layers[layer]
    const outputNodes = layers[layer + 1]
    for (let j = 0; j < outputNodes; j++) {
      // Each output node has a bias. 
      biases.push(Math.random() * 2 - 1)
      biasOffsets[layer+1] = biasTotal
      
      for (let k = 0; k < inputNodes; k++) {
        // Each connection between nodes in adjacent layers has a weight. 
        weights.push(Math.random() * 2 - 1)
        weightOffsets[layer+1] = weightTotal
      }
    }
    weightTotal += inputNodes * outputNodes
    biasTotal += outputNodes
  }

  return {
    layers,
    weights,
    biases,
    weightOffsets,
    biasOffsets,
  }
}

// countParameters function calculates the total number of parameters (weights and biases) in a neural network based
// on the specified layer configuration. It takes an array of numbers as input, where each number represents the 
// number of nodes in a corresponding layer. The function iterates through the layers and calculates the number of 
// weights and biases for each connection between adjacent layers. The total number of parameters is returned as a 
// single number.

export function countParameters(layers: number[]): number {
  let weightsCount : number = 0
  let biasesCount : number = 0

  for (let i = 0; i < layers.length - 1; i++) {
    const inputNodes = layers[i]
    const outputNodes = layers[i + 1]
    weightsCount += inputNodes * outputNodes
    biasesCount += outputNodes
  }

  return weightsCount + biasesCount
}

export function getWeightIndex(net: NeuralNet, layer: number, node: number, fromNode: number): number {
  return net.weightOffsets[layer] + node * net.layers[layer - 1] + fromNode
}

// The layers array is 0-based. the layer number is 0-based
export function getBiasIndex(net: NeuralNet, layer: number, node: number): number {
  return net.biasOffsets[layer] + node
}

export function getWeight(net: NeuralNet, layer: number, node: number, fromNode: number): number {
  return net.weights[net.weightOffsets[layer] + node * net.layers[layer - 1] + fromNode]
}

// The layers array is 0-based. the layer number is 0-based
export function getBias(net: NeuralNet, layer: number, node: number): number {
  return net.biases[net.biasOffsets[layer] + node]
}
