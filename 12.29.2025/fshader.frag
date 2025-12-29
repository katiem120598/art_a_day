#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.2831853071
#define THICKNESS 0.2

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_waveform;
uniform sampler2D u_spectrum;

void main() {
    float aspect = u_resolution.x/u_resolution.y;
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.x *= aspect;
    float d = distance(vec2(aspect/2.0,0.5),uv);
    vec4 color = mix(vec4(0.0,0.0,0.0,0.0),vec4(0.0,0.0,0.0,0.0),d);

    const float rays = 96.0;
    float RADIUS = 0.615;
    float RAY_LENGTH = 0.3;

    //https://www.shadertoy.com/view/X32fRV











    float d = distance(n,cntr);

    vec4 wave = texture2D(u_waveform, n);
    vec4 spec = texture2D(u_spectrum,n);

    // Render spectrum as sharp vertical bars with value height

    float thickness = 1.0/u_resolution.y*3.0;

    float v = wave.x;
    float w = spec.x;
    float f = u_key1*min(smoothstep(v - THICKNESS, v, n.y), smoothstep(v + thickness, v, n.y)) + (1.0-u_key1)*min(smoothstep(w - THICKNESS, w, n.y), smoothstep(w + thickness, w, n.y));
    float g = u_key1*step(abs(n.y - v),thickness) + (1.0-u_key1)*step(abs(n.y - w),thickness);
    float b = mod(floor(gl_FragCoord.x/3.0),3.0);
    f *= u_key2;
    g *= (1.0-u_key2);
    float band1 = clamp(1.0-b,0.0,1.0);
    float band2 = 1.0-abs(b-1.0);
    float band3 = clamp(b-1.0,0.0,1.0);
    float rf = band1*255.0/255.0 + band2*0.0 + band3*255.0/255.0;
    float gf = band1*0.0 + band2*150.0/255.0 + band3*255.0/255.0;
    float bf = band1*0.0 + band2*50.0/255.0 + band3*255.0/255.0;

    vec4 clr = vec4((g+f)*rf, (g+f)*gf,(g+f)*bf, 1.0);
    

    gl_FragColor = clr;
}