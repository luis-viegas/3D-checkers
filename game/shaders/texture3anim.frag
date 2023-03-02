#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;
uniform float timeFactor;

uniform float red;
uniform float green;
uniform float blue;

void main() {
	float offset = sin(timeFactor);
	if(offset < 0.0)
		offset = 0.0;

	vec4 colorA = texture2D(uSampler, vTextureCoord);
	vec4 filter = texture2D(uSampler2, vec2(0.0,0.1)+vTextureCoord);
	
	


	vec4 colorB= vec4(red,green,blue,1.0);

	vec4 color = mix(colorA, colorB, offset);

	
	gl_FragColor = color;
	
}
