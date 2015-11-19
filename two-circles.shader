float sqr(float x)
{
    return x * x;
}

float circle_(vec2 p, vec2 center, float r)
{
    float r_sqr = sqr(r);
    float distance = r_sqr - (sqr(p.x - center.x) + sqr(p.y - center.y));
    return clamp(distance / r_sqr, 0.0, 1.0);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    
    float R = 100.0;
    vec2 c1 = vec2(R, iResolution.y * 0.5);
    vec2 c2 = vec2(iResolution.x - R, iResolution.y * 0.5);
    c1.x += sin(iGlobalTime) * 100.0 + 100.0;
    c2.x -= sin(iGlobalTime) * 100.0 + 100.0;
    float res = circle_(fragCoord, c1, R) + circle_(fragCoord, c2, R);
    res *= 0.5;
    
    res = pow(res, 1.0 / 2.2);
    
	fragColor = vec4(vec3(res),1.0);
}
