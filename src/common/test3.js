/* 标点 具体位置可以自己在场景里手动调整 方便实用 */

import * as Utils from './utils.js';
import * as THREE from 'three';
import { WEBGL } from './WebGL.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // 轨道控制器
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'; // 变换控制器
// import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

console.log('test3.js');

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
  // renderer.shadowMap.enabled = true; // 开启阴影能力
  camera.position.set( 0, 250, 1000 ); // 相机位置
  scene.add( new THREE.AmbientLight( 0xf0f0f0 ) ); // 给场景添加一个环境光

  // 2d渲染
  // let labelRenderer = new CSS2DRenderer();
  // labelRenderer.setSize( window.innerWidth, window.innerHeight );
  // labelRenderer.domElement.style.position = 'absolute';
  // labelRenderer.domElement.style.top = '0px';
  // labelRenderer.domElement.style.pointerEvents = 'none';
  // document.body.appendChild( labelRenderer.domElement );

  // 轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  // controls.damping = 0.2; //惯性
  controls.target.set(0, 0, 0);
  // controls.update();

  // 变换控制器
  let transformControl = new TransformControls( camera, renderer.domElement );
  transformControl.addEventListener( 'dragging-changed', ( event ) => { // transformControl的dragging发生改变就控制一下轨道控制器启用禁用
    controls.enabled = !event.value;
  } );
  scene.add( transformControl );

  // 添加一个阴影聚光灯
  // const light = new THREE.SpotLight( 0xffffff, 1.5 ); // 聚光灯
	// 			light.position.set( 0, 1500, 200 ); // 聚光灯位置
	// 			light.angle = Math.PI * 0.2; // 聚光灯最大范围
	// 			light.castShadow = true; // 聚光灯投射阴影
	// 			light.shadow.camera.near = 200;
	// 			light.shadow.camera.far = 2000;
	// 			light.shadow.bias = - 0.000222;
	// 			light.shadow.mapSize.width = 1024;
	// 			light.shadow.mapSize.height = 1024;
	// 			scene.add( light );

  // 添加一个底座平面
  const planeGeometry = new THREE.PlaneGeometry( 2000, 2000 ); // 平面几何
  planeGeometry.rotateX( - Math.PI / 2 ); // 把xy平面变为xZ平面
  // const planeMaterial = new THREE.ShadowMaterial( { opacity: 0.2 } ); // 阴影材质
  const planeMaterial = new THREE.MeshBasicMaterial()
  const plane = new THREE.Mesh( planeGeometry, planeMaterial ); // 平面网格
  plane.position.y = -200; // 平面网格向下（y轴负方向）移动200单位
  // plane.receiveShadow = true; // 接受阴影
  scene.add( plane );

  const helper = new THREE.GridHelper( 2000, 100 ); // 网格辅助器
				helper.position.y = - 199;
				helper.material.opacity = 0.25;
				helper.material.transparent = true;
				scene.add( helper );


  // 立方体
  const geometry = new THREE.BoxGeometry(50, 50, 50); // 创建以一个立方体
  const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } ); // 创建一个网格材质
  const cube = new THREE.Mesh( geometry, material ); // 把立方体和材质添加到一个网格中
  cube.position.set(0, 0, 0);
  scene.add( cube ); // 把网格添加到场景

  // 标点
  const map = new THREE.TextureLoader().load( "/public/icon.png" );
  const spriteMaterial = new THREE.SpriteMaterial( { map: map, sizeAttenuation: false } );
  const spriteMaterial2 = new THREE.SpriteMaterial( { map: map, sizeAttenuation: false, depthTest: false, opacity: 0.2 } );
  function createMarker (m) {
    return new THREE.Sprite( m );
  }
  function createMarkerCon() {
    let sprite1 = createMarker(spriteMaterial)
    let sprite2 = createMarker(spriteMaterial2)
    sprite1.add(sprite2)
    sprite1.scale.set(0.1, 0.1, 0.1);
    sprite1.position.set(100, 100, 0);
    sprite1.isMarker = true;
    scene.add(sprite1);
    objArr.push(sprite1);
  }
  createMarkerCon()

  // 获取所有标点的位置
  let getPosition = () => {
    for (let i = 0; i < objArr.length; i++) {
      let p = new THREE.Vector3();
      objArr[i].getWorldPosition(p);
      console.log('--------------- -- ');
      console.log('marker - ', i);
      console.log(p);
    }
    alert('位置信息已在控制台输出');
  }

  // 给按钮添加事件
  let add = document.getElementById('add');
  let get = document.getElementById('get');
  add.onclick = createMarkerCon;
  get.onclick = getPosition;


  // 事件捕捉
  let raycaster = new THREE.Raycaster();
  let mouse = new THREE.Vector2();
  let onDownPosition = new THREE.Vector2();
  let onUpPosition = new THREE.Vector2();
  let onPointermove = ( event ) => {
    mouse = Utils.onTransitionMouseXYZ(event, renderer.domElement);
    // 事件捕捉
    // 通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera( mouse, camera );
    // 计算物体和射线的焦点
    var intersects = raycaster.intersectObjects(objArr);
    if ( intersects.length > 0 ) {
      const object = intersects[ 0 ].object;
      if ( object !== transformControl.object ) {
        transformControl.attach( object );
      }
    }
  }
  let onPointerdown = ( event ) => {
    onDownPosition.x = event.clientX;
		onDownPosition.y = event.clientY;
  }
  let onPointerup = ( event ) => {
    onUpPosition.x = event.clientX;
    onUpPosition.y = event.clientY;
    if ( onDownPosition.distanceTo( onUpPosition ) === 0 ) {
      transformControl.detach();
      onClick(event)
    }
  }
  // 点击事件
  let onClick = (event) => {
    let mouse = Utils.onTransitionMouseXYZ(event, renderer.domElement);
    // 事件捕捉
    // 通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera( mouse, camera );
    // 计算物体和射线的焦点
    let intersects = raycaster.intersectObjects(objArr);
    if ( intersects.length > 0 ) {
      const object = intersects[ 0 ].object;
      if (object.isMarker) {

        // 弹窗内容
        let info = document.getElementById('info');
        info.style = 'display: inline-block;top: ' + (event.clientY - 50) + 'px;left: ' + (event.clientX + 50) + 'px;'
        // info.innerHTML='<iframe src="http://localhost:9000/" frameborder="0" style="width: 100%;height: 300px"></iframe>'

        // 计算合适的弹窗大小和位置
        let body = document.getElementById('html');
        setTimeout(() => {
          body.scrollTop = 1;
          body.scrollLeft = 1;
          if (body.scrollTop) {
            info.style.top = event.clientY - info.clientHeight + 50 + 'px';
            if (event.clientY < info.clientHeight) {
              let { num2 } = numLow10(event.clientX, info.clientWidth)
              info.style.height = num2 + 100 + 'px';
              info.style.top = event.clientX - num2 + 'px';
            }
          }
          if (body.scrollLeft) {
            info.style.left = event.clientX - info.clientWidth - 50 + 'px';
            if (event.clientX < info.clientWidth) {
              let { num2 } = numLow10(event.clientX, info.clientWidth)
              info.style.width = num2 - 100 + 'px';
              info.style.left = event.clientX - num2 + 'px';
            }
          }
        }, 10)

        // 如果 num1 < num2 num2就减少10 的递归函数
        function numLow10 (num1, num2) {
          console.log(num1, num2)
          if (num1 < num2)
            return numLow10(num1, num2 - 10)
          else
            return { num1, num2 }
        }

        // 2d渲染
        // var planeInfo = document.createElement('div')
        // // planeInfo.className = 'info'
        // planeInfo.innerHTML = '<div>治电护航直升机</div><div><a href="http://www.baidu.com">www.baidu.com</a></div>'
        // // planeInfo.classList.add('hide')
        // let infoModal = new CSS2DObject(planeInfo)
        // infoModal.position.set(200, 200, 0)
        // infoModal.scale.set(10, 10, 10)
        // scene.add(infoModal)
      }
    } else {
      info.style =  'display: none';
    }
  }
  window.addEventListener( 'pointermove', onPointermove, false );
  window.addEventListener( 'pointerdown', onPointerdown, false );
  window.addEventListener( 'pointerup', onPointerup, false );
  // window.addEventListener( 'click', onClick, false )

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
