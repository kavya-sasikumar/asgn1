class Triangle {
    constructor(vertices, color) {
      this.vertices = vertices; 
      this.color = color;
    }
 
    render() {
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_Position);
      gl.uniform4f(u_FragColor, ...this.color);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  }
 

