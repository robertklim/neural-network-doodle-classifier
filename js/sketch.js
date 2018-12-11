const len = 784;
const total_data_num = 1000;
const training_data_num = 800;

const CAT = 0;
const RAINBOW = 1;
const TRAIN = 2;

let cats_data;
let trains_data;
let rainbows_data;

let cats = {};
let trains = {};
let rainbows = {};

let nn;

function preload() {
    cats_data = loadBytes('data/cats1000.bin');
    trains_data = loadBytes('data/trains1000.bin');
    rainbows_data = loadBytes('data/rainbows1000.bin');
}

function prepareData(category, data, label) {
    category.training = [];
    category.testing = [];
    for (let i = 0; i < total_data_num; i++) {
        let offset = i * len;
        if (i < training_data_num) {
            category.training[i] = data.bytes.subarray(offset, offset + len);
            category.training[i].label = label;
        } else {
            category.testing[i - training_data_num] = data.bytes.subarray(offset, offset + len);
            category.training[i - training_data_num].label = label;
        }
    }
}

function setup() {
    createCanvas(280, 280);
    background(0);

    // prepare data
    prepareData(cats, cats_data, CAT);
    prepareData(rainbows, rainbows_data, RAINBOW);
    prepareData(trains, trains_data, TRAIN);
    
    nn = new NeuralNetwork(len, 64, 3);

    // randomize data
    let training = [];
    training = training.concat(cats.training);
    training = training.concat(rainbows.training);
    training = training.concat(trains.training);
    shuffle(training, true);

    // train
    for (let i = 0; i < training.length; i++) {
        let inputs = [];
        let data = training[i];
        for (let j = 0; j < data.length; j++) {
            inputs[j] = data[j] / 255.0; // normalize value
        }
        let label = training[i].label;
        // console.log(inputs);
        // console.log(label);
        let targets = [0, 0, 0];
        targets[label] = 1;
        // console.log(targets);
        nn.train(inputs, targets);
    }

    console.log('trained');

    // let total = 100;
    // for (let i = 0; i < total; i++) {
    //     let img = createImage(28, 28);
    //     img.loadPixels();
    //     let offset = i * 784;
    //     for (let j = 0; j < 784 * 4; j++) {
    //         let val = 255 - cats.bytes[j + offset];
    //         img.pixels[j * 4 + 0] = val;
    //         img.pixels[j * 4 + 1] = val;
    //         img.pixels[j * 4 + 2] = val;
    //         img.pixels[j * 4 + 3] = 255;
    //     }
    //     img.updatePixels();
    //     let x = (i % 10) * 28;
    //     let y = floor(i / 10) * 28;
    //     image(img, x, y);
    // }

}

function draw() {

}