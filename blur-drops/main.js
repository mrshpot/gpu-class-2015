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

	var renderTargetWidth = 512;
	var renderTargetHeight = 512;
	var renderTargetA = new THREE.WebGLRenderTarget(renderTargetWidth, renderTargetHeight);
	var renderTargetB = new THREE.WebGLRenderTarget(renderTargetWidth, renderTargetHeight);
	var cameraRTT = new THREE.OrthographicCamera(
		renderTargetWidth/-2, renderTargetWidth/2, // left, right
		renderTargetHeight/2, renderTargetHeight/-2, // top, bottom
		1, 1000); // near, far
	cameraRTT.position.z = 500;
	var sceneRTT = new THREE.Scene();
	var rttPassGeometry = new THREE.PlaneGeometry(renderTargetWidth, renderTargetHeight, 1);
	
	var rttBlurPassShader = new THREE.ShaderMaterial(BlurShader);
	var rttBlurPass = new THREE.Mesh(rttPassGeometry, rttBlurPassShader);
	sceneRTT.add(rttBlurPass);
	rttBlurPass.visible = false;

	var rttPassthroughShader = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, map: renderTargetA });
	var rttPassthrough = new THREE.Mesh(rttPassGeometry, rttPassthroughShader);
	sceneRTT.add(rttPassthrough);
	rttPassthrough.visible = false;

	var rttRectMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });
	var rttRectGeometry = new THREE.PlaneGeometry(1, 1, 1);
	var rttRect = new THREE.Mesh(rttRectGeometry, rttRectMaterial);
	sceneRTT.add(rttRect);
	rttRect.position.z = 1;
	rttRect.visible = false;

	var swapRenderTargets = function() {
		var tmp = renderTargetA;
		renderTargetA = renderTargetB;
		renderTargetB = tmp;
	}
	var rttPass = function(pass) {
		var rtSrc = renderTargetA;
		var rtDst = renderTargetB;
		var passMaterial = pass.material;
		if (passMaterial.uniforms != undefined) {
			passMaterial.uniforms.map.value = rtSrc;
			passMaterial.uniforms.resolution.value.set(rtSrc.width, rtSrc.height);
		} else {
			passMaterial.map = rtSrc;
		}
		pass.visible = true;
		renderer.render(sceneRTT, cameraRTT, rtDst);
		pass.visible = false;
		swapRenderTargets();
	}
	var rttAddRectangle = function(x, y, w, h, color) {
		rttRect.position.x = x - renderTargetWidth/2;
		rttRect.position.y = y - renderTargetHeight/2;
		rttRect.scale.x = w;
		rttRect.scale.y = h;
		rttRect.material.color.set(color);
		
		rttRect.visible = true;
		rttPass(rttPassthrough)
		// rttPass(rttBlurPass)
		rttRect.visible = false;
	}
	
	var scene = new THREE.Scene();

	// scene setup goes here
	var displayGeometry = new THREE.PlaneGeometry(1, 1, 1);
	var displayMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });
	var displayPlane = new THREE.Mesh(displayGeometry, displayMaterial);
	scene.add(displayPlane);

	camera.position.z = 1;

	var nextSpawn = 0;
	var update = function(t) {
		if (t > nextSpawn) {
			var x = Math.random() * renderTargetWidth;
			var y = Math.random() * renderTargetHeight;
			var w = 20;
			var h = 20;
			var r = Math.random() * 255;
			var g = Math.random() * 255;
			var b = Math.random() * 255;
			var color = (r << 16) | (g << 8) | b;
			// var color = 0xFFFFFF;
			rttAddRectangle(x, y, w, h, color);
			console.log("addRectangle x: "+x+", y: "+y);
			
			nextSpawn = t + 0.1;
		}
	}
	var render = function() {
		rttPass(rttBlurPass);
		
		displayMaterial.map = renderTargetB;
		renderer.render(scene, camera);
		// renderer.render(sceneRTT, cameraRTT); // debug
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
