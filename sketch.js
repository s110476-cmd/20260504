let capture;

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏預設產生的 HTML 影片標籤，避免重疊顯示
  capture.hide(); 
}

function draw() {
  // 設定背景顏色為 e7c6ff
  background('#e7c6ff');

  // 計算影像顯示的大小（全螢幕寬高的 50%）
  const vWidth = width * 0.5;
  const vHeight = height * 0.5;

  // 計算置中座標
  const x = (width - vWidth) / 2;
  const y = (height - vHeight) / 2;

  push();
  // 透過平移到目標位置的右側並反向縮放，實現左右顛倒的鏡像效果
  translate(x + vWidth, y);
  scale(-1, 1);
  image(capture, 0, 0, vWidth, vHeight);
  pop();
}

// 確保視窗大小改變時，畫布與影像位置能正確重新計算
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
