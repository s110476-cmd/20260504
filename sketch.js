let capture;
let facemesh;
let predictions = [];
let modelLoaded = false; // 新增變數來追蹤模型是否載入
let cameraReady = false; // 追蹤攝影機是否準備就緒
let cameraError = false; // 追蹤攝影機是否發生錯誤

function setup() {
  createCanvas(windowWidth, windowHeight); // 全螢幕畫布

  // 三星/Android 手機建議明確指定前鏡頭與不使用音訊
  let constraints = {
    video: {
      facingMode: "user" // 強制使用前鏡頭
    },
    audio: false
  };

  capture = createCapture(constraints,
    function(stream) {
      console.log("Camera stream started successfully.");
      cameraReady = true;
      // 初始化 FaceMesh 模型
      console.log("Initializing FaceMesh model...");
      facemesh = ml5.faceMesh(capture, () => {
        console.log("FaceMesh 模型準備就緒！");
        modelLoaded = true;
      });
      // 開始持續偵測
      facemesh.detectStart(capture, results => {
        predictions = results;
      });
    },
    function(err) {
      console.error("Camera access error: ", err);
      cameraError = true;
    }
  );

  capture.size(windowWidth/2, windowHeight/2); // 配合手機螢幕動態調整
  capture.elt.setAttribute('playsinline', ''); // 修正 iOS 影片無法在網頁內播放的問題
  
  capture.hide();
}

function draw() {
  background('#e7c6ff');

  let w = width * 0.5;
  let h = height * 0.5;

  push();
  imageMode(CENTER);
  // 將座標中心移至畫布中央
  translate(width / 2, height / 2);

  if (cameraError) {
    scale(1, 1); // 確保錯誤文字不被翻轉
    // 如果有攝影機錯誤，顯示錯誤訊息
    fill(255, 0, 0); // 紅色文字
    textSize(24);
    textAlign(CENTER, CENTER);
    text("相機錯誤或權限被拒絕", 0, 0);
  } else if (!cameraReady) {
    scale(1, 1); // 確保載入文字不被翻轉
    // 如果攝影機尚未準備就緒，顯示載入訊息
    fill(0); // 黑色文字
    textSize(24);
    textAlign(CENTER, CENTER);
    text("正在載入相機...", 0, 0);
  } else if (!modelLoaded) {
    // 相機好了但模型還沒好：先顯示相機畫面，並提示模型載入中
    push();
    scale(-1, 1);
    image(capture, 0, 0, w, h);
    pop();
    
    scale(1, 1); // 確保載入文字不被翻轉
    fill(0); // 黑色文字
    textSize(24);
    textAlign(CENTER, CENTER);
    text("正在載入臉部辨識模型...", 0, 0);
  } else {
    // 相機與模型都準備好了
    push();
    scale(-1, 1); // 水平翻轉影像（實作左右顛倒）
    image(capture, 0, 0, w, h);

    if (predictions.length > 0) {
      let lipIndices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
      let keypoints = predictions[0].keypoints;

      stroke(255, 0, 0); // 線條採用紅色
      strokeWeight(1);   // 粗細為 1
      for (let i = 0; i < lipIndices.length; i++) {
        let startIdx = lipIndices[i];
        let endIdx = lipIndices[(i + 1) % lipIndices.length];
        let p1 = keypoints[startIdx];
        let p2 = keypoints[endIdx];

        if (p1 && p2) {
          let x1 = map(p1.x, 0, capture.width, -w / 2, w / 2);
          let y1 = map(p1.y, 0, capture.height, -h / 2, h / 2);
          let x2 = map(p2.x, 0, capture.width, -w / 2, w / 2);
          let y2 = map(p2.y, 0, capture.height, -h / 2, h / 2);
          line(x1, y1, x2, y2);
        }
      }
    } else {
      pop(); // 暫時切換回非翻轉座標繪製文字
      fill(0);
      textAlign(CENTER, CENTER);
      text("未偵測到臉部", 0, 0);
      push(); // 恢復環境平衡
    }
    pop();
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
