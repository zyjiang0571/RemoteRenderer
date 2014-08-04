const float epsilon = 0.000055;

const int MaxSizeKernel = 25;

uniform sampler2D tex;
uniform vec2 size;

ivec2 offset[MaxSizeKernel] =
{
	ivec2(-2, -2), ivec2(-2, -1), ivec2(-2, 0), ivec2(-2, 1), ivec2(-2, 2),
	ivec2(-1, 2),ivec2(-1, -1), ivec2(-1, 0), ivec2(-1, 1),ivec2(-1, 2),
	ivec2(0, 2),ivec2(0, -1), ivec2(0, 0), ivec2(0, 1), ivec2(0, 2),
	ivec2(1, 2),ivec2(1, -1), ivec2(1, 0), ivec2(1, 1),ivec2(1, 2),
	ivec2(2, -2), ivec2(2, -1), ivec2(2, 0), ivec2(2, 1), ivec2(2, 2)
};

/*int kernel[MaxSizeKernel] = 
{
	1, 2, 1,
	2, 4, 2,
	1, 2, 1
};*/

int kernel[MaxSizeKernel] =
{
	1, 4, 7, 4, 1,
	4, 16, 26, 16, 4,
	7, 26, 41, 26, 7,
	4, 16, 26, 16, 4,
	1, 4, 7, 4, 1
};

void main()
{
	gl_FragDepth = gl_FragCoord.z;
	ivec2 iSize = ivec2(int(size.x), int(size.y));
	ivec2 ipos = ivec2(int(gl_FragCoord.x), int(gl_FragCoord.y));	
	int i;
	float sum = 0.0;
	float norm = 0.0;
	float Zp = texture2D(tex, gl_FragCoord.xy / size).x;
	for(i = 0; i < MaxSizeKernel; ++i)
	{
		ivec2 tmp = ipos + offset[i];
		if(tmp.x >= 0 && tmp.x < iSize.x && tmp.y >= 0 && tmp.y < iSize.y)
		{
			vec2 tPos = vec2(float(tmp.x) + 0.5, float(tmp.y) + 0.5);
			vec4 sample = texture2D(tex, tPos / size);
			float coef = 1.0 / (epsilon + abs(Zp - sample.x) / 15000.0);
			coef *= float(kernel[i]);
			sum += coef * sample.x;
			norm += coef;
		}
	}
	sum = sum / norm;
	gl_FragColor = vec4(vec3(sum), 1.0);
}