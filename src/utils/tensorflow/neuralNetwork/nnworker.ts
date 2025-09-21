// import * as tf from "@tensorflow/tfjs";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";

// create 2 tensors and add them up
const a = tf.ones([2, 2]);
const b = tf.ones([2, 2]);
let c = a.add(b);
// post back the result
self.postMessage({ data: c.dataSync() });

onmessage = function (message) {
  console.log("Worker Message: ", message);
};
