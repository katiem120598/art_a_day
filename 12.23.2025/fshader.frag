#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

void main() {
  vec2 p = gl_FragCoord.xy;          // pixel coords
  float d = distance(p, u_mouse);    // distance to mouse
  float f1 = 10.0;
  float f2 = 7.0;
  float f3 = 13.0;
  float r1 = mod(u_time,f1);
  float r2 = mod(u_time, f2);
  float r3 = mod(u_time, f3);
  float r11 = r1*r1*r1+5.0;
  float r12 = r1*r1*r1+4.0;
  float r21 = r2*r2+7.0;
  float r22 = r2*r2+5.0;
  float r31 = r3*r3*3.0+5.0;
  float r32 = r3*r3*3.0+2.0;

  // 1.0 inside the circle, 0.0 outside
  float inside11 = step(d, r11);
  float inside12 = step(d, r12);
  float inside21 = step(d, r21);
  float inside22 = step(d, r22);
  float inside31 = step(d, r31);
  float inside32 = step(d, r32);
  float inside = inside11-inside12+inside21-inside22+inside31-inside32;

  // white outside, black inside
  vec3 col = mix(vec3(0.0), vec3(1.0),  inside);

  gl_FragColor = vec4(col, 1.0);
}
