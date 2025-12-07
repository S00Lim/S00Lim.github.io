// ===== 공통 설정 =====
let font;
let centers = [];

// 텍스트 내용
let textContent = "A";

// 텍스트 레이아웃 컨트롤
let textSizeVal = 500;      // 글자 크기
let letterSpacingVal = 40;  // 글자 간격
let lineLeadingVal = 80;    // 줄 간격

// 레이아웃 모드
let layoutMode = "Block";   // Block / Circle / Arc
let layoutRadius = 250;     // Circle/Arc 반지름
let arcSpanDeg = 180;       // Arc 스팬(도 단위)

// Ripple 관련
let radiusMin = 13;
let radiusMax = 90;
let step = 20;
let spacing = 70;

let rippleProgress = 1;
let rippleSpeed = 0.02;
let easingMode = "Linear";
let rippleDirection = "Inside-Out";  // Inside-Out / Outside-In

// 애니메이션 모드
let animMode = "Manual";   // Manual / Loop / PingPong
let animating = false;
let pingForward = true;

// 스타일 관련
let strokeW = 1.5;
let colorPalette = "Black";
let perCharColor = false;   // 글자마다 색 다르게
let shapeMode = "Circle";   // Circle / LineX / LineY / Rect / Triangle / Dot
let drawMode = "Stroke";    // Stroke / Fill

// 블렌딩 모드
let blendModeName = "Normal";  // Normal / Add / Multiply / Screen / Lightest / Darkest

// 배경색
let bgColor;
let bgPicker;

// A~Z 테스트용
let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let currentIndex = 0;

// 캔버스 참조
let canvas;

// ===== UI 요소 =====
let panelDiv;

// 텍스트 입력
let textArea;
let applyButton;
let exportButton;

// 아코디언: Text Layout
let layoutHeaderDiv;
let layoutBodyDiv;
let layoutOpen = true;

// 아코디언: Ripple Style
let styleHeaderDiv;
let styleBodyDiv;
let styleOpen = true;

// 레이아웃 관련 UI
let layoutSelect;
let layoutRadiusRow;
let arcSpanRow;

// 슬라이더/인풋 row들
let radiusMinRow, radiusMaxRow, stepRow, spacingRow;
let strokeWRow, speedRow;
let textSizeRow, letterSpacingRow, leadingRow;

// 팔레트 & 이징 & 방향 & per-char & anim 모드 & shape & drawmode & blend
let paletteSelect;
let easingSelect;
let directionSelect;
let perCharCheckbox;
let animSelect;
let shapeSelect;
let drawModeSelect;
let blendModeSelect;

// 타임라인 슬라이더
let timelineSlider;

function preload() {
  font = loadFont('Montserrat-VariableFont_wght.ttf');
}

function setup() {
  // 캔버스 오른쪽, 패널 왼쪽
  canvas = createCanvas(800, 800);
  canvas.position(280, 10);

  noFill();
  stroke(0, 70);
  strokeWeight(strokeW);

  bgColor = color(255);

  // ===== 왼쪽 패널 박스 =====
  panelDiv = createDiv();
  panelDiv.position(10, 10);
  panelDiv.size(260, 780);
  panelDiv.style("background", "#f7f7f7");
  panelDiv.style("border", "1px solid #ddd");
  panelDiv.style("padding", "12px");
  panelDiv.style("box-shadow", "0 2px 6px rgba(0,0,0,0.08)");
  panelDiv.style("font-family", "sans-serif");
  panelDiv.style("font-size", "12px");
  panelDiv.style("box-sizing", "border-box");

  // 타이틀
  let titleDiv = createDiv("Type Ripple Controls");
  titleDiv.parent(panelDiv);
  titleDiv.style("font-weight", "bold");
  titleDiv.style("margin-bottom", "8px");
  titleDiv.style("font-size", "13px");

  // Export 버튼
  let exportRow = createDiv();
  exportRow.parent(panelDiv);
  exportRow.style("margin-bottom", "8px");

  exportButton = createButton("Export PNG");
  exportButton.parent(exportRow);
  exportButton.mousePressed(exportPNG);
  exportButton.style("font-size", "11px");
  exportButton.style("padding", "4px 8px");

  // ===== 텍스트 입력 영역 =====
  let textRow = createDiv();
  textRow.parent(panelDiv);
  textRow.style("margin-bottom", "8px");

  let textLabel = createSpan("Text:");
  textLabel.parent(textRow);
  textLabel.style("display", "block");
  textLabel.style("margin-bottom", "4px");

  textArea = createElement('textarea', textContent);
  textArea.parent(textRow);
  textArea.style("width", "100%");
  textArea.style("height", "60px");
  textArea.style("font-size", "11px");
  textArea.style("resize", "vertical");

  applyButton = createButton('Apply Text');
  applyButton.parent(textRow);
  applyButton.style("margin-top", "4px");
  applyButton.mousePressed(applyTypedText);

  // ===== 아코디언 1: Text Layout =====
  layoutHeaderDiv = createDiv("▼ Text Layout");
  layoutHeaderDiv.parent(panelDiv);
  layoutHeaderDiv.style("margin-top", "10px");
  layoutHeaderDiv.style("padding", "6px 4px");
  layoutHeaderDiv.style("background", "#e5e5e5");
  layoutHeaderDiv.style("cursor", "pointer");
  layoutHeaderDiv.style("user-select", "none");
  layoutHeaderDiv.mousePressed(toggleLayoutAccordion);

  layoutBodyDiv = createDiv();
  layoutBodyDiv.parent(panelDiv);
  layoutBodyDiv.style("margin-top", "8px");

  textSizeRow = createSliderRow(
    "Size",
    200, 800,
    textSizeVal,
    (v) => { textSizeVal = v; },
    layoutBodyDiv
  );

  letterSpacingRow = createSliderRow(
    "Letter Sp.",
    0, 200,
    letterSpacingVal,
    (v) => { letterSpacingVal = v; },
    layoutBodyDiv
  );

  leadingRow = createSliderRow(
    "Leading",
    0, 250,
    lineLeadingVal,
    (v) => { lineLeadingVal = v; },
    layoutBodyDiv
  );

  // 레이아웃 모드 셀렉트
  let lmRow = createDiv();
  lmRow.parent(layoutBodyDiv);
  lmRow.style("margin-top", "6px");

  let lmLabel = createSpan("Layout:");
  lmLabel.parent(lmRow);
  lmLabel.style("display", "inline-block");
  lmLabel.style("width", "70px");

  layoutSelect = createSelect();
  layoutSelect.parent(lmRow);
  layoutSelect.option("Block");
  layoutSelect.option("Circle");
  layoutSelect.option("Arc");
  layoutSelect.value(layoutMode);
  layoutSelect.changed(() => {
    layoutMode = layoutSelect.value();
    buildAllText();
  });

  layoutRadiusRow = createSliderRow(
    "Radius",
    50, 600,
    layoutRadius,
    (v) => { layoutRadius = v; },
    layoutBodyDiv
  );

  arcSpanRow = createSliderRow(
    "ArcSpan",
    30, 330,
    arcSpanDeg,
    (v) => { arcSpanDeg = v; },
    layoutBodyDiv
  );

  // ===== 아코디언 2: Ripple Style =====
  styleHeaderDiv = createDiv("▼ Ripple Style");
  styleHeaderDiv.parent(panelDiv);
  styleHeaderDiv.style("margin-top", "10px");
  styleHeaderDiv.style("padding", "6px 4px");
  styleHeaderDiv.style("background", "#e5e5e5");
  styleHeaderDiv.style("cursor", "pointer");
  styleHeaderDiv.style("user-select", "none");
  styleHeaderDiv.mousePressed(toggleStyleAccordion);

  styleBodyDiv = createDiv();
  styleBodyDiv.parent(panelDiv);
  styleBodyDiv.style("margin-top", "8px");

  radiusMinRow = createSliderRow(
    "radiusMin",
    1, 80,
    radiusMin,
    (v) => { radiusMin = v; },
    styleBodyDiv
  );

  radiusMaxRow = createSliderRow(
    "radiusMax",
    50, 250,
    radiusMax,
    (v) => { radiusMax = v; },
    styleBodyDiv
  );

  stepRow = createSliderRow(
    "step",
    5, 80,
    step,
    (v) => { step = v; },
    styleBodyDiv
  );

  spacingRow = createSliderRow(
    "Spacing",
    20, 200,
    spacing,
    (v) => { spacing = v; },
    styleBodyDiv
  );

  strokeWRow = createSliderRow(
    "StrokeW",
    0.5, 8,
    strokeW,
    (v) => { strokeW = v; },
    styleBodyDiv
  );

  speedRow = createSliderRow(
    "Speed",
    0.005, 0.08,
    rippleSpeed,
    (v) => { rippleSpeed = v; },
    styleBodyDiv,
    0.001
  );

  // Anim Mode
  let animRow = createDiv();
  animRow.parent(styleBodyDiv);
  animRow.style("margin-top", "6px");

  let animLabel = createSpan("Anim:");
  animLabel.parent(animRow);
  animLabel.style("display", "inline-block");
  animLabel.style("width", "70px");

  animSelect = createSelect();
  animSelect.parent(animRow);
  animSelect.option("Manual");
  animSelect.option("Loop");
  animSelect.option("PingPong");
  animSelect.value(animMode);
  animSelect.changed(() => {
    animMode = animSelect.value();
    animating = false;
    pingForward = true;
  });

  // Timeline 스크러버
  let tlRow = createDiv();
  tlRow.parent(styleBodyDiv);
  tlRow.style("margin-top", "6px");

  let tlLabel = createSpan("Timeline:");
  tlLabel.parent(tlRow);
  tlLabel.style("display", "inline-block");
  tlLabel.style("width", "70px");

  timelineSlider = createSlider(0, 1, rippleProgress, 0.001);
  timelineSlider.parent(tlRow);
  timelineSlider.style("width", "100px");
  timelineSlider.input(() => {
    rippleProgress = timelineSlider.value();
    animMode = "Manual";
    animSelect.value("Manual");
    animating = false;
  });

  // 색상 팔레트 셀렉트
  let paletteRow = createDiv();
  paletteRow.parent(styleBodyDiv);
  paletteRow.style("margin-top", "6px");

  let paletteLabel = createSpan("Color:");
  paletteLabel.parent(paletteRow);
  paletteLabel.style("display", "inline-block");
  paletteLabel.style("width", "70px");

  paletteSelect = createSelect();
  paletteSelect.parent(paletteRow);
  paletteSelect.option("Black");
  paletteSelect.option("Gray");
  paletteSelect.option("Red");
  paletteSelect.option("Blue");
  paletteSelect.option("Rainbow");
  paletteSelect.value(colorPalette);
  paletteSelect.changed(() => {
    colorPalette = paletteSelect.value();
  });

  // Shape 모드 셀렉트
  let shapeRow = createDiv();
  shapeRow.parent(styleBodyDiv);
  shapeRow.style("margin-top", "6px");

  let shapeLabel = createSpan("Shape:");
  shapeLabel.parent(shapeRow);
  shapeLabel.style("display", "inline-block");
  shapeLabel.style("width", "70px");

  shapeSelect = createSelect();
  shapeSelect.parent(shapeRow);
  shapeSelect.option("Circle");
  shapeSelect.option("LineX");
  shapeSelect.option("LineY");
  shapeSelect.option("Rect");
  shapeSelect.option("Triangle");
  shapeSelect.option("Dot");
  shapeSelect.value(shapeMode);
  shapeSelect.changed(() => {
    shapeMode = shapeSelect.value();
  });

  // Draw 모드 (Stroke / Fill)
  let drawRow = createDiv();
  drawRow.parent(styleBodyDiv);
  drawRow.style("margin-top", "6px");

  let drawLabel = createSpan("Draw:");
  drawLabel.parent(drawRow);
  drawLabel.style("display", "inline-block");
  drawLabel.style("width", "70px");

  drawModeSelect = createSelect();
  drawModeSelect.parent(drawRow);
  drawModeSelect.option("Stroke");
  drawModeSelect.option("Fill");
  drawModeSelect.value(drawMode);
  drawModeSelect.changed(() => {
    drawMode = drawModeSelect.value();
  });

  // Blend 모드
  let blendRow = createDiv();
  blendRow.parent(styleBodyDiv);
  blendRow.style("margin-top", "6px");

  let blendLabel = createSpan("Blend:");
  blendLabel.parent(blendRow);
  blendLabel.style("display", "inline-block");
  blendLabel.style("width", "70px");

  blendModeSelect = createSelect();
  blendModeSelect.parent(blendRow);
  blendModeSelect.option("Normal");
  blendModeSelect.option("Add");
  blendModeSelect.option("Multiply");
  blendModeSelect.option("Screen");
  blendModeSelect.option("Lightest");
  blendModeSelect.option("Darkest");
  blendModeSelect.value(blendModeName);
  blendModeSelect.changed(() => {
    blendModeName = blendModeSelect.value();
  });

  // Background Color
  let bgRow = createDiv();
  bgRow.parent(styleBodyDiv);
  bgRow.style("margin-top", "6px");

  let bgLabel = createSpan("BG:");
  bgLabel.parent(bgRow);
  bgLabel.style("display", "inline-block");
  bgLabel.style("width", "70px");

  bgPicker = createColorPicker('#ffffff');
  bgPicker.parent(bgRow);
  bgPicker.input(() => {
    bgColor = bgPicker.color();
  });

  // Direction 셀렉트
  let dirRow = createDiv();
  dirRow.parent(styleBodyDiv);
  dirRow.style("margin-top", "6px");

  let dirLabel = createSpan("Direction:");
  dirLabel.parent(dirRow);
  dirLabel.style("display", "inline-block");
  dirLabel.style("width", "70px");

  directionSelect = createSelect();
  directionSelect.parent(dirRow);
  directionSelect.option("Inside-Out");
  directionSelect.option("Outside-In");
  directionSelect.value(rippleDirection);
  directionSelect.changed(() => {
    rippleDirection = directionSelect.value();
  });

  // Per-char 색상
  let perCharRow = createDiv();
  perCharRow.parent(styleBodyDiv);
  perCharRow.style("margin-top", "4px");

  let perCharLabel = createSpan("Per-char:");
  perCharLabel.parent(perCharRow);
  perCharLabel.style("display", "inline-block");
  perCharLabel.style("width", "70px");

  perCharCheckbox = createCheckbox("", perCharColor);
  perCharCheckbox.parent(perCharRow);
  perCharCheckbox.changed(() => {
    perCharColor = perCharCheckbox.checked();
  });

  // Easing 셀렉트
  let easingRow = createDiv();
  easingRow.parent(styleBodyDiv);
  easingRow.style("margin-top", "6px");

  let easingLabel = createSpan("Easing:");
  easingLabel.parent(easingRow);
  easingLabel.style("display", "inline-block");
  easingLabel.style("width", "70px");

  easingSelect = createSelect();
  easingSelect.parent(easingRow);
  easingSelect.option("Linear");
  easingSelect.option("EaseInOutQuad");
  easingSelect.option("EaseOutCubic");
  easingSelect.value(easingMode);
  easingSelect.changed(() => {
    easingMode = easingSelect.value();
  });

  // 초기 텍스트 빌드
  buildAllText();
}

function draw() {
  // 🔧 이전 프레임의 블렌드 상태 초기화
  blendMode(BLEND);
  background(bgColor);

  // 🔧 여기서부터 선택한 블렌드 모드 적용
  let modeConst = BLEND;
  if (blendModeName === "Add") modeConst = ADD;
  else if (blendModeName === "Multiply") modeConst = MULTIPLY;
  else if (blendModeName === "Screen") modeConst = SCREEN;
  else if (blendModeName === "Lightest") modeConst = LIGHTEST;
  else if (blendModeName === "Darkest") modeConst = DARKEST;
  blendMode(modeConst);

  let eased = applyEasing(rippleProgress, easingMode);

  for (let c of centers) {
    drawRipple(c, eased);
  }

  // 애니메이션 모드 적용
  if (animMode === "Manual") {
    if (animating) {
      rippleProgress += rippleSpeed;
      if (rippleProgress >= 1) {
        rippleProgress = 1;
        animating = false;
      }
    }
  } else if (animMode === "Loop") {
    rippleProgress = (rippleProgress + rippleSpeed) % 1;
  } else if (animMode === "PingPong") {
    if (pingForward) {
      rippleProgress += rippleSpeed;
      if (rippleProgress >= 1) {
        rippleProgress = 1;
        pingForward = false;
      }
    } else {
      rippleProgress -= rippleSpeed;
      if (rippleProgress <= 0) {
        rippleProgress = 0;
        pingForward = true;
      }
    }
  }

  // 타임라인 UI 동기화
  if (timelineSlider) {
    timelineSlider.value(rippleProgress);
  }
}

// ===== 아코디언 토글 =====
function toggleLayoutAccordion() {
  layoutOpen = !layoutOpen;
  if (layoutOpen) {
    layoutBodyDiv.style("display", "block");
    layoutHeaderDiv.html("▼ Text Layout");
  } else {
    layoutBodyDiv.style("display", "none");
    layoutHeaderDiv.html("▶ Text Layout");
  }
}

function toggleStyleAccordion() {
  styleOpen = !styleOpen;
  if (styleOpen) {
    styleBodyDiv.style("display", "block");
    styleHeaderDiv.html("▼ Ripple Style");
  } else {
    styleBodyDiv.style("display", "none");
    styleHeaderDiv.html("▶ Ripple Style");
  }
}

// ===== 슬라이더 + 숫자 인풋 한 줄 생성 =====
function createSliderRow(labelText, min, max, initialValue, onChange, parentDiv, stepOverride) {
  let row = createDiv();
  row.parent(parentDiv);
  row.style("margin-bottom", "8px");

  let label = createSpan(labelText);
  label.parent(row);
  label.style("display", "inline-block");
  label.style("width", "70px");

  let slider = createSlider(min, max, initialValue, stepOverride || 0.5);
  slider.parent(row);
  slider.style("width", "100px");
  slider.style("margin", "0 6px");

  let numberInput = createInput(initialValue.toString());
  numberInput.parent(row);
  numberInput.size(40);
  numberInput.attribute("type", "number");
  numberInput.style("font-size", "11px");
  numberInput.style("padding", "1px 2px");

  slider.input(() => {
    let v = slider.value();
    numberInput.value(v);
    onChange(v);
    buildAllText();
  });

  numberInput.input(() => {
    let v = parseFloat(numberInput.value());
    if (isNaN(v)) return;
    v = constrain(v, min, max);
    slider.value(v);
    onChange(v);
    buildAllText();
  });

  return { slider, numberInput };
}

// ===== 텍스트 빌드 =====
function applyTypedText() {
  textContent = textArea.value();
  if (!textContent) textContent = " ";
  buildAllText();
}

function buildAllText() {
  centers = [];

  if (layoutMode === "Block") {
    buildBlockText();
  } else {
    buildRadialText(); // Circle / Arc
  }

  centerAlignCenters();
  rippleProgress = 1;
  animating = false;
  pingForward = true;
}

// 블록 레이아웃
function buildBlockText() {
  let fontSize = textSizeVal;
  let lines = textContent.toUpperCase().split('\n');

  let allCenters = [];
  let glyphCounter = 0;

  for (let li = 0; li < lines.length; li++) {
    let line = lines[li];
    let cursorX = 0;
    let cursorY = li * (fontSize + lineLeadingVal);

    for (let i = 0; i < line.length; i++) {
      let ch = line[i];

      if (ch === ' ') {
        cursorX += fontSize * 0.35 + letterSpacingVal;
        continue;
      }

      let info = getGlyphPoints(ch, fontSize);
      if (!info) continue;

      for (let p of info.pts) {
        let gx = p.x + cursorX;
        let gy = p.y + cursorY;
        addSnappedPoint(allCenters, gx, gy, glyphCounter);
      }

      cursorX += info.width + letterSpacingVal;
      glyphCounter++;
    }
  }

  centers = allCenters;
}

// 원형 / 아치 레이아웃
function buildRadialText() {
  let fontSize = textSizeVal;
  let textFlat = textContent.toUpperCase().replace(/\n/g, ' ');
  if (textFlat.length === 0) {
    centers = [];
    return;
  }

  let chars = textFlat.split('');
  let total = chars.length;
  let allCenters = [];
  let glyphCounter = 0;

  let startAngle, endAngle;
  if (layoutMode === "Circle") {
    startAngle = 0;
    endAngle = TWO_PI;
  } else { // Arc
    let spanRad = radians(arcSpanDeg);
    startAngle = -spanRad / 2;
    endAngle = spanRad / 2;
  }

  for (let i = 0; i < total; i++) {
    let ch = chars[i];
    let angle = (total === 1)
      ? (startAngle + endAngle) / 2
      : map(i, 0, total - 1, startAngle, endAngle);

    let baseX = layoutRadius * cos(angle);
    let baseY = layoutRadius * sin(angle);

    if (ch === ' ') {
      glyphCounter++;
      continue;
    }

    let info = getGlyphPoints(ch, fontSize);
    if (!info) {
      glyphCounter++;
      continue;
    }

    for (let p of info.pts) {
      let gx = baseX + p.x;
      let gy = baseY + p.y;
      addSnappedPoint(allCenters, gx, gy, glyphCounter);
    }

    glyphCounter++;
  }

  centers = allCenters;
}

// 스냅 + 중복 제거 + gIndex 지정
function addSnappedPoint(allCenters, gx, gy, gIndex) {
  let sx = Math.round(gx / spacing) * spacing;
  let sy = Math.round(gy / spacing) * spacing;

  for (let q of allCenters) {
    if (dist(sx, sy, q.x, q.y) < spacing * 0.4) {
      return;
    }
  }
  let v = createVector(sx, sy);
  v.gIndex = gIndex;
  allCenters.push(v);
}

// 글자 하나의 점들 가져오기
function getGlyphPoints(ch, fontSize) {
  let bounds = font.textBounds(ch, 0, 0, fontSize);
  if (!bounds) return null;

  let x0 = -bounds.w / 2 - bounds.x;
  let y0 = bounds.h / 2 - bounds.y;

  let pts = font.textToPoints(ch, x0, y0, fontSize, {
    sampleFactor: 0.6,
    simplifyThreshold: 0
  });

  return {
    pts: pts,
    width: bounds.w
  };
}

// 전체 centers를 캔버스 중앙으로 이동
function centerAlignCenters() {
  if (centers.length === 0) return;

  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  for (let c of centers) {
    if (c.x < minX) minX = c.x;
    if (c.x > maxX) maxX = c.x;
    if (c.y < minY) minY = c.y;
    if (c.y > maxY) maxY = c.y;
  }

  let axisX = (minX + maxX) / 2;
  let axisY = (minY + maxY) / 2;

  let dx = width / 2 - axisX;
  let dy = height / 2 - axisY;

  for (let c of centers) {
    c.x += dx;
    c.y += dy;
  }
}

// ===== Ripple 그리기 + Easing/Color/Shape/Fill =====
function drawRipple(pt, progress) {
  let cx = pt.x;
  let cy = pt.y;
  let gIndex = pt.gIndex || 0;

  for (let r = radiusMin; r <= radiusMax; r += step) {
    let t = (r - radiusMin) / (radiusMax - radiusMin); // 0~1

    let visible;
    if (rippleDirection === "Inside-Out") {
      visible = t <= progress;
    } else {
      visible = t >= 1 - progress;
    }
    if (!visible) continue;

    let alpha = 90;
    let rCol = 0, gCol = 0, bCol = 0;

    // 색상 계산
    if (perCharColor) {
      let col = getPerCharColor(gIndex);
      rCol = col[0]; gCol = col[1]; bCol = col[2];
    } else if (colorPalette === "Black") {
      rCol = gCol = bCol = 0;
    } else if (colorPalette === "Gray") {
      rCol = gCol = bCol = 80;
    } else if (colorPalette === "Red") {
      rCol = 220; gCol = 80;  bCol = 80;
    } else if (colorPalette === "Blue") {
      rCol = 40;  gCol = 80;  bCol = 200;
    } else if (colorPalette === "Rainbow") {
      rCol = map(r, radiusMin, radiusMax, 60, 255);
      gCol = map(r, radiusMin, radiusMax, 200, 60);
      bCol = map(r, radiusMin, radiusMax, 255, 120);
    }

    // LineX / LineY는 채우기 개념이 거의 없으니까 항상 stroke로
    let forceStroke = (shapeMode === "LineX" || shapeMode === "LineY");

    if (drawMode === "Fill" && !forceStroke) {
      noStroke();
      fill(rCol, gCol, bCol, alpha);
    } else {
      noFill();
      stroke(rCol, gCol, bCol, alpha);
      strokeWeight(strokeW);
    }

    // 모양 결정
    if (shapeMode === "Circle") {
      ellipse(cx, cy, r * 2, r * 2);
    } else if (shapeMode === "LineX") {
      line(cx - r, cy, cx + r, cy);
    } else if (shapeMode === "LineY") {
      line(cx, cy - r, cx, cy + r);
    } else if (shapeMode === "Rect") {
      rectMode(CENTER);
      rect(cx, cy, r * 2, r * 2);
    } else if (shapeMode === "Triangle") {
      let x1 = cx;
      let y1 = cy - r;
      let x2 = cx - r;
      let y2 = cy + r;
      let x3 = cx + r;
      let y3 = cy + r;
      triangle(x1, y1, x2, y2, x3, y3);
    } else if (shapeMode === "Dot") {
      let dotSize = step * 0.4;
      ellipse(cx + r * 0.3, cy, dotSize, dotSize);
    }
  }
}

function getPerCharColor(i) {
  let colors = [
    [220, 80, 80],
    [40, 120, 220],
    [60, 160, 120],
    [180, 140, 40],
    [140, 60, 180],
    [30, 30, 30]
  ];
  return colors[i % colors.length];
}

function applyEasing(t, mode) {
  t = constrain(t, 0, 1);
  if (mode === "EaseInOutQuad") {
    return t < 0.5
      ? 2 * t * t
      : 1 - pow(-2 * t + 2, 2) / 2;
  } else if (mode === "EaseOutCubic") {
    return 1 - pow(1 - t, 3);
  }
  return t; // Linear
}

// ===== 인터랙션 & Export =====
function mousePressed() {
  if (animMode === "Manual") {
    rippleProgress = 0;
    animating = true;
  } else if (animMode === "Loop") {
    rippleProgress = 0;
  } else if (animMode === "PingPong") {
    rippleProgress = 0;
    pingForward = true;
  }
}

function keyPressed() {
  // A~Z 테스트용
  if (keyCode === RIGHT_ARROW) {
    currentIndex = (currentIndex + 1) % letters.length;
    textContent = letters[currentIndex];
    textArea.value(textContent);
    buildAllText();
  } else if (keyCode === LEFT_ARROW) {
    currentIndex = (currentIndex - 1 + letters.length) % letters.length;
    textContent = letters[currentIndex];
    textArea.value(textContent);
    buildAllText();
  } else if (key === ' ') {
    currentIndex = (currentIndex + 1) % letters.length;
    textContent = letters[currentIndex];
    textArea.value(textContent);
    buildAllText();
  }
}

function exportPNG() {
  saveCanvas(canvas, 'type_ripple', 'png');
}