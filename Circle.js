class Circle {
    constructor(centerX, centerY, radius, color, segments = 32) {
      this.centerX = centerX;
      this.centerY = centerY;
      this.radius = radius;
      this.color = color;
      this.segments = segments;
    }
 
    render() {
      const vertices = [];
      vertices.push(this.centerX, this.centerY); 
 
      for (let i = 0; i <= this.segments; i++) {
        const angle = (2 * Math.PI * i) / this.segments;
        const x = this.centerX + this.radius * Math.cos(angle);
        const y = this.centerY + this.radius * Math.sin(angle);
        vertices.push(x, y);
      }
 
      const vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_Position);
 
      gl.uniform4f(u_FragColor, ...this.color);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, this.segments + 2);
 
      gl.deleteBuffer(vertexBuffer);
    }
  }
 

