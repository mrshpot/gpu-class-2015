function main() {
	var camera, renderer;
	var onWindowResize = function() {
		var width = window.innerWidth;
		var height = window.innerHeight;
		var aspect = width / height;
		
		camera.aspect = aspect;
		camera.updateProjectionMatrix();
		
		renderer.setSize(width, height);
	}
	
	var defaultAspect = 1.0;
	var camera = new THREE.PerspectiveCamera(75, defaultAspect, 0.1, 10);
	var renderer = new THREE.WebGLRenderer();
	onWindowResize(); // initialize renderer with current size
	renderer.setClearColor(0x333333, 1);
	document.body.appendChild(renderer.domElement);
	window.addEventListener('resize', onWindowResize, false);
	
	var scene = new THREE.Scene();

	// scene setup goes here
	var geometry = new THREE.PlaneGeometry(1, 1, 1);
	var material = new THREE.ShaderMaterial(PlaneShader);
	var plane = new THREE.Mesh(geometry, material);
	scene.add(plane);

	camera.position.z = 1;

	var update = function(t) {
	}
	
	var render = function() {
		renderer.render(scene, camera);
	}
	var nextFrame = function() {
		window.requestAnimationFrame(nextFrame);
		var t_sec = Date.now() / 1000.0;
		update(t_sec);
		render();
	}

	// start main loop
	nextFrame();
}

main();
