// import * as tf from "@tensorflow/tfjs";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";

export class NeuralNetwork {
  private model: any;
  private input_nodes: any;
  private hidden_nodes: any;
  private output_nodes: any;

  constructor(a: any, b: any, c: any, d?: any) {
    tf.setBackend("webgl");
    if (a instanceof tf.Sequential) {
      this.model = a;
      this.input_nodes = b;
      this.hidden_nodes = c;
      this.output_nodes = d;
    } else {
      this.input_nodes = a;
      this.hidden_nodes = b;
      this.output_nodes = c;
      this.model = this.createModel();
    }
  }

  copy(secondModel: any) {
    // Should only be used when a model is loaded through the website, or local storage
    if (secondModel != null || typeof secondModel != "undefined")
      return tf.tidy((): any => {
        const modelCopy: tf.Sequential = this.createModel();
        let weights: tf.Tensor[] = [];
        weights = secondModel.getWeights();
        const weightCopies: tf.Tensor[] = [];
        for (let i: number = 0; i < weights.length; i++) {
          weightCopies[i] = weights[i].clone();
        }
        modelCopy.setWeights(weightCopies);
        return new NeuralNetwork(
          modelCopy,
          this.input_nodes,
          this.hidden_nodes,
          this.output_nodes
        );
      });
    else
      return tf.tidy((): any => {
        const modelCopy = this.createModel();
        const weights = this.model.getWeights();
        const weightCopies = [];
        for (let i = 0; i < weights.length; i++) {
          weightCopies[i] = weights[i].clone();
        }
        modelCopy.setWeights(weightCopies);
        return new NeuralNetwork(
          modelCopy,
          this.input_nodes,
          this.hidden_nodes,
          this.output_nodes
        );
      });
  }

  mutate(rate: number) {
    // memory management
    tf.tidy(() => {
      // get weights
      const weights: tf.Tensor[] = this.model.getWeights();
      const mutatedWeights = [];
      // loop through all weights
      for (let i = 0; i < weights.length; i++) {
        // weights and weight shape
        let tensor = weights[i];
        let shape = weights[i].shape;
        // get values from tensor
        let values = tensor.dataSync().slice();
        // loop through weights
        for (let j = 0; j < values.length; j++) {
          // random number compared to mutate rate
          if (Math.random() < rate) {
            // mutate
            let w = values[j];
            values[j] = w + (2 * Math.random() - 1);
          }
        }
        // make new tensor
        let newTensor = tf.tensor(values, shape);
        mutatedWeights[i] = newTensor;
      }
      // set mutated weights
      this.model.setWeights(mutatedWeights);
    });
  }

  // memory management
  dispose() {
    this.model.dispose();
  }

  async save(type: number, fileName: string) {
    let saveResult: any;
    // save in browser or download JSON to users computer
    switch (type) {
      case 0:
        saveResult = await this.model.save("localstorage://" + fileName);
        break;
      case 1:
        saveResult = await this.model.save("downloads://" + fileName);
        break;
      default:
        break;
    }
  }

  predict(inputs: Array<number>) {
    // memory management
    return tf.tidy(() => {
      const xs = tf.tensor2d([inputs]);
      const ys = this.model.predict(xs);
      const outputs: any = ys.dataSync();
      return outputs;
    });
  }

  createModel(): tf.Sequential {
    // make tensor
    const model = tf.sequential();
    // make hidden and input nodes for neural network

    const hidden = tf.layers.dense({
      units: this.hidden_nodes,
      inputShape: [this.input_nodes],
      activation: "relu", // TODO: find out what it does
    });

    // add hidden and input nodes to model
    model.add(hidden);
    // make output nodes
    const output = tf.layers.dense({
      units: this.output_nodes,
      activation: "softmax", // all output values equal to 1
    });
    // add output nodes to model
    model.add(output);
    // return model
    return model;
  }

  getModel() {
    return this.model;
  }
  getWeight() {
    return this.model.getWeights().toString();
  }
}
