BlurShader = {
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

	fragmentShader: [
		"varying vec2 vTexCoord;",
		"uniform sampler2D map;",
		"uniform vec2 resolution;",
		
		"void main() {",
		"  vec2 texStepX = vec2(1.0, 0.0) / resolution;",
		"  vec2 texStepY = vec2(0.0, 1.0) / resolution;",
		
		"  vec4 t00 = texture2D(map, vTexCoord - texStepX - texStepY);",
		"  vec4 t01 = texture2D(map, vTexCoord            - texStepY);",
		"  vec4 t02 = texture2D(map, vTexCoord + texStepX - texStepY);",
		"  vec4 t10 = texture2D(map, vTexCoord - texStepX);",
		"  vec4 t11 = texture2D(map, vTexCoord           );",
		"  vec4 t12 = texture2D(map, vTexCoord + texStepX);",
		"  vec4 t20 = texture2D(map, vTexCoord - texStepX + texStepY);",
		"  vec4 t21 = texture2D(map, vTexCoord            + texStepY);",
		"  vec4 t22 = texture2D(map, vTexCoord + texStepX + texStepY);",
		
		"  vec4 outColor = (t00 + t01 + t02 + t10 + t11 + t12 + t20 + t21 + t22) / 9.0;",
		"  gl_FragColor = outColor;",
		"}",
		""
	].join("\n"),

	side: THREE.DoubleSide
};
