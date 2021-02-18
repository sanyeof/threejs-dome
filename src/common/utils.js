/* 工具函数 */

import * as THREE from 'three';

// 初始化
function init (
  sceneConfig = {
    bgColor: 0xeeeeee
  },
  cameraConfig = {
    fov: 75,
    aspect: document.getElementById('canvas').innerWidth / document.getElementById('canvas').innerHeight,
    near: 0.1,
    far: 1000
  },
  rendererConfig = {
    canvas: document.getElementById('canvas')
  }
) {
  // 场景
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(sceneConfig.bgColor);
  // 相机
  const camera = new THREE.PerspectiveCamera( cameraConfig.fov, cameraConfig.aspect, cameraConfig.near, cameraConfig.far );
  // 渲染器
  const renderer = new THREE.WebGLRenderer(rendererConfig); 

  return { scene, camera, renderer };
}

// 画布的宽高动态设置
function resizeRendererToDisplaySize (renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width = canvas.clientWidth * pixelRatio | 0;
  const height = canvas.clientHeight * pixelRatio | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

// 看看宽高是否有变化，就有更新宽高比
function updateCameraAspect (renderer, camera) {
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
}

// 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
function onTransitionMouseXYZ( event, domElement ) {
  let mouse = new THREE.Vector2();
  // mouse.x = ( event.clientX / domElement.innerWidth ) * 2 - 1;
  // mouse.y = - ( event.clientY / domElement.innerHeight ) * 2 + 1;
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  return mouse;
}

export {
  init,
  resizeRendererToDisplaySize,
  updateCameraAspect,
  onTransitionMouseXYZ
}