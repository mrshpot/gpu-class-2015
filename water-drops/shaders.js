PackFunctions = [
	"vec4 pack_depth(const in float depth)",
	"{",
	"    const vec4 bit_shift = vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);",
	"    const vec4 bit_mask  = vec4(0.0, 1.0/256.0, 1.0/256.0, 1.0/256.0);",
	"    vec4 res = fract(depth * bit_shift);",
	"    res -= res.xxyz * bit_mask;",
	"    return res;",
	"}",
	"",
	"float unpack_depth(const in vec4 rgba_depth)",
	"{",
	"    const vec4 bit_shift = vec4(1.0/(256.0*256.0*256.0), 1.0/(256.0*256.0), 1.0/256.0, 1.0);",
	"    float depth = dot(rgba_depth, bit_shift);",
	"    return depth;",
	"}",
	""
].join("\n");

UpdateShader = {
	uniforms: {
		"map": { type: "t", value: 0 },
		"resolution": { type: "v2", value: new THREE.Vector2(1, 1) }
	},

	vertexShader: [
		"varying vec2 vTexCoord;",
		
		"void main() {",
		"  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);",
		"  gl_Position = projectionMatrix * mvPosition;",
		"  vTexCoord = uv;",
		"}",
		""
	].join("\n"),

	fragmentShader: PackFunctions + [
		"varying vec2 vTexCoord;",
		"uniform sampler2D map;",
		"uniform vec2 resolution;",
		
		"void main() {",
		"  vec2 texStepX = vec2(1.0, 0.0) / resolution;",
		"  vec2 texStepY = vec2(0.0, 1.0) / resolution;",
		
		"  float t00 = unpack_depth(texture2D(map, vTexCoord - texStepX - texStepY));",
		"  float t01 = unpack_depth(texture2D(map, vTexCoord            - texStepY));",
		"  float t02 = unpack_depth(texture2D(map, vTexCoord + texStepX - texStepY));",
		"  float t10 = unpack_depth(texture2D(map, vTexCoord - texStepX));",
		"  float t11 = unpack_depth(texture2D(map, vTexCoord           ));",
		"  float t12 = unpack_depth(texture2D(map, vTexCoord + texStepX));",
		"  float t20 = unpack_depth(texture2D(map, vTexCoord - texStepX + texStepY));",
		"  float t21 = unpack_depth(texture2D(map, vTexCoord            + texStepY));",
		"  float t22 = unpack_depth(texture2D(map, vTexCoord + texStepX + texStepY));",
		
		"  float outValue = (t00 + t01 + t02 + t10 + t11 + t12 + t20 + t21 + t22) / 9.0;",
		"  gl_FragColor = pack_depth(outValue);",
		"}",
		""
	].join("\n"),

	side: THREE.DoubleSide
};

DropShader = {
	uniforms: {
		"map": { type: "t", value: 0 },
		"resolution": { type: "v2", value: new THREE.Vector2(1, 1) },
		"dropPos": { type: "v2", value: new THREE.Vector2(0, 0) },
		"dropR": { type: "f", value: 0 },
		"dropStrength": { type: "f", value: 1.0 }
	},

	vertexShader: [
		"varying vec2 vTexCoord;",
		
		"void main() {",
		"  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);",
		"  gl_Position = projectionMatrix * mvPosition;",
		"  vTexCoord = uv;",
		"}",
		""
	].join("\n"),

	fragmentShader: PackFunctions + [
		"varying vec2 vTexCoord;",
		"uniform sampler2D map;",
		"uniform vec2 resolution;",
		"uniform vec2 dropPos;",
		"uniform float dropR;",
		"uniform float dropStrength;",

		"float sqr(float x) { return x * x; }",
		
		"float circle(vec2 p, vec2 center, float r) {",
		// "  float d = distance(p, center);",
		"  float d = sqr(r) - (sqr(p.x - center.x) + sqr(p.y - center.y));",
		"  return clamp(d / sqr(r), 0.0, 1.0);",
		"}",
		
		"void main() {",
		"  vec4 packedValue = texture2D(map, vTexCoord);",
		"  float value = unpack_depth(packedValue);",
		// "  value += 1.0 * circle(vTexCoord, vec2(0.5, 0.5), 0.1);",
		"  value += dropStrength * circle(vTexCoord, dropPos/resolution, dropR/resolution.x);",
		"  vec4 outColor = pack_depth(value);",
		"  gl_FragColor = outColor;",
		"}",
		""
	].join("\n"),

	side: THREE.DoubleSide
};

DisplayShader = {
	uniforms: {
		"map": { type: "t", value: 0 },
		"resolution": { type: "v2", value: new THREE.Vector2(1, 1) }
	},

	vertexShader: [
		"varying vec2 vTexCoord;",
		
		"void main() {",
		"  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);",
		"  gl_Position = projectionMatrix * mvPosition;",
		"  vTexCoord = uv;",
		"}",
		""
	].join("\n"),

	fragmentShader: PackFunctions + [
		"varying vec2 vTexCoord;",
		"uniform sampler2D map;",
		
		"void main() {",
		"  vec4 packedValue = texture2D(map, vTexCoord);",
		"  float value = unpack_depth(packedValue);",
		"  vec4 outColor = vec4(vec3(value), 1.0);",
		// "  vec4 outColor = packedValue;",
		"  gl_FragColor = outColor;",
		"}",
		""
	].join("\n"),

	side: THREE.DoubleSide
};

