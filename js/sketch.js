let cats;
let trains;
let rainbows;

function preload() {
    cats = loadBytes('data/cats1000.bin');
    trains = loadBytes('data/trains1000.bin');
    rainbows = loadBytes('data/rainbows1000.bin');
}

function setup() {
    createCanvas(280, 280);
    background(0);
    
    let total = 100;
    for (let i = 0; i < total; i++) {
        let img = createImage(28, 28);
        img.loadPixels();
        let offset = i * 784;
        for (let j = 0; j < 784 * 4; j++) {
            let val = 255 - cats.bytes[j + offset];
            img.pixels[j * 4 + 0] = val;
            img.pixels[j * 4 + 1] = val;
            img.pixels[j * 4 + 2] = val;
            img.pixels[j * 4 + 3] = 255;
        }
        img.updatePixels();
        let x = (i % 10) * 28;
        let y = floor(i / 10) * 28;
        image(img, x, y);
    }

}

function draw() {

}