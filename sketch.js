let capture;
let facemesh;
let predictions = [];
let cameraReady = false; // 新增變數來追蹤攝影機是否準備就緒
let cameraError = false; // 新增變數來追蹤攝影機是否發生錯誤

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO, (stream) => {
    // 當攝影機串流準備就緒時，這個回呼函數會被執行
    console.log("Camera stream ready:", stream);
    cameraReady = true;
  });
  capture.size(640, 480); // 設定擷取解析度以利座標計算
  capture.hide(); // 隱藏預設產生的 HTML 影片元件，只顯示在畫布上

  // 監聽攝影機影像元素的 loadedmetadata 事件，檢查是否有影像尺寸
  capture.elt.onloadedmetadata = () => {
    if (!capture.elt.videoWidth || !capture.elt.videoHeight) {
      console.error("Camera stream has no dimensions, might be an error or permission issue.");
      cameraError = true;
    }
  };
  // 監聽攝影機影像元素的 error 事件
  capture.elt.onerror = (e) => {
    console.error("Camera error:", e);
    cameraError = true;
  };
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

  if (cameraError) {
    // 如果有攝影機錯誤，顯示錯誤訊息
    fill(255, 0, 0); // 紅色文字
    textSize(24);
    textAlign(CENTER, CENTER);
    text("相機錯誤或權限被拒絕", 0, 0);
  } else if (!cameraReady) {
    // 如果攝影機尚未準備就緒，顯示載入訊息
    fill(0); // 黑色文字
    textSize(24);
    textAlign(CENTER, CENTER);
    text("正在載入相機...", 0, 0);
  } else {
    // 攝影機準備就緒後才繪製影像
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
  }
  pop();
}
