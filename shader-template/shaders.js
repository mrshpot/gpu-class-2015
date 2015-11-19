PlaneShader = {
	uniforms: {
		"inTexture": { type: "t", value: 0 },
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
		
		"void main() {",
		"  gl_FragColor = vec4(vTexCoord.x, vTexCoord.y, 0.5, 1.0);",
		"}",
		""
	].join("\n")
};
