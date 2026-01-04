#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.2831853071
#define M_PI 3.14159265359
#define THICKNESS 0.2

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_waveform;
uniform sampler2D u_spectrum;

//inspired by https://www.shadertoy.com/view/X32fRV

//defining functions used later
vec4 capsule(vec4 color, vec4 background, vec4 region, vec2 uv);
vec2 rotate(vec2 point, vec2 center, float angle);
vec4 bar(vec4 color, vec4 background, vec2 position, vec2 dimensions, vec2 uv);
vec4 rays(vec4 color, vec4 background, vec2 position, float radius, float rayCount, float ray_length, sampler2D sound, vec2 uv);

const float RAYS = 255.0;
float reset = 0.0;

void main() {
    float aspect = u_resolution.x/u_resolution.y;
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.x *= aspect;
    float d = distance(vec2(aspect/2.0,0.5),uv);
    vec4 color = mix(vec4(0.0,0.0,0.0,1.0),vec4(0.0,0.0,0.0,1.0),d);

    
    float RADIUS = 0.23;
    float RAY_LENGTH = .5;

    color = rays(vec4(1.0), color, vec2(aspect/2.0, 1.0/2.0), RADIUS, RAYS, RAY_LENGTH, u_waveform, uv);

    gl_FragColor = color;
}

vec4 rays(vec4 color, vec4 background, vec2 position, float radius, float rayCount, float ray_length, sampler2D sound, vec2 uv)
{
    float inside = (1.0 - ray_length) * radius; //empty part of circle
    float outside = radius - inside; //rest of circle
    float base_length = 18.5;
    float circle = 2.0*M_PI*inside; //circle lenght
    for(int i = 1; i <= int(RAYS); i++)
    {
        if (float(i)>rayCount) break;

        float len = outside*(40.0*(texture2D(sound, vec2(float(i)/rayCount, 0.0)).x)-(base_length));
        
        background = bar(color, background, vec2(position.x, position.y+inside), vec2(circle/(rayCount*2.0), len), rotate(uv, position, 360.0/rayCount*float(i))); //Added capsules
    }
    return background; //output
}

vec4 bar(vec4 color, vec4 background, vec2 position, vec2 dimensions, vec2 uv)
{
    return capsule(color, background, vec4(position.x, position.y+dimensions.y/2.0, dimensions.x/2.0, dimensions.y/2.0), uv); //Just transform rectangle a little
}

vec4 capsule(vec4 color, vec4 background,  vec4 region, vec2 uv) //capsule
{
    if(uv.x > (region.x-region.z) && uv.x < (region.x+region.z) &&
       uv.y > (region.y-region.w) && uv.y < (region.y+region.w) || 
       distance(uv, region.xy - vec2(0.0, region.w)) < region.z || 
       distance(uv, region.xy + vec2(0.0, region.w)) < region.z)
        return vec4(color.rgb, 1.0);
    return vec4(background.rgb,1.0);
}

vec2 rotate(vec2 point, vec2 center, float angle) //rotating point around the center
{
    float s = sin(radians(angle));
    float c = cos(radians(angle));
    
    point.x -= center.x;
    point.y -= center.y;
    
    float x = point.x * c - point.y * s;
    float y = point.x * s + point.y * c;
    
    point.x = x + center.x;
    point.y = y + center.y;
    
    return point;
}