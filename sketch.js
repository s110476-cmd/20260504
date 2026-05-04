let capture;
let facemesh;
let predictions = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.size(640, 480); // 設定擷取解析度以利座標計算
  capture.hide(); // 隱藏預設產生的 HTML 影片元件，只顯示在畫布上

  // 初始化 FaceMesh 模型
  facemesh = ml5.facemesh(capture, () => console.log("模型準備就緒！"));
  facemesh.on("predict", results => {
    predictions = results;
  });
}

function draw() {
  background('#e7c6ff');

  let w = width * 0.5;
  let h = height * 0.5;

  push();
  // 將座標中心移至畫布中央
  translate(width / 2, height / 2);
  // 水平翻轉影像（實作左右顛倒）
  scale(-1, 1);
  imageMode(CENTER);
  // 繪製影像，尺寸為全螢幕的一半
  image(capture, 0, 0, w, h);

  // 如果有偵測到臉部，繪製嘴唇連線
  if (predictions.length > 0) {
    let lipIndices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
    let keypoints = predictions[0].scaledMesh;

    stroke(255, 0, 0); // 線條採用紅色
    strokeWeight(1);   // 粗細為 1
    for (let i = 0; i < lipIndices.length; i++) {
      let startIdx = lipIndices[i];
      let endIdx = lipIndices[(i + 1) % lipIndices.length]; // 取得下一個點，最後一個點連回第一個點

      let x1 = map(keypoints[startIdx][0], 0, capture.width, -w / 2, w / 2);
      let y1 = map(keypoints[startIdx][1], 0, capture.height, -h / 2, h / 2);
      let x2 = map(keypoints[endIdx][0], 0, capture.width, -w / 2, w / 2);
      let y2 = map(keypoints[endIdx][1], 0, capture.height, -h / 2, h / 2);

      line(x1, y1, x2, y2); // 使用 line 指令串接
    }
  }
  pop();
}
