function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function dsigmoid(y) {
    // return sigmoid(x) * (1 - sigmoid(x));
    return y * (1 - y);
}

class NeuralNetwork {
    constructor(input_nodes, hidden_nodes, output_nodes) {
        this.input_nodes = input_nodes;
        this.hidden_nodes = hidden_nodes;
        this.output_nodes = output_nodes;

        // weights between input and hidden
        this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
        // weights betweew hidden and output
        this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
        this.weights_ih.randomize();
        this.weights_ho.randomize();

        // hidden layer bias
        this.bias_h = new Matrix(this.hidden_nodes, 1);
        // output layer bias
        this.bias_o = new Matrix(this.output_nodes, 1);
        this.bias_h.randomize();
        this.bias_o.randomize();

        // learning rate
        this.learning_rate = 0.1;
    }

    feedforward(inputs_array) {
        // generate hidden outputs
        let inputs = Matrix.fromArray(inputs_array);
        let hidden = Matrix.multiply(this.weights_ih, inputs);
        hidden.add(this.bias_h);
        // activation function
        hidden.map(sigmoid);

        // generate output
        let outputs = Matrix.multiply(this.weights_ho, hidden);
        outputs.add(this.bias_o);
        // activation function
        outputs.map(sigmoid);

        return outputs.toArray();
    }

    train(input_array, target_array) {
        // generate hidden outputs
        let inputs = Matrix.fromArray(input_array);
        let hidden = Matrix.multiply(this.weights_ih, inputs);
        hidden.add(this.bias_h);
        // activation function
        hidden.map(sigmoid);

        // generate output
        let outputs = Matrix.multiply(this.weights_ho, hidden);
        outputs.add(this.bias_o);
        // activation function
        outputs.map(sigmoid);

        // let outputs = this.feedforward(inputs);

        // convert array to Matrix object
        // outputs = Matrix.fromArray(outputs);
        let targets = Matrix.fromArray(target_array);

        // calculate error
        // ERROR = TARGETS - OUTPUTS

        // calculate output errors
        let output_errors = Matrix.subtract(targets, outputs);
        
        // let gradient = outputs * (1 - outputs);
        // calculate gradient
        let gradients = Matrix.map(outputs, dsigmoid);
        gradients.multiply(output_errors);
        gradients.multiply(this.learning_rate);

        // calculate deltas
        let hidden_t = Matrix.transpose(hidden);
        let weights_ho_deltas = Matrix.multiply(gradients, hidden_t);

        // adjust the weights by deltas
        this.weights_ho.add(weights_ho_deltas);
        // sdjust the bias by its deltas
        this.bias_o.add(gradients);

        // calculate hidden layer errors
        // simplify by using weights only, not (w1/w1+w2+...+wn) * e1
        let weights_ho_t =  Matrix.transpose(this.weights_ho);
        let hidden_errors = Matrix.multiply(weights_ho_t, output_errors);
        
        // calculate hidden gradient
        let hidden_gradient = Matrix.map(hidden, dsigmoid);
        hidden_gradient.multiply(hidden_errors);
        hidden_gradient.multiply(this.learning_rate);

        // calculate input -> hidden deltas
        let inputs_t = Matrix.transpose(inputs);
        let weights_ih_deltas = Matrix.multiply(hidden_gradient, inputs_t);

        // adjust the weights by deltas
        this.weights_ih.add(weights_ih_deltas);
        // adjust the bias by its deltas
        this.bias_h.add(hidden_gradient);
    }

}