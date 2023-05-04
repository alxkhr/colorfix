import rawVertexShader from './default.vert';

function initShader(
  rawShader: string,
  type: number,
  gl: WebGLRenderingContext,
  glProgram: WebGLProgram,
) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, rawShader);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(
      gl.getShaderInfoLog(shader) || 'unknown error compiling shader',
    );
  }
  gl.attachShader(glProgram, shader);
}

export function getWebGLProgram(
  rawShaders: string[],
  gl: WebGLRenderingContext,
): WebGLProgram {
  const glProgram = gl.createProgram()!;
  initShader(rawVertexShader, gl.VERTEX_SHADER, gl, glProgram);
  rawShaders.forEach((rawShader) =>
    initShader(rawShader, gl.FRAGMENT_SHADER, gl, glProgram),
  );
  gl.linkProgram(glProgram);
  if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
    throw new Error(
      gl.getShaderInfoLog(glProgram) || 'unknown error linking gl program',
    );
  }
  gl.validateProgram(glProgram);
  if (!gl.getProgramParameter(glProgram, gl.VALIDATE_STATUS)) {
    throw new Error(
      gl.getShaderInfoLog(glProgram) || 'unknown error linking gl program',
    );
  }
  gl.useProgram(glProgram);
  return glProgram;
}
