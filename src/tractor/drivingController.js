import * as THREE from 'three';

const movementKeys = new Set([
  'z',
  's',
  'q',
  'd',
  'arrowup',
  'arrowdown',
  'arrowleft',
  'arrowright',
]);

export function createDrivingController({ tractor, camera }) {
  const pressedKeys = new Set();
  const cameraOffset = new THREE.Vector3(0, 4.2, 8.5);
  const cameraLookOffset = new THREE.Vector3(0, 1.2, -2);
  const forward = new THREE.Vector3();
  const desiredCameraPosition = new THREE.Vector3();
  const lookTarget = new THREE.Vector3();
  const maxSpeed = 10;
  const turnSpeed = 2.2;
  let speed = 0;

  function handleKeyDown(event) {
    const key = event.key.toLowerCase();
    if (movementKeys.has(key)) {
      event.preventDefault();
      pressedKeys.add(key);
    }
  }

  function handleKeyUp(event) {
    pressedKeys.delete(event.key.toLowerCase());
  }

  function clearPressedKeys() {
    pressedKeys.clear();
  }

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  window.addEventListener('blur', clearPressedKeys);

  return {
    update(delta) {
      const throttle =
        Number(pressedKeys.has('z') || pressedKeys.has('arrowup')) -
        Number(pressedKeys.has('s') || pressedKeys.has('arrowdown'));
      const steering =
        Number(pressedKeys.has('q') || pressedKeys.has('arrowleft')) -
        Number(pressedKeys.has('d') || pressedKeys.has('arrowright'));
      const targetSpeed = throttle * maxSpeed;
      speed = THREE.MathUtils.damp(speed, targetSpeed, throttle === 0 ? 5 : 8, delta);

      if (steering !== 0 && Math.abs(speed) > 0.05) {
        tractor.rotation.y += steering * turnSpeed * delta * Math.sign(speed);
      }

      forward.set(0, 0, -1).applyQuaternion(tractor.quaternion);
      tractor.position.addScaledVector(forward, speed * delta);

      desiredCameraPosition
        .copy(cameraOffset)
        .applyQuaternion(tractor.quaternion)
        .add(tractor.position);
      camera.position.lerp(desiredCameraPosition, 1 - Math.exp(-4 * delta));

      lookTarget
        .copy(cameraLookOffset)
        .applyQuaternion(tractor.quaternion)
        .add(tractor.position);
      camera.lookAt(lookTarget);
    },
    dispose() {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', clearPressedKeys);
    },
  };
}
