var mastermind = [];
var colors = ['red','green','blue','orange','magenta','black','white','pink','purple'];
var turns = 1;
var submitButton;
var resetButton;
var guess = [];
var array = [];
var statusP;
var pos = 0;
var rightcolor =0;
var youwon;

function setup() {
  createCanvas(300, 600);
  resetSketch();
}

function score(){
  if (guess.length == 4) {
    var gt = guess.slice();
    var mt = mastermind.slice();
    rightcolor = 0;
    pos = 0;
    for (i=3;i>=0;i--){
      if (gt[i]==mt[i]){
        pos++;
        gt.splice(i,1);
        mt.splice(i,1);
      }
    }
    print (gt,mt);
    for (i=gt.length-1;i>=0;i--){
      for (j=mt.length-1;j>=0;j--){
        if (gt[i] == mt[j]){
          rightcolor++;
          gt.splice(i,1);
          mt.splice(j,1);
        }
      }
    }
    print (gt,mt);

    if (pos!=4) {
      if (turns == 15) {
        createP("YOU LOST after 14 turns!! The correct answer is now shown!").position(310,turns*30+55);
        drawMarbles(mastermind,0);
        submitButton.hide();
        resetButton.show();
      } else {
        createP(pos + " right place & color " + rightcolor + " right color wrong place").position(310,turns*30+55);
      }
    } else if (pos == 4){
      createP("YOU WON in " + turns + " turns!! Congratulations!").position(310,turns*30+55);
      submitButton.hide();
      resetButton.show();
    }

    turns++;
    drawMarbles(guess,turns);
    } else {
    statusP.html("Please choose 4 marbles so I can score!");
    statusP.position(310,turns*30+55);
  }
}

function resetSketch() {
  print ("turns = " + turns);
  if (turns==16 | pos==4){
    resetButton.hide();
    removeElements();
    turns=1;
    guess = [];
    array = [];
    pos = 0;
    rightcolor =0;
  }
  // Draw board
  background('brown');
  strokeWeight(4);
  stroke('black');
  fill('silver');
  rect(30,30,240,50);
  strokeWeight(1);
  for (i=100;i<=560;i=i+30){
    stroke ('black');
    line(20,i,280,i);
  }
  // Draw buttons
  for (i=0;i<=8;i++){
    fill(colors[i]);
    ellipse((i+1)*30,570,20);
  }

  // Establish random marbles
  mastermind=[];
  for (i=0;i<=3;i++){
    mastermind.push(floor(random(0,9)));
  }

  submitButton = createButton("SCORE");
  submitButton.position(310,570);
  submitButton.mousePressed(score);

  resetButton=createButton("PLAY AGAIN");
  resetButton.position(310,570);
  resetButton.mousePressed(resetSketch);
  resetButton.hide();

  statusP = createP('');
}

function mouseClicked() {
  x = mouseX;
  y = mouseY;

  if ((x=>20 && x<=280) && (y>=560 && y<=580)){
    print(colors[ceil((x-10)/30)-1]);
    colorChosen = ceil((x-10)/30)-1;
    if (colorChosen <=8 & colorChosen >=0){
      statusP.html('');
      if (guess.length==4){
        guess = [colorChosen];
        strokeWeight(4);
        stroke('black');
        fill('silver');
        rect(30,30,240,50);
        strokeWeight(1);
      } else {
        guess.push(colorChosen);
      }
    }
    print(guess);
    if (turns <14){
      drawMarbles(guess,0);
    }
  }
}

function drawMarbles(marbles,row) {
  row=row*30+55;
  for (q=0;q<=3;q++){
    if (marbles[q] != null) {
      fill(colors[marbles[q]]);
      ellipse((q+1)*60,row,20);
    }
  }
}

function draw() {


}
