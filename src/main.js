import './style.css';
import { createScene } from './scene/createScene.js';
import { createDrivingController } from './tractor/drivingController.js';
import { loadTractor } from './tractor/loadTractor.js';

const container = document.querySelector('#scene');
if (!container) {
  throw new Error('Could not find the #scene container.');
}

const { scene, camera, renderer, groundLevel } = createScene(container);
const tractor = loadTractor(scene, groundLevel);
const drivingController = createDrivingController({ tractor, camera });

let previousFrameTime = performance.now();

renderer.setAnimationLoop(() => {
  const frameTime = performance.now();
  const delta = Math.min((frameTime - previousFrameTime) / 1000, 0.05);
  previousFrameTime = frameTime;

  drivingController.update(delta);
  renderer.render(scene, camera);
});
