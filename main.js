let counter = 0;
let timer = 10;
let texts = [];
let score = 10;
let paused = false;
let moves = 0;

const NUM_BG_TEXTS = 25
const BG_STR = "one"
const BG_TSIZE = 50
const DEFAULT_VEL = 1.5
const TALLY_WDT = 10;
const TALLY_HT = 50;
const TALLY_SPACING = 10;
const INPUT_SIZE = 80;

const Operations = {
    add: "+",
    subtract: "-",
    divide: "/",
    multiply: "*"
}
let qn;

const helpText = ""


function dictToArr(dict) {
    var keys = Object.keys(dict);
    var values = keys.map(
        function (v) {
            return dict[v];
        }
    );

    return values;
}

let bgm;
let tick;
let win;

function preload() {
    bgm = loadSound("assets/Alexander_Ehlers_Warped.mp3");
    tick = loadSound("assets/alexsani_tick.wav");
    win = loadSound("assets/win.wav");
}


function setup() {
    frameRate(60);
    createCanvas(600, 600);

    foo = createElement("h2", "hi");
    foo.position(innerWidth * 0.45, height * 0.575);

    opnH2 = createElement("h2", window.opn);
    opnH2.position(innerWidth * 0.49, height * 0.575);

    input = createElement('h2', "__");
    input.size(INPUT_SIZE);
    input.position(innerWidth * 0.53, height * 0.575);

    button = createButton('GO!');
    button.position(innerWidth / 2 - button.width / 2, height * 0.70);
    button.mousePressed(calc);

    help = createElement('a', '<u>Help/About</u>');
    help.position(innerWidth * 0.54, innerHeight * 0.96);

    help.mousePressed(function () {
        alert("To play:\npress one of the three choice buttons and hit go.\n" +
        "apply arithmetic operations in order to get a one as your final answer.\n" +
        "m to mute sounds and p to pause.\n" +
        "you lose or gain points depending on how much time you take to answer, so better be quick!\n" +
        "tallies turn dark for negative values, and have a maximum value of 25, so if a result is > 25 the value is restricted to 25\n" +
        "\nMade in p5.js for GMTK Jam 2019.");
    })

    help = createElement('a', '<u>Credits</u>');
    help.position(innerWidth * 0.46, innerHeight * 0.96);

    help.mousePressed(function () {
        alert("Uses Alexander Ehler's Free Music Pack from opengameart.org\n" +
              "Clock tick sound from https://freesound.org/people/Alexsani/sounds/117280/\n" +
              "win sound from https://freesound.org/people/GameAudio/sounds/220184/\n" + 
              "Text font is Titillium Web");
    })


    regenForm();

    reload = createButton("Reload (-5)");
    reload.position(innerWidth * 0.5 - 100, innerHeight * 0.85);
    reload.mousePressed(function () {
        regenForm();
        score -= 5;
    });

    qn = new currentQuestion();
    qn.gen();

    for (let i = 0; i < NUM_BG_TEXTS; i++) {
        texts.push(new bgText(randomInt(0, width - 40), randomInt(0, height - 40), BG_STR, BG_TSIZE));
    }

    textAlign(CENTER);
    bgm.loop();
}

function regenForm () {
    window.opn = choose(dictToArr(Operations));
    let a = randomInt(-3, 0);
    btn1 = createButton(a.toString());
    btn1.position(innerWidth * 0.2, innerHeight * 0.75);
    btn1.mousePressed(b1);

    let b = randomInt(1, 4);
    btn2 = createButton(b.toString());
    btn2.position(innerWidth * 0.4, innerHeight * 0.75);
    btn2.mousePressed(b2);

    let c = randomInt(5, 9);
    btn3 = createButton(c.toString());
    btn3.position(innerWidth * 0.6, innerHeight * 0.75);
    btn3.mousePressed(b3);

    input.html("__");
}
function b1() {
    input.html(btn1.html());
}

function b2() {
    input.html(btn2.html());
}

function b3() {
    input.html(btn3.html());
}

function b4() {
    input.html(btn4.html());
}

function calc() {
    let ans = 0;

    moves += 1;

    let a = parseInt(foo.html());
    let b = parseInt(input.html());

    let sum = a + b;
    let diff = a - b;
    let prod = a * b;
    let quo = (a - (a % b)) / b;

    switch (window.opn) {
        case Operations.add:
            ans = sum;
            break;
        case Operations.subtract:
            ans = diff;
            break;
        case Operations.multiply:
            ans = prod;
            break;
        case Operations.divide:
            ans = quo;
            break;
    }

    ans = Math.floor(ans);
    ans = constrain(ans, -25, 25);

    input.html("__");

    if (!isNaN(ans)) {
        qn.num = ans;
        
        regenForm();

        if (timer <= 2) {
            score += 30;
        }

        else if (timer <= 5) {
            score += 20;
        }

        else if (timer <= 9) {
            score += 10;
        }

        timer = 0;
    }

    else {
        alert("Man, pick a number first!");
    }
}

function draw() {
    if (!paused) {
        background(47, 47, 47);
        for (let x of texts) {
            x.update();
            x.draw();
        }

        if (frameCount % 60 == 0) {
            counter += 1;
            timer++;
            tick.play();
        }

        if (timer == 10) {
            timer = 0;
            score -= 10;
        }

        foo.html(qn.num);
        opnH2.html(window.opn);
        fill(0, 49, 87);
        noStroke();
        rect(204, 324, 196, 50);
        rect(0, 114, width, TALLY_HT + 10)
        qn.draw();
        fill(253, 246, 227);
        text(10 - timer, width * 0.5, height * 0.4);

        textSize(20);
        text(`Score: ${score}`, width * 0.12, height * 0.10);
        text(`Moves: ${moves}`, width * 0.88, height * 0.10);

        if (qn.num == 1) {
            let str;
            if (moves == 0) {
                str = "You lucky person! Didn't even have to make any moves."
            }
            else if (moves < 4) {
                str = "You must be a right whiz at math!"
            }
            else if (moves < 8) {
                str = "You're doin' middlin' well!"
            }
            else {
                str = "*sigh* Some work is needed."
            }

            alert(`You've won!\n Score: ${score} Moves: ${moves}\n${str}`);
            win.play();
            score = 0;
            timer = 0;
            moves = 0;
            qn.gen();
            bgm.loop();
        }

        if (qn.num <= 5) {

        }
    }

    else {
        if (bgm.isPlaying()) {
            bgm.stop();
        }

        text("PAUSED", width/2, height/2);
    }
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function bgText(x, y, str, size) {
    this.x = x;
    this.y = y;

    this.vel = {}
    this.vel.x = choose([-1 * Math.random(), Math.random()]) * DEFAULT_VEL;
    this.vel.y = choose([-1 * Math.random(), Math.random()]) * DEFAULT_VEL;
    this.str = str;
    this.size = size;
    this.color = color(randomInt(0, 128), 128, 128)


    this.update = function () {
        this.x += this.vel.x;
        this.y += this.vel.y;

        if (this.x > 560 || this.x < 0) {
            this.vel.x *= -1;
        }

        if (this.y > 560 || this.y < 0) {
            this.vel.y *= -1;
        }
    }

    this.draw = function () {
        textSize(this.size);
        push();
        fill(this.color);
        text(this.str, this.x, this.y + this.size);
        pop();
    }
}

/* function mouseClicked() {
    console.log(`${mouseX} ${mouseY}`)
} */

function choose(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

function currentQuestion() {

    this.gen = function () {
        this.answered = false;
        this.num = randomInt(-25, 25);
        if (this.num == 0) {
            while (this.num == 0) {
                this.num = randomInt(-40, 40);
            }
        }
    }

    this.draw = function () {
        let totalWdt = Math.abs(this.num) * (TALLY_WDT + TALLY_SPACING);
        let start_x = (width - totalWdt) / 2;
        let start_y = height * 0.2;

        let x = start_x;
        let y = start_y;
        noStroke();
        if (this.num > 0)
            fill(64, 94, 91);
        else if (this.num < 0)
            fill(15, 21, 82);
        for (let i = 1; i <= Math.abs(this.num); i++) {
            if (!(i % 5 == 0))
                rect(x, y, TALLY_WDT, TALLY_HT);
            else {
                rect(x - 4 * (TALLY_WDT + TALLY_SPACING) - 10, y + 20, TALLY_HT + 40, TALLY_WDT);
            }
            x += TALLY_WDT + TALLY_SPACING;
        }


    }
}

function keyPressed() {
    if (key == 'p') {
        paused = !paused;
        if(bgm.isPlaying()) {
            bgm.pause();
        }
        else {
            bgm.play();
        }
    }

    if (key == 'm') {
        if(bgm.isPlaying()) {
            bgm.pause();
        }
        else {
            bgm.play();
        }
    }
}