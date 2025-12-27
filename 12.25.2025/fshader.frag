#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.2831853071
#define THICKNESS 0.2

uniform vec2 u_resolution;
uniform vec2 u_stored1;
uniform vec2 u_stored2;
uniform vec2 u_stored3;
uniform vec2 u_stored4;
uniform vec2 u_stored5;
uniform vec3 u_col1;
uniform vec3 u_col2;
uniform vec3 u_col3;
uniform vec3 u_col4;
uniform vec3 u_col5;
uniform float u_time1;
uniform float u_time2;
uniform float u_time3;
uniform float u_time4;
uniform float u_time5;

void main() {
    vec2 p = gl_FragCoord.xy; 
    float d1 = distance(p, u_stored1);
    float d2 = distance(p, u_stored2);
    float d3 = distance(p, u_stored3);
    float d4 = distance(p, u_stored4);
    float d5 = distance(p, u_stored5);
    float f1 = 10.0;
    float f2 = 7.0;
    float f3 = 13.0;

    float r11 = 10.0*u_time1+45.0;
    float r12 = 10.0*u_time1+43.0;

    float r21 = 5.0*u_time2*u_time2+23.0;
    float r22 = 3.0*u_time2*u_time2+22.0;

    float r31 = 5.0*u_time3*u_time3+60.0; 
    float r32 = 5.0*u_time3*u_time3+57.0;

    float r41 = u_time4*u_time4*u_time4+15.0;
    float r42 = u_time4*u_time4+14.0;

    float r51 = 10.0*u_time5 + 35.0;
    float r52 = 10.0*u_time5 + 30.0;

    // 1.0 inside the circle, 0.0 outside
    float inside11 = step(r11, d1);
    float inside12 = step(r12, d1);
    float inside21 = step(r21, d2);
    float inside22 = step(r22, d2);
    float inside31 = step(r31, d3);
    float inside32 = step(r32, d3);
    float inside41 = step(r41, d4);
    float inside42 = step(r42, d4);
    float inside51 = step(r51, d5);
    float inside52 = step(r52, d5);
    
    vec3 col1 = u_col1*(inside12-inside11);
    vec3 col2 = u_col2*(inside22-inside21);
    vec3 col3 = u_col3*(inside32-inside31);
    vec3 col4 = u_col4*(inside42-inside41);
    vec3 col5 = u_col5*(inside52-inside51);

    // white outside, black inside
    vec3 sum =col1+col2+col3+col4+col5;
    vec4 clr = vec4(sum, 1.0);
    

    gl_FragColor = clr;
}