let capture;
let facemeshModel;
let predictions = [];
let isPredicting = false;
const faceLineIndices = [
  409, 270, 269, 267, 0, 37, 39, 40, 185,
  61, 146, 91, 181, 84, 17, 314, 405, 321,
  375, 291
];

async function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO, () => {
    capture.size(windowWidth / 2, windowHeight / 2);
    capture.hide();
  });
  facemeshModel = await facemesh.load();
}

function draw() {
  background('#e7c6ff');

  const vidW = width * 0.5;
  const vidH = height * 0.5;
  const x = (width - vidW) / 2;
  const y = (height - vidH) / 2;

  if (facemeshModel && !isPredicting && capture.elt && capture.elt.readyState >= 2) {
    estimateFaceMesh();
  }

  push();
  translate(x + vidW, y);
  scale(-1, 1);
  image(capture, 0, 0, vidW, vidH);

  if (predictions.length > 0) {
    drawFaceLines();
  }
  pop();
}

async function estimateFaceMesh() {
  isPredicting = true;
  try {
    const results = await facemeshModel.estimateFaces({
      input: capture.elt
    });
    predictions = results;
  } catch (error) {
    console.warn('FaceMesh prediction failed:', error);
  }
  isPredicting = false;
}

function drawFaceLines() {
  const face = predictions[0];
  if (!face || !face.scaledMesh) return;

  stroke(255, 0, 0);
  strokeWeight(1);
  noFill();

  for (let i = 0; i < faceLineIndices.length - 1; i++) {
    const idxA = faceLineIndices[i];
    const idxB = faceLineIndices[i + 1];
    const pointA = face.scaledMesh[idxA];
    const pointB = face.scaledMesh[idxB];
    if (pointA && pointB) {
      line(pointA[0], pointA[1], pointB[0], pointB[1]);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (capture) {
    capture.size(windowWidth / 2, windowHeight / 2);
  }
}
