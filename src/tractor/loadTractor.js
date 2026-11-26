import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function loadTractor(scene, groundLevel) {
  const tractor = new THREE.Group();
  tractor.position.y = groundLevel;
  scene.add(tractor);

  const loader = new GLTFLoader();
  loader.load(
    '/models/tractor.glb',
    (gltf) => {
      const model = gltf.scene;
      const initialBounds = new THREE.Box3().setFromObject(model);
      const dimensions = initialBounds.getSize(new THREE.Vector3());
      const largestDimension = Math.max(dimensions.x, dimensions.y, dimensions.z);

      if (!Number.isFinite(largestDimension) || largestDimension === 0) {
        console.error('The tractor model has invalid dimensions.');
        return;
      }

      model.scale.setScalar(2.4 / largestDimension);
      const bounds = new THREE.Box3().setFromObject(model);
      const center = bounds.getCenter(new THREE.Vector3());
      model.position.x -= center.x;
      model.position.y -= bounds.min.y;
      model.position.z -= center.z;
      tractor.add(model);
    },
    undefined,
    (error) => {
      console.error('Failed to load /models/tractor.glb.', error);
    },
  );

  return tractor;
}
