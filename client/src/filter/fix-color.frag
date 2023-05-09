precision mediump float;
uniform sampler2D u_image;
uniform float u_target_hue_shift;
uniform float u_source_hue;
uniform float u_source_hue_range;
uniform float u_source_sv_range;
uniform float u_target_value;
uniform float u_target_saturation;
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
vec3 fix_color(vec3 source) {
  vec3 hsv_source = rgb2hsv(source);
  // calculate the hue difference
  float source_hue_diff = abs(hsv_source.x - u_source_hue);
  if (source_hue_diff > 0.5) {
    source_hue_diff = 1.0 - source_hue_diff;
  }
  // return original color if it is not in range
  float min_sv = 1.0 - u_source_sv_range;
  if (
    source_hue_diff > u_source_hue_range / 2.0 ||
    (hsv_source.y + hsv_source.z) / 2.0 < min_sv
  ) {
    return source;
  }
  vec3 target = hsv2rgb(vec3(
    mod(u_source_hue + u_target_hue_shift, 1.0),
    u_target_saturation,
    u_target_value
  ));
  float modifier =
    ((hsv_source.y - min_sv) / u_source_sv_range +
    (hsv_source.z - min_sv) / u_source_sv_range) / 2.0 *
    (u_source_hue_range - source_hue_diff) / u_source_hue_range;
  // logarithmic curve
  modifier = log(modifier * 9.0 + 1.0) / log(10.0);
  return source * (1.0 - modifier) + target * modifier;
}

void main() {
  vec4 image_color = texture2D(u_image, v_texCoord);
  gl_FragColor = vec4(fix_color(image_color.rgb), image_color.a);
}