const VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = u_Size;\n' +
  '}\n';

const FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

let canvas, gl;
let a_Position, u_FragColor, u_Size;
let shapesList = [];
let currentMode = 'point';
let triangleVertices = [];

function main() {
  setupWebGL();
  connectVariablesToGLSL();

  canvas.onmousedown = (ev) => handleClick(ev);
  canvas.onmousemove = (ev) => {
    if (ev.buttons === 1 && currentMode === 'point') handleClick(ev);
  };

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function setupWebGL() {
  canvas = document.getElementById('webgl');
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
}

function connectVariablesToGLSL() {
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Shader init failed');
    return;
  }
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
}

class Point {
  constructor(x, y, color, size) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
  }
  render() {
    gl.vertexAttrib3f(a_Position, this.x, this.y, 0.0);
    gl.uniform4f(u_FragColor, ...this.color);
    gl.uniform1f(u_Size, this.size);
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}

function handleClick(ev) {
  const [x, y] = convertCoordinates(ev);
  const r = document.getElementById('rSlider').value / 255;
  const g = document.getElementById('gSlider').value / 255;
  const b = document.getElementById('bSlider').value / 255;
  const a = 1.0;
  const size = parseFloat(document.getElementById('sizeSlider').value);
  const color = [r, g, b, a];

  if (currentMode === 'point') {
    shapesList.push(new Point(x, y, color, size));
  } else if (currentMode === 'triangle') {
    triangleVertices.push(x, y);
    if (triangleVertices.length === 6) {
      shapesList.push(new Triangle(triangleVertices.slice(), color));
      triangleVertices = [];
    }
  } else if (currentMode === 'circle') {
    const radius = 0.05;
    const segments = parseInt(document.getElementById('segmentsSlider').value);
    shapesList.push(new Circle(x, y, radius, color, segments));
  }

  renderAllShapes();
}

function convertCoordinates(ev) {
  const rect = canvas.getBoundingClientRect();
  const x = ((ev.clientX - rect.left) - canvas.width / 2) / (canvas.width / 2);
  const y = (canvas.height / 2 - (ev.clientY - rect.top)) / (canvas.height / 2);
  return [x, y];
}

function renderAllShapes() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  for (const shape of shapesList) {
    shape.render();
  }
}

function clearCanvas() {
  shapesList = [];
  triangleVertices = [];
  renderAllShapes();
}

function setDrawingMode(mode) {
  currentMode = mode;
  triangleVertices = [];
}

function drawPicture() {
  const faceColor = [1.0, 1.0, 0.0, 1.0]; 
  const faceCenter = [0.0, 0.0];
  const faceRadius = 0.5;
  const segments = 24;
  shapesList.push(new Circle(faceCenter[0], faceCenter[1], faceRadius, faceColor, segments));

  const eyeColor = [0.0, 0.0, 0.0, 1.0];
  shapesList.push(new Circle(-0.15, 0.15, 0.05, eyeColor, 12));
  shapesList.push(new Circle(0.15, 0.15, 0.05, eyeColor, 12));

  const smileColor = [1.0, 0.0, 0.0, 1.0]; 
  const cx = 0.0, cy = -0.12; 
  const r = 0.35;
  const smileTriangles = 16;

  for (let i = 0; i < smileTriangles; i++) {
    const angle1 = Math.PI + (Math.PI * i / smileTriangles);
    const angle2 = Math.PI + (Math.PI * (i + 1) / smileTriangles);
    const x1 = cx + r * Math.cos(angle1);
    const y1 = cy + r * Math.sin(angle1);
    const x2 = cx + r * Math.cos(angle2);
    const y2 = cy + r * Math.sin(angle2);
    shapesList.push(new Triangle([cx, cy, x1, y1, x2, y2], smileColor));
  }

  renderAllShapes();
}


