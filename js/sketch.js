const len = 784;
const total_data_num = 1000;
const training_data_num = 800;
const epoch_num = 1;

const CAT = 0;
const RAINBOW = 1;
const TRAIN = 2;

const trainButton = document.getElementById('train');
const testButton = document.getElementById('test');
const guessButton = document.getElementById('guess');

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
            category.testing[i - training_data_num].label = label;
        }
    }
}

// train
function trainEpoch(training) {
    shuffle(training, true);
    for (let i = 0; i < training.length; i++) {
        let data = training[i];
        let inputs = Array.from(data).map(x => x / 255);
        let label = training[i].label;
        // console.log(inputs);
        // console.log(label);
        let targets = [0, 0, 0];
        targets[label] = 1;
        // console.log(targets);
        nn.train(inputs, targets);
    }
}

// test
function testAll(testing) {
    let correct = 0;
    for (let i = 0; i < testing.length; i++) {
        let data = testing[i];
        let inputs = Array.from(data).map(x => x / 255);
        console.log(inputs);
        let label = testing[i].label;
        let guess = nn.feedforward(inputs)
        let classification = guess.indexOf(max(guess));
        // console.log(guess);
        // console.log(classification);
        // console.log(label);
        if (classification === label) {
            correct++;
        }
    }
    let percent = correct / testing.length;
    return percent;
}

function setup() {
    createCanvas(280, 280);
    background(255);

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

    // prepare testing data
    let testing = [];
    testing = testing.concat(cats.testing);
    testing = testing.concat(rainbows.testing);
    testing = testing.concat(trains.testing);
    // console.log(testing);

    let epochCounter = 0;
    
    // button events
    trainButton.addEventListener('click', () => {
        console.log('training...');
        trainEpoch(training);
        epochCounter++;
        console.log('training done: ' + epochCounter + ' epochs');
    });
    testButton.addEventListener('click', () => {
        console.log('testing...');
        let percent = testAll(testing);
        console.log('correct percentage: ' + percent);
    });
    guessButton.addEventListener('click', () => {
        let inputs = [];
        let img = get(); // get pixels from canvas into image
        img.resize(28, 28) // resize
        img.loadPixels();
        for (let i = 0; i < len; i++) {
            let bright = img.pixels[i * 4];
            inputs[i] = (255 - bright) / 255.0;
        }
        let guess = nn.feedforward(inputs);
        console.log(guess);
        let classification = guess.indexOf(max(guess));
        if (classification === CAT) {
            console.log('cat');
        } else if (classification === TRAIN) {
            console.log('train');
        } else if (classification === RAINBOW) {
            console.log('rainbow');
        }
        // image(img, 0, 0);
    });

    // for (let i = 0; i < epoch_num; i++) {
    //     // train
    //     trainEpoch(training);
    //     console.log('epoch #: ' + (i + 1));
    //     // test
    //     let percent = testAll(testing);
    //     console.log('correct percentage: ' + percent);
    // }
    
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
    strokeWeight(8);
    stroke(0);
    if (mouseIsPressed) {
        line(pmouseX, pmouseY, mouseX, mouseY);
    }
}