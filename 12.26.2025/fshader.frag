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

    //trying something new... tbd
    
    float wavespeed = 10.0;
    float period = 25.0;
    float u_duration = 5.0;
    float largestdist = u_duration*wavespeed*period;

    float maxdist1 = u_time1*wavespeed*period;
    float currdist1 = mod(d1,period);
    float distfact1 = step(d1,maxdist1);
    float gray1 = (1.0-u_time1/u_duration)*(1.0-(d1/largestdist))*(((sin(d1*.08-u_time1*wavespeed))*0.5+0.5)*distfact1);

    float maxdist2 = u_time2*wavespeed*period;
    float currdist2 = mod(d2,period);
    float distfact2 = step(d2,maxdist1);
    float gray2 = (1.0-u_time2/u_duration)*(1.0-(d2/largestdist))*(((sin(d2*.08-u_time2*wavespeed))*0.5+0.5)*distfact2);

    float maxdist3 = u_time3*wavespeed*period;
    float currdist3 = mod(d3,period);
    float distfact3 = step(d3,maxdist3);
    float gray3 = (1.0-u_time3/u_duration)*(1.0-(d3/largestdist))*(((sin(d3*.08-u_time3*wavespeed))*0.5+0.5)*distfact3);

    float maxdist4 = u_time4*wavespeed*period;
    float currdist4 = mod(d4,period);
    float distfact4 = step(d4,maxdist1);
    float gray4 = (1.0-u_time4/u_duration)*(1.0-(d4/largestdist))*(((sin(d4*.08-u_time4*wavespeed))*0.5+0.5)*distfact4);

    float maxdist5 = u_time5*wavespeed*period;
    float currdist5 = mod(d5,period);
    float distfact5 = step(d5,maxdist1);
    float gray5 = (1.0-u_time5/u_duration)*(1.0-(d5/largestdist))*(((sin(d5*.08-u_time5*wavespeed))*0.5+0.5)*distfact5);    

    //gl_FragColor = clr;
    vec3 col1 = u_col1*vec3(gray1,gray1,gray1);
    vec3 col2 = u_col2*vec3(gray2,gray2,gray2);
    vec3 col3 = u_col3*vec3(gray3,gray3,gray3);
    vec3 col4 = u_col4*vec3(gray4,gray4,gray4);
    vec3 col5 = u_col5*vec3(gray4,gray4,gray4);
    vec3 colsum = col1+col2+col3+col4+col5;
    vec4 clr = vec4(colsum,1.0);

    gl_FragColor = clr;
}