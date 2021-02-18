/* 单独标点 具体位置需要自己在代码里手动调整 非常不方便实用 */

import * as THREE from 'three';
import { WEBGL } from './WebGL.js';
import * as Utils from './utils.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // 控制器

console.log('test2.js');

// 保存要添加事件的标点(用于计算射线焦点)
let objArr = [];

if (WEBGL.isWebGLAvailable()) {

  let { scene, camera, renderer } = Utils.init();
  camera.position.set( 0, 0, 5 );
  const controls = new OrbitControls(camera, canvas); // 控制器
  controls.target.set(0, 0, 0);
  controls.update();

  // 灯光
  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(0, 5, 10);
  scene.add(light);

  // 立方体
  const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5); // 创建以一个立方体
  const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } ); // 创建一个网格材质
  const cube = new THREE.Mesh( geometry, material ); // 把立方体和材质添加到一个网格中
  cube.position.set(0, 1, 0);
  scene.add( cube ); // 把网格添加到场景
  objArr.push(cube);

  // 标点
  const geometry2 = new THREE.BoxGeometry(0.5, 0.5, 0.000000000001); // 创建以一个立方体
  const material2 = new THREE.MeshPhongMaterial( { map: new THREE.TextureLoader().load('/public/111.jpg') } ); // 创建一个网格材质
  const marker = new THREE.Mesh( geometry2, material2 ); // 把立方体和材质添加到一个网格中
  marker.position.set(0, 0, 0.751);
  cube.add(marker);
  marker.isMarker = true;
  objArr.push(marker);

  // 事件捕捉
  let raycaster = new THREE.Raycaster();
  let mouse = new THREE.Vector2();
  let onMouseMove = ( event ) => {
    mouse = Utils.onTransitionMouseXYZ(event, renderer.domElement);
  }
  window.addEventListener( 'mousemove', onMouseMove, false );

  // 这是一个渲染动画函数
  function animate() {
    requestAnimationFrame( animate ); // 在浏览器重绘之前渲染动画

    Utils.updateCameraAspect(renderer, camera);

    // 事件捕捉
    // 通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera( mouse, camera );
    // 计算物体和射线的焦点
    var intersects = raycaster.intersectObjects( objArr );
    let info = document.getElementById('info')
    for (let i = 0; i < intersects.length; i++) {
      if (intersects[i].object.isMarker) {
        info.style =  'display: inline-block';
        break;
      } else {
        info.style =  'display: none';
      }
    }

    // 立方体转动
    cube.rotation.x += 0.001;
    cube.rotation.y += 0.001;
    cube.rotation.z += 0.005;

    renderer.render( scene, camera ); // 用渲染器把 场景 和 相机 渲染到页面
  }
  animate();

} else {
  console.log(WEBGL.getWebGLErrorMessage());
}
