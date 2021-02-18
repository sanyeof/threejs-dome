/* 测试各种功能的代码 */

import * as THREE from 'three';
import { WEBGL } from './WebGL';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // 控制器

console.log('test.js');
var objArr = [] 
var currentMarket = null

// 判断浏览器是否支持 WebGL
if (WEBGL.isWebGLAvailable()) {
  // Initiate function or other initializations here

  /* ------------------------------------------------------------------------------------------------------------ */
  let canvas = document.getElementById('canvas') // 画布
  const scene = new THREE.Scene(); // 场景
  scene.background = new THREE.Color(0xeeeeee);
  const camera = new THREE.PerspectiveCamera( 75, canvas.innerWidth / canvas.innerHeight, 0.1, 10000 ); // 相机
  const renderer = new THREE.WebGLRenderer({canvas}); // 渲染器
  // renderer.setSize( window.innerWidth, window.innerHeight ); // 渲染器设置宽高
  // document.body.appendChild( renderer.domElement ); // 渲染器添加到 DOM
  // camera.position.z = 100; // 把相机向前移动一下，不然和场景会重叠，看不到渲染出来的东西
  camera.position.set( 0, 0, 5 ); // 把相机向前移动一下，不然和场景会重叠，看不到渲染出来的东西
  const controls = new OrbitControls(camera, canvas); // 控制器
  controls.target.set(0, 0, 0);
  controls.update();

  // 灯照
  // const light = new THREE.DirectionalLight(0xFFFFFF, 1);
  // scene.add(light);
  const light = new THREE.PointLight(0xffffff, 5);
  light.position.set(0, 0, 10);
  scene.add(light);
  // const color = 0xFFFFFF;
  // const intensity = 3;
  // const light = new THREE.AmbientLight(color, intensity);
  // scene.add(light);

  // // 立方体
  const geometry = new THREE.BoxGeometry(); // 创建以一个立方体
  const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } ); // 创建一个网格材质
  const cube = new THREE.Mesh( geometry, material ); // 把立方体和材质添加到一个网格中
  cube.position.set(0, 1, 0)
  scene.add( cube ); // 把网格添加到场景
  objArr.push(cube)

  const map = new THREE.TextureLoader().load( "/public/111.jpg" );
  const material2 = new THREE.SpriteMaterial( { map: map, transparent: true } );
  const sprite = new THREE.Sprite( material2 );
  sprite.scale.set(0.5, 0.5, 0.5);
  sprite.position.set(0, 0.5, 0)
  cube.add( sprite );
  sprite.isMarker = true
  objArr.push(sprite)

  // // 线条
  // const material2 = new THREE.LineBasicMaterial( { color: 0x0000ff } );
  // const points = [];
  // points.push( new THREE.Vector3( -5, 0, 0 ) );
  // points.push( new THREE.Vector3( 0, 5, 0 ) );
  // points.push( new THREE.Vector3( 5, 0, 0 ) );
  // const geometry2 = new THREE.BufferGeometry().setFromPoints( points );
  // const line = new THREE.Line( geometry2, material2 );
  // scene.add( line );

  // // 文字绘制
  // const fontLoader = new THREE.FontLoader();
  // fontLoader.load('https://unpkg.com/three/examples/fonts/helvetiker_regular.typeface.json', ( font ) => {
  //   const geometry3 = new THREE.TextGeometry( 'Hello three.js!', {
  //     font: font,
  //     size: 0.5,
  //     height: 0.01,
  //     curveSegments: 50,
  //     bevelEnabled: true,
  //     bevelThickness: 0.1,
  //     bevelSize: 0.02,
  //     bevelSegments: 1
  //   });
  //   var txtMater = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  //   var txtMesh = new THREE.Mesh(geometry3, txtMater);
  //   txtMesh.position.set(-5, 0, 5);
  //   scene.add(txtMesh);
  // });

  // 绘制 GLTF 格式模型
  // let GLTF
  // const  GLTFloader = new GLTFLoader();
  // GLTFloader.load( '/public/scene.gltf', ( gltf ) => {
  //   console.log(gltf)
  //   scene.add( gltf.scene );
  //   GLTF = gltf.scene
  //   // GLTF.scale.x = 0.3
  //   // GLTF.scale.y = 0.3
  //   // GLTF.scale.z = 0.3
  //   // GLTF.rotation.x = 0.3;
  //   // GLTF.rotation.y = 5;
  //   // GLTF.rotation.z = 20;
  //   // GLTF.position.x = -10
  // }, undefined, function ( error ) {
  //   console.error( error );
  // });


  // 动态设置画布的宽高
  function resizeRendererToDisplaySize(renderer) {
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

  // 事件捕捉
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();
  function onMouseMove( event ) {
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  }
  window.addEventListener( 'mousemove', onMouseMove, false );


  // 这是一个渲染动画函数
  function animate() {
    requestAnimationFrame( animate ); // 在浏览器重绘之前渲染动画

    // 看看宽高是否有变化，就有更新宽高比
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    // 事件捕捉
    // 通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera( mouse, camera );
    // 计算物体和射线的焦点
    var intersects = raycaster.intersectObjects( objArr );
    let info = document.getElementById('info')
    for (let i = 0; i < intersects.length; i++) {
      if (intersects[i].object.isMarker) {
        // if (intersects[i].object.uuid === currentMarket) { break }
        console.log(intersects[i])
        currentMarket = intersects[i].object.uuid
        console.log(info)
        info.style =  'display: inline-block'
        break
      } else {
        info.style =  'display: none'
      }
    }
    // if (intersects.length > 0) {
    //   if (intersects[0].object.linchi) {
    //     intersects[0].object.material.color.set( 0x000000 );
    //   } else {
    //     intersects[0].object.material.color.set( 0x0000ff );
    //   }
    //   console.log(intersects)
    // }

    // 立方体转动
    cube.rotation.x += 0.001;
    cube.rotation.y += 0.001;
    cube.rotation.z += 0.005;

    renderer.render( scene, camera ); // 用渲染器把 场景 和 相机 渲染到页面
  }
  animate();

} else {
  const warning = WEBGL.getWebGLErrorMessage();
  document.getElementById('container').appendChild(warning);
}