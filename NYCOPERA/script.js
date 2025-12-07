let points = [];
let mic;
let pg;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    
    // 가상의 캔버스 생성
    pg = createGraphics(width, height);
    pg.textSize(200);
    pg.textAlign(CENTER, CENTER);
    pg.fill(255);
    pg.text("NYCOPERA", width / 2, height / 2);

    // 특정 문자(O)의 픽셀 좌표 찾기
    findPoints();

    // 마이크 입력 설정
    mic = new p5.AudioIn();
    mic.start();
}

function findPoints() {
    pg.loadPixels();
    let d = pixelDensity();
    
    for (let x = 0; x < width; x += 10) {  // 간격 조정 가능
        for (let y = 0; y < height; y += 10) {
            let index = 4 * (y * d * width * d + x * d);
            let brightness = pg.pixels[index]; // R값만 가져옴 (흑백 기준)

            if (brightness > 100) { // 밝기가 일정 이상이면 글자 부분으로 간주
                if (x > width / 2 - 50 && x < width / 2 + 50) { // "O" 부분만 필터링
                    points.push(createVector(x, y));
                }
            }
        }
    }
}

function draw() {
    background(0);

    let vol = mic.getLevel();
    let amp = map(vol, 0, 1, 0, 1);
    
    for (let i = 0; i < points.length; i++) {
        let p = points[i];

        let angle = map(i, 0, points.length, 0, TWO_PI);
        let radius = 100 + amp * 150;
        let targetX = cos(angle) * radius;
        let targetY = sin(angle) * radius;
        
        let x = lerp(p.x, p.x + targetX, amp);
        let y = lerp(p.y, p.y + targetY, amp);

        stroke(255, 100 + amp * 155, 200);
        strokeWeight(2);
        line(p.x, p.y, x, y);
    }
}

// 창 크기 조정 대응
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}