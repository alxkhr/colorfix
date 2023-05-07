precision mediump float;
uniform sampler2D u_image;
uniform float u_target_hue_shift;
varying vec2 v_texCoord;

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// change the hue and value of the color if it is reddish
vec3 fix_color(vec3 c) {
  vec3 hsv = rgb2hsv(c);
  if (hsv.y > 0.5 && hsv.z > 0.5 && (hsv.x > 0.9 || hsv.x < 0.1)) {
    hsv.x = mod(hsv.x + u_target_hue_shift, 1.0);
    hsv.z = 1.0;
    return hsv2rgb(hsv);
  }
  return c;
}


void main() {
  vec4 image_color = texture2D(u_image, v_texCoord);
  gl_FragColor = vec4(fix_color(image_color.rgb), image_color.a);
}