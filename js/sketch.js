const len = 784;
const total_data_num = 1000;
const training_data_num = 800;

let cats_data;
let trains_data;
let rainbows_data;

let cats = {};
let trains = {};
let rainbows = {};

function preload() {
    cats_data = loadBytes('data/cats1000.bin');
    trains_data = loadBytes('data/trains1000.bin');
    rainbows_data = loadBytes('data/rainbows1000.bin');
}

function prepareData(category, data) {
    category.training = [];
    category.testing = [];
    for (let i = 0; i < total_data_num; i++) {
        let offset = i * len;
        if (i < training_data_num) {
            category.training[i] = data.bytes.subarray(offset, offset + len);
        } else {
            category.testing[i - training_data_num] = data.bytes.subarray(offset, offset + len);
        }
    }
}

function setup() {
    createCanvas(280, 280);
    background(0);

    prepareData(cats, cats_data);
    prepareData(trains, trains_data);
    prepareData(rainbows, rainbows_data);
    
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