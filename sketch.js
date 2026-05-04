let capture;
let faceMesh;
let faces = [];

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏預設產生的 HTML 影片標籤，避免重疊顯示
  capture.hide();

  // 初始化 FaceMesh 模型並開始偵測
  faceMesh = ml5.faceMesh(capture, () => console.log("FaceMesh Ready"));
  faceMesh.detectStart(capture, (results) => faces = results);
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

  // 若偵測到臉部，則根據指定編號畫線
  if (faces.length > 0) {
    let face = faces[0];
    stroke('red'); // 線條採用紅色
    strokeWeight(15); // 粗細為 15
    noFill();

    // 指定的關鍵點編號順序
    const indices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

    for (let i = 0; i < indices.length - 1; i++) {
      let p1 = face.keypoints[indices[i]];
      let p2 = face.keypoints[indices[i + 1]];

      // 將座標從攝影機尺寸映射到畫面顯示的尺寸 (50%)
      let x1 = map(p1.x, 0, capture.width, 0, vWidth);
      let y1 = map(p1.y, 0, capture.height, 0, vHeight);
      let x2 = map(p2.x, 0, capture.width, 0, vWidth);
      let y2 = map(p2.y, 0, capture.height, 0, vHeight);

      line(x1, y1, x2, y2);
    }
  }
  pop();
}

// 確保視窗大小改變時，畫布與影像位置能正確重新計算
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
