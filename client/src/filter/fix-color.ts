import { getWebGLProgram } from './shader';
import detailContrastShader from './fix-color.frag';

export function fixColorFilter(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
) {
  const gl = canvas.getContext('webgl');
  if (!gl) {
    throw new Error('No GL context in canvas?');
  }

  const glProgram = getWebGLProgram([detailContrastShader], gl);

  canvas.width = image.width;
  canvas.height = image.height;

  // look up where the vertex data needs to go.
  const positionLocation = gl.getAttribLocation(glProgram, 'a_position');
  const texcoordLocation = gl.getAttribLocation(glProgram, 'a_texCoord');
  // Create a buffer to put three 2d clip space points in
  const positionBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // Set a rectangle the same size as the image.
  const w = canvas.width;
  const h = canvas.height;
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0, 0, w, 0, 0, h, 0, h, w, 0, w, h]),
    gl.STATIC_DRAW,
  );
  // provide texture coordinates for the rectangle.
  const texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
    ]),
    gl.STATIC_DRAW,
  );
  // Create a texture.
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  // Upload the image into the texture.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  // lookup uniforms
  const canvasResolutionLocation = gl.getUniformLocation(
    glProgram,
    'u_canvas_resolution',
  );
  const targetHueShiftLocation = gl.getUniformLocation(
    glProgram,
    'u_target_hue_shift',
  );
  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, canvas.width, canvas.height);
  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  // Tell it to use our program (pair of shaders)
  gl.useProgram(glProgram);
  // Turn on the position attribute
  gl.enableVertexAttribArray(positionLocation);
  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  // Turn on the texcoord attribute
  gl.enableVertexAttribArray(texcoordLocation);
  // bind the texcoord buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
  gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);
  // set the resolution
  gl.uniform2f(canvasResolutionLocation, canvas.width, canvas.height);
  // return a function to draw the filter
  return function (targetHueShift: number) {
    // set the value
    gl.uniform1f(targetHueShiftLocation, targetHueShift);
    // Draw the rectangle.
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };
}
