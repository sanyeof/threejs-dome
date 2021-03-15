/* 模型 */

import * as Utils from './utils.js';
import * as THREE from 'three';
import { WEBGL } from './WebGL.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // 轨道控制器
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'; // 变换控制器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

console.log('test4.js');

// 保存要添加事件的标点(用于计算射线焦点)
let objArr = [];

if (WEBGL.isWebGLAvailable()) {

  let { scene, camera, renderer } = Utils.init(
    { bgColor: 0xf0f0f0 },
    {
      fov: 85,
      aspect: document.getElementById('canvas').innerWidth / document.getElementById('canvas').innerHeight,
      near: 0.1,
      far: 100000
    }
  );
  camera.position.set( 0, 250, 100 ); // 相机位置
  scene.add( new THREE.AmbientLight( 0xffffff, 1 ) ); // 给场景添加一个环境光

  // 灯光
  const light = new THREE.PointLight(0xffffff, 5);
  light.position.set(100, -1000, -1000);
  scene.add(light);

  // 2d渲染
  // let labelRenderer = new CSS2DRenderer();
  // labelRenderer.setSize( window.innerWidth, window.innerHeight );
  // labelRenderer.domElement.style.position = 'absolute';
  // labelRenderer.domElement.style.top = '0px';
  // labelRenderer.domElement.style.pointerEvents = 'none';
  // document.body.appendChild( labelRenderer.domElement );

  // 轨道控制器
  const controls = new OrbitControls(camera, canvas);
  controls.damping = 0.2; //惯性
  controls.target.set(0, 0, 0);
  controls.update();

  /*---------------------------------------------------------*/

// 此部分为了展示为hardcode
// const pathArr = [
//   4624.99, 2329.38, -5843.11,
//   4624.99, 4643.14, -5843.11,
//   1437.47, 4643.14, -5819.36,
//   1413.69, 4643.14, -1854.40,
//   -6983.28, 4643.14, -1854.04,
//   -7078.43, 4643.14, 2149.46
// ]
// const  radius =  500

//  // 动态创建一个管道
//  function createTube(pathArr, radius) {
//   let curveArr = []
//   // 三个一组取出curve数据
//   for(let i=0; i < pathArr.length; i+=3) {
//     curveArr.push(new THREE.Vector3(pathArr[i], pathArr[i+1], pathArr[i+2]))
//   }
//   var curve = new THREE.CatmullRomCurve3(curveArr);
//   /**
//     * TubeGeometry(path : Curve, tubularSegments : Integer, radius : Float, radialSegments : Integer, closed : Boolean)
//   */
//   var tubeGeometry = new THREE.TubeGeometry(curve, 100, radius, 50, false);
//   var textureLoader = new THREE.TextureLoader();
//   var texture = textureLoader.load(`/public/icon.png`);

//   // 设置阵列模式 RepeatWrapping
//   texture.wrapS = THREE.RepeatWrapping
//   texture.wrapT = THREE.RepeatWrapping
//   // 设置x方向的重复数(沿着管道路径方向)
//   // 设置y方向的重复数(环绕管道方向)
//   texture.repeat.x = 10;
//   texture.repeat.y = 4;
//   // 设置管道纹理偏移数,便于对中
//   texture.offset.y = 0.5;
//   var tubeMaterial = new THREE.MeshPhongMaterial({
//     map: texture,
//     transparent: true,
//   });
//   var tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
//   // 使用加减法可以设置不同的运动方向
//   setInterval(() => {
//     texture.offset.x -= 0.0076
//   })
//   return tube
// }
// let o = createTube(pathArr, radius)
// scene.add(o)

  /*---------------------------------------------------------*/


  // 绘制 GLTF 格式模型
  let GLTF = null
  const  GLTFloader = new GLTFLoader();
  GLTFloader.load( '/public/hs.gltf', ( gltf ) => {
    console.log(gltf)
    scene.add( gltf.scene );
    GLTF = gltf.scene
    
    childrenList = []
    getChildren(GLTF.children)
  }, undefined, function ( error ) {
    console.error( error );
  });

  // const  FBXLoaderObj = new FBXLoader();
  // FBXLoaderObj.load( '/public/hz.fbx', ( fbx ) => {
  //     console.log('fbx', fbx)
  //     scene.add( fbx )
  //   }, undefined, function ( error ) {
  //     console.error( error );
  //   });

  let childrenList = []
  // 获取要计算焦点的子模型
  function getChildren(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].children.length > 0) {
        getChildren(arr[i].children)
        continue
      }
      childrenList.push(arr[i])
    }
  }

  // 事件
  let onClick = (event) => {
    var intersects = Utils.getIntersects(event, renderer.domElement, camera, childrenList)
    console.log(intersects)
    if (intersects.length > 0) {
      // intersects[0].object.material.transparent = true;
      // intersects[0].object.material.opacity = 0.5;
    }
  }
  window.addEventListener( 'click', onClick, false );


  // 这是一个渲染动画函数
  function animate() {
    requestAnimationFrame( animate ); // 在浏览器重绘之前渲染动画

    Utils.updateCameraAspect(renderer, camera);

    // labelRenderer.setSize( window.innerWidth, window.innerHeight );
    
    // 立方体转动
    // cube.rotation.x += 0.001;
    // cube.rotation.y += 0.001;
    // cube.rotation.z += 0.005;

    renderer.render( scene, camera ); // 用渲染器把 场景 和 相机 渲染到页面
    // 2d渲染
    // labelRenderer.render( scene, camera );
  }
  animate();

} else {
  console.log(WEBGL.getWebGLErrorMessage());
}
