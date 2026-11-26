import * as THREE from 'three';
import './style.css';

const container = document.querySelector('#scene');

const scene = new THREE.Scene();
scene.background = new THREE.Color('#111827');

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

window.addEventListener('resize', resize);

renderer.setAnimationLoop(() => {
  cube.rotation.x += 0.004;
  cube.rotation.y += 0.007;
  renderer.render(scene, camera);
});
