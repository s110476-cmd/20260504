let capture;
let faceMesh;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: true, flipHorizontal: false };

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.elt.setAttribute('playsinline', ''); // 關鍵：防止手機上自動全螢幕，確保偵測運作
  capture.hide(); // 隱藏預設產生的 HTML5 video 標籤，只在畫布上呈現

  // 初始化 FaceMesh 模型
  faceMesh = ml5.faceMesh(capture, options, () => {
    console.log("模型載入完成");
  });
  
  // 開始持續偵測臉部
  faceMesh.detectStart(capture, (results) => {
    faces = results;
  });
}

function draw() {
  background('#e7c6ff');

  push();
  // 將座標原點移至畫面中心
  translate(width / 2, height / 2);
  // 水平翻轉影像（左右顛倒）
  scale(-1, 1);
  // 設定 imageMode 為中心繪製
  imageMode(CENTER);

  let vW = width * 0.5;
  let vH = height * 0.5;

  // 繪製影像，尺寸為視窗寬高各 50%
  image(capture, 0, 0, vW, vH);

  // 如果偵測到臉部，則根據指定點位繪製紅色連線
  if (faces.length > 0 && faces[0].keypoints) {
    let face = faces[0];
    // 您指定的點位編號
    let indices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
    
    stroke(255, 0, 0); // 設定線條為紅色
    strokeWeight(1);   // 設定粗細為1
    
    for (let i = 0; i < indices.length - 1; i++) {
      let p1 = face.keypoints[indices[i]];
      let p2 = face.keypoints[indices[i + 1]];

      if (p1 && p2) {
        // 將攝影機座標映射到畫布上的影像位置
        let x1 = map(p1.x, 0, capture.width, -vW / 2, vW / 2);
        let y1 = map(p1.y, 0, capture.height, -vH / 2, vH / 2);
        let x2 = map(p2.x, 0, capture.width, -vW / 2, vW / 2);
        let y2 = map(p2.y, 0, capture.height, -vH / 2, vH / 2);

        line(x1, y1, x2, y2);
      }
    }
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
