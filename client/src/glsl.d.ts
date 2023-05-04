declare const rawGLSL: string;
declare module '*.glsl' {
  export default rawGLSL;
}
declare module '*.vert' {
  export default rawGLSL;
}
declare module '*.frag' {
  export default rawGLSL;
}
