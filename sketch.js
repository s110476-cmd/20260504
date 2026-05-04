let capture;
let faceMesh;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.size(640, 480);
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

  // 如果偵測到臉部，則繪製指定點位的連線
  if (faces.length > 0 && faces[0].keypoints) {
    let face = faces[0];
    // 定義多組需要連線的點位路徑
    let paths = [
      [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291],
      [76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184]
    ];
    
    noFill();          // 確保不會填滿嘴唇區域
    stroke(255, 0, 0); // 線條採用紅色
    strokeWeight(1);   // 粗細為1
    
    for (let indices of paths) {
      beginShape();
      for (let index of indices) {
        let p = face.keypoints[index];
        if (p) {
          // 將攝影機座標 (640x480) 映射到畫布顯示區域
          let x = map(p.x, 0, 640, -vW / 2, vW / 2);
          let y = map(p.y, 0, 480, -vH / 2, vH / 2);
          vertex(x, y);
        }
      }
      endShape();
    }
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
