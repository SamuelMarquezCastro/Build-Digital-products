import './style.css';
import { createScene } from './scene/createScene.js';
import { createDrivingController } from './tractor/drivingController.js';
import { loadTractor } from './tractor/loadTractor.js';

const container = document.querySelector('#scene');
if (!container) {
  throw new Error('Could not find the #scene container.');

const scene = new THREE.Scene();
const fogColor = new THREE.Color('#cbd5c3');
scene.background = fogColor;
scene.fog = new THREE.Fog(fogColor, 12, 55);

const camera = new THREE.PerspectiveCamera(
  50,
  container.clientWidth / container.clientHeight,
  0.1,
  100,
);
camera.position.set(3, 2.5, 4);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 1.5, 1.5),
  new THREE.MeshStandardMaterial({ color: '#22c55e', roughness: 0.45 }),
);
scene.add(cube);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: '#3f8f45', roughness: 1 }),
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.76;
scene.add(ground);

scene.add(new THREE.AmbientLight(0xffffff, 1.5));
const keyLight = new THREE.DirectionalLight(0xffffff, 3);
keyLight.position.set(3, 4, 5);
scene.add(keyLight);

function resize() {
  const { clientWidth, clientHeight } = container;
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(clientWidth, clientHeight);
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
