let spriteSheet, spriteSheet2; // 兩個精靈圖片
let song; // 音樂
let fft; // 用於分析音樂
let jumpThreshold = 200; // 跳躍的音量閾值

let character = {
  x: 200,   
  y: 200,
  frameWidth: 467/8,
  frameHeight: 95,
  currentFrame: 0,
  totalFrames: 8,
  speed: 0.1,
  isJumping: false,
  jumpPower: -15,
  velocity: 0,
  gravity: 0.8
};

let character2 = {
  x: 600,   
  y: 200,
  frameWidth: 975/14,
  frameHeight: 58,
  currentFrame: 0,
  totalFrames: 14,
  speed: 0.05,
  isJumping: false,
  jumpPower: -15,
  velocity: 0,
  gravity: 0.8
};

function preload() {
  spriteSheet = loadImage('image/player1_idle.png');
  spriteSheet2 = loadImage('image/player2_idle.png');
  song = loadSound('music.mp3'); // 載入音樂檔案
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  character.x = windowWidth/2;
  character.y = windowHeight/2;
  character2.x = windowWidth*2/3;
  character2.y = windowHeight/2;
  imageMode(CENTER);
  
  // 設定音訊分析
  fft = new p5.FFT();
  song.play();
  song.setVolume(0.5);
}

function draw() {
  background("#bde0fe");

  // 分析音樂
  let spectrum = fft.analyze();
  let bass = fft.getEnergy("bass");
  let mid = fft.getEnergy("mid"); // 在這裡定義 mid 變數
  
  // 處理鍵盤輸入
  if (keyIsDown(LEFT_ARROW)) {
    character2.x -= 2;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    character2.x += 2;
  }
  
  // 根據音量決定是否跳躍
  if (bass > jumpThreshold && !character.isJumping) {
    character.isJumping = true;
    character.velocity = character.jumpPower;
  }
  
  if (mid > jumpThreshold && !character2.isJumping) {
    character2.isJumping = true;
    character2.velocity = character2.jumpPower;
  }
  
  // 處理第一個角色的跳躍物理
  if (character.isJumping) {
    character.velocity += character.gravity;
    character.y += character.velocity;
    
    if (character.y >= windowHeight/2) {
      character.y = windowHeight/2;
      character.isJumping = false;
      character.velocity = 0;
    }
  }
  
  // 處理第二個角色的跳躍物理
  if (character2.isJumping) {
    character2.velocity += character2.gravity;
    character2.y += character2.velocity;
    
    if (character2.y >= windowHeight/2) {
      character2.y = windowHeight/2;
      character2.isJumping = false;
      character2.velocity = 0;
    }
  }
  
  // 第二個角色的動畫
  character2.currentFrame = (character2.currentFrame + character2.speed) % character2.totalFrames;
  let frameX2 = floor(character2.currentFrame) * character2.frameWidth;
  
  image(
    spriteSheet2, 
    character2.x, 
    character2.y, 
    character2.frameWidth*2, 
    character2.frameHeight*2,
    frameX2,
    0,
    character2.frameWidth,
    character2.frameHeight
  );
  
  // 第一個角色的動畫
  character.currentFrame = (character.currentFrame + character.speed) % character.totalFrames;
  let frameX = floor(character.currentFrame) * character.frameWidth;
  
  image(
    spriteSheet, 
    character.x, 
    character.y, 
    character.frameWidth*3, 
    character.frameHeight*3,
    frameX,
    0,
    character.frameWidth,
    character.frameHeight
  );
}

// 處理空白鍵按下事件
function keyPressed() {
  if (key === ' ' && !character.isJumping) {
    character.isJumping = true;
    character.velocity = character.jumpPower;
  }
  
  if (keyCode === UP_ARROW && !character2.isJumping) {
    character2.isJumping = true;
    character2.velocity = character2.jumpPower;
  }
}

// 點擊滑鼠開始播放音樂
function mousePressed() {
  if (!song.isPlaying()) {
    song.play();
  }
}
