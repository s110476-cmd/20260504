let video;

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.hide();
}

function draw() {
  background('#e7c6ff');
  
  // 計算影像尺寸（原始的50%）
  let imgWidth = video.width * 0.5;
  let imgHeight = video.height * 0.5;
  
  // 計算中央位置
  let imgX = width / 2 - imgWidth / 2;
  let imgY = height / 2 - imgHeight / 2;
  
  // 保存當前的變換狀態
  push();
  
  // 移動到影像中央位置
  translate(imgX + imgWidth / 2, imgY);
  
  // 水平翻轉
  scale(-1, 1);
  
  // 繪製影像（以中央為原點）
  image(video, -imgWidth / 2, 0, imgWidth, imgHeight);
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
