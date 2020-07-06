import './style.scss';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// import * as faker from 'faker';
//import * as d3 from 'd3';

// renderer
const clock = new THREE.Clock();
const animationMixers: THREE.AnimationMixer[] = [];
const renderer = new THREE.WebGLRenderer({ antialias: true });
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
camera.position.z = 1;
const scene = new THREE.Scene();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

// plane
const geometry = new THREE.PlaneGeometry(1, 1);
const material = new THREE.MeshBasicMaterial();

const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

// group for anchors
const anchors = new THREE.Group();
scene.add(anchors);

// svg
const svgElement = document.getElementsByTagName('svg')[0];

// raycast
const raycaster = new THREE.Raycaster();

renderer.domElement.addEventListener(
  'click',
  (event) => {
    event.preventDefault();

    const x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    const y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    const mouse = new THREE.Vector3(x, y, 0.5);
    raycaster.setFromCamera(mouse, camera);

    const inters = raycaster.intersectObject(plane, true);
    if (inters.length > 0) {
      const target = inters[0].point;

      const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      const material = new THREE.MeshNormalMaterial();
      const anchor = new THREE.Mesh(geometry, material);
      anchor.position.copy(target);
      anchors.add(anchor);

      const anchorOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

      const [domX, domY] = domPosition(anchor.position.clone());

      // anchorOverlay.innerHTML = faker.name.findName();
      
      anchorOverlay.setAttribute('class', 'circle');
      anchorOverlay.setAttribute('cx', domX.toFixed());
      anchorOverlay.setAttribute('cy', domY.toFixed());
      anchorOverlay.setAttribute('r', '20');

      anchor.userData = anchorOverlay;

      svgElement.appendChild(anchorOverlay);

      // const target = inters[0].object;
      // const from = target.position;
      // const to = from.clone().addScalar(0.1);
      // const positionTrack = new THREE.VectorKeyframeTrack(
      //   '.position',
      //   [0, 1],
      //   [from.x, from.y, from.z, to.x, to.y, to.z]
      // );
      // const clip = new THREE.AnimationClip('move', 1, [positionTrack]);
      // const animationMixer = new THREE.AnimationMixer(target);
      // const clipAction = animationMixer.clipAction(clip);
      // clipAction.setLoop(THREE.LoopOnce, 1);
      // clipAction.clampWhenFinished = true;
      // clipAction.play();
      // animationMixers.push(animationMixer);
      // animationMixer.addEventListener('finished', () => {
      //   target.position.copy(from);
      // });
    }
  },
  false
);

// window.addEventListener('mousemove', event => {
//   const circles = document.getElementsByTagName('circle');
//   const circle = circles[0];
//   circle.setAttribute('cx', event.clientX.toFixed());
//   circle.setAttribute('cy', event.clientY.toFixed());
// }, false);

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  animationMixers.forEach((animationMixer) => animationMixer.update(delta));

  controls.update();

  updateLabels();

  renderer.render(scene, camera);
}

animate();

function domPosition(position: THREE.Vector3, size: THREE.Vector2 = renderer.getSize(new THREE.Vector2())): [number, number] {
  const camPos = position.clone().project(camera);
  const domX = size.x * (camPos.x + 1) / 2;
  const domY = size.y * (-camPos.y + 1) / 2;
  return [domX, domY];
}

function updateLabels() {
  const size = renderer.getSize(new THREE.Vector2());
  for (const anchor of anchors.children) {
    const [domX, domY] = domPosition(anchor.position.clone(), size);
    const anchorOverlay = anchor.userData;
    anchorOverlay.setAttribute('cx', domX.toFixed());
    anchorOverlay.setAttribute('cy', domY.toFixed());
  }
}

controls.addEventListener('change', () => {
  // updateLabels();
});
