// Pure p5 canvas — layout constants
var W = 400;
var H = 680;
var ROW_H = 30;
var BOARD_L = 24;
var BOARD_R = 276;
var PEG_R = 12;
var PALETTE_Y = H - 56;
var PALETTE_R = 14;
var FEEDBACK_CX = BOARD_R + 28;

var mastermind = [];
var colors = [
  '#e53935', '#43a047', '#1e88e5', '#fb8c00',
  '#d81b60', '#212121', '#eceff1', '#f48fb1',
  '#8e24aa'
];
var turns = 1;
var guess = [];
var statusMsg = '';
var gameOver = false;
var showSolution = false;
var historyGuesses = [];

var btnScore = { x: 300, y: H - 52, w: 88, h: 36 };
var btnAgain = { x: 292, y: H - 52, w: 100, h: 36 };

function setup() {
  createCanvas(W, H);
  textFont('sans-serif');
  startNewGame();
}

function startNewGame() {
  turns = 1;
  guess = [];
  gameOver = false;
  showSolution = false;
  statusMsg = '';
  historyGuesses = [];
  mastermind = [];
  for (var i = 0; i < 4; i++) {
    mastermind.push(floor(random(0, 9)));
  }
}

function computeFeedback(g, secret) {
  var gt = g.slice();
  var mt = secret.slice();
  var exact = 0;
  var i, j;
  for (i = 3; i >= 0; i--) {
    if (gt[i] === mt[i]) {
      exact++;
      gt.splice(i, 1);
      mt.splice(i, 1);
    }
  }
  var partial = 0;
  for (i = gt.length - 1; i >= 0; i--) {
    for (j = mt.length - 1; j >= 0; j--) {
      if (gt[i] === mt[j]) {
        partial++;
        gt.splice(i, 1);
        mt.splice(j, 1);
        break;
      }
    }
  }
  return { exact: exact, partial: partial };
}

function scoreGuess() {
  if (gameOver) return;
  if (guess.length !== 4) {
    statusMsg = 'Choose 4 pegs, then tap SCORE.';
    return;
  }

  var fb = computeFeedback(guess, mastermind);
  historyGuesses.push({
    pegs: guess.slice(),
    exact: fb.exact,
    partial: fb.partial
  });

  if (fb.exact === 4) {
    gameOver = true;
    showSolution = true;
    statusMsg = 'You won in ' + turns + ' turn' + (turns === 1 ? '' : 's') + '!';
  } else if (turns === 15) {
    gameOver = true;
    showSolution = true;
    statusMsg = 'Out of turns — solution below.';
  } else {
    statusMsg = fb.exact + ' exact · ' + fb.partial + ' color only';
  }

  turns++;
  guess = [];
}

function rowY(row) {
  return 88 + row * ROW_H;
}

function drawMarble(cx, cy, r, hex) {
  noStroke();
  var c = color(hex);
  var dark = color(
    max(0, red(c) * 0.55),
    max(0, green(c) * 0.55),
    max(0, blue(c) * 0.55)
  );
  fill(dark);
  ellipse(cx, cy + 1, r * 2 + 2, r * 2 + 2);
  fill(c);
  ellipse(cx, cy, r * 2, r * 2);
  fill(255, 130);
  ellipse(cx - r * 0.35, cy - r * 0.35, r * 0.55, r * 0.55);
  stroke(0, 35);
  strokeWeight(1);
  noFill();
  ellipse(cx, cy, r * 2, r * 2);
  noStroke();
}

function drawFeedbackDots(cx, cy, exact, partial) {
  var dots = [];
  var k;
  for (k = 0; k < exact; k++) dots.push('#1a1a1a');
  for (k = 0; k < partial; k++) dots.push('#eceff1');
  while (dots.length < 4) dots.push(null);
  var idx = 0;
  for (var row = 0; row < 2; row++) {
    for (var col = 0; col < 2; col++) {
      var d = dots[idx++];
      var px = cx + col * 14 - 7;
      var py = cy + row * 14 - 7;
      if (d) {
        fill(d);
        stroke(0, 40);
        strokeWeight(1);
        ellipse(px, py, 9, 9);
      } else {
        noFill();
        stroke(0, 25);
        strokeWeight(1);
        ellipse(px, py, 7, 7);
      }
    }
  }
  noStroke();
}

function drawCanvasButton(x, y, bw, bh, label, baseHex) {
  var c = color(baseHex);
  fill(red(c) * 1.12, green(c) * 1.12, blue(c) * 1.12);
  stroke(0, 55);
  strokeWeight(1);
  rect(x, y, bw, bh, 6);
  fill(255);
  noStroke();
  textSize(13);
  textAlign(CENTER, CENTER);
  text(label, x + bw / 2, y + bh / 2 + 1);
}

function drawBoard() {
  background('#3e2723');

  fill('#5d4037');
  noStroke();
  rect(8, 8, W - 16, H - 16, 10);

  fill('#efebe9');
  textSize(13);
  textAlign(LEFT, TOP);
  text('Mastermind — tap colors, fill the row, SCORE.', BOARD_L, 14);

  if (showSolution) {
    textSize(11);
    fill('#d7ccc8');
    text('Secret code:', BOARD_L, 34);
    for (var q = 0; q < 4; q++) {
      drawMarble(BOARD_L + 78 + q * 34, 44, 8, colors[mastermind[q]]);
    }
  }

  stroke('#3e2723');
  strokeWeight(1);
  var lineY;
  for (lineY = rowY(0) - ROW_H / 2; lineY < rowY(15); lineY += ROW_H) {
    line(BOARD_L - 4, lineY, FEEDBACK_CX + 24, lineY);
  }

  var h;
  for (h = 0; h < historyGuesses.length; h++) {
    var hg = historyGuesses[h];
    var y = rowY(h);
    for (var p = 0; p < 4; p++) {
      drawMarble(BOARD_L + 40 + p * 52, y, PEG_R, colors[hg.pegs[p]]);
    }
    drawFeedbackDots(FEEDBACK_CX, y, hg.exact, hg.partial);
  }

  // Current guess: row matches turn (below completed rows); hidden after game ends
  if (!gameOver) {
    var buildY = rowY(historyGuesses.length);
    fill('#6d4c41');
    rect(BOARD_L - 4, buildY - PEG_R - 6, BOARD_R - BOARD_L + 8, PEG_R * 2 + 12, 4);
    for (p = 0; p < 4; p++) {
      noFill();
      stroke('#a1887f');
      strokeWeight(2);
      ellipse(BOARD_L + 40 + p * 52, buildY, PEG_R * 2 + 4, PEG_R * 2 + 4);
    }
    noStroke();
    for (p = 0; p < guess.length; p++) {
      drawMarble(BOARD_L + 40 + p * 52, buildY, PEG_R, colors[guess[p]]);
    }
  }

  if (statusMsg) {
    fill('#fff8e1');
    textSize(12);
    textAlign(LEFT, TOP);
    text(statusMsg, BOARD_L, PALETTE_Y - 72, W - 48);
  }

  var i;
  for (i = 0; i < 9; i++) {
    var px = 36 + i * 36;
    drawMarble(px, PALETTE_Y, PALETTE_R, colors[i]);
  }

  if (!gameOver) {
    drawCanvasButton(btnScore.x, btnScore.y, btnScore.w, btnScore.h, 'SCORE', '#00695c');
  } else {
    drawCanvasButton(btnAgain.x, btnAgain.y, btnAgain.w, btnAgain.h, 'PLAY AGAIN', '#c62828');
  }
}

function draw() {
  drawBoard();
}

function paletteIndexFromMouse(mx) {
  for (var i = 0; i < 9; i++) {
    var cx = 36 + i * 36;
    if (dist(mx, mouseY, cx, PALETTE_Y) < PALETTE_R + 6) return i;
  }
  return -1;
}

function mousePressed() {
  if (mouseX < 0 || mouseX > W || mouseY < 0 || mouseY > H) return;

  if (gameOver) {
    if (
      mouseX >= btnAgain.x &&
      mouseX <= btnAgain.x + btnAgain.w &&
      mouseY >= btnAgain.y &&
      mouseY <= btnAgain.y + btnAgain.h
    ) {
      startNewGame();
    }
    return;
  }

  if (
    mouseX >= btnScore.x &&
    mouseX <= btnScore.x + btnScore.w &&
    mouseY >= btnScore.y &&
    mouseY <= btnScore.y + btnScore.h
  ) {
    scoreGuess();
    return;
  }

  var slot = paletteIndexFromMouse(mouseX);
  if (slot >= 0) {
    statusMsg = '';
    if (guess.length === 4) {
      guess = [slot];
    } else {
      guess.push(slot);
    }
  }
}
