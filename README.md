# 3D模型标注three.js
1、入门教程：https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene
2、深入教程：https://threejsfundamentals.org/
3、Github：https://github.com/mrdoob/three.js/tree/master
4、obj转换为gltf方法：https://blog.csdn.net/dukai392/article/details/79343418?utm_source=blogxgwz3
5、Threejs—BIM管道流向动态效果：https://zhuanlan.zhihu.com/p/138960516



# 基本概念
要创建一个threejs应用，就必须了解组成threejs应用的基本概念：场景、相机、渲染器
相机：我们在屏幕上看场景内容的视图工具，相当于我们的眼睛
场景：一些模型或者其它等所在的环境，相当于我们用眼睛看到的周围的各种物体等的环境，我们创建的各种模型都是直接通过add函数加进这里的
渲染器：负责把相机和场景渲染到浏览器视图上



# 用一个案例来入门 threejs （用threejs做一个简单的3D场景内添加标点的工具）
# 环境准备（使用webpack）
## 1、初始化nodejs项目
npm init -y

## 2、安装webpack、webpack-cli
npm i --save-dev webpack
npm i --save-dev webpack-cli

## 3、创建 webpack.config.js ，具体配置可以看本教程所属项目的 webpack.config.js

## 4、安装threejs
npm i --save three


# 开始开发
## 1、导入依赖：
## 封装的通用函数工具
import * as Utils from './utils.js';

## 导入threejs模块
import * as THREE from 'three';

## 由threejs官方提供的验证浏览器是否支持webgl的工具函数，需要到https://github.com/mrdoob/three.js/blob/master/examples/jsm/WebGL.js获取
import { WEBGL } from './WebGL.js';

## 轨道控制器，用来给场景添加可用鼠标来移动旋转场景的功能
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

## 变换控制器，用来给某一个模型添加可以用鼠标来在场景内移动该模型的功能
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

## 2、创建场景、相机、渲染器、灯光（Tips：以下代码都是在 WEBGL.isWebGLAvailable() 验证了浏览器有WebGL功能后编写的
## 使用Utils工具里面的init函数初始化场景、相机、渲染器
let { scene, camera, renderer } = Utils.init(
  { bgColor: 0xf0f0f0 },
  {
    fov: 85,
    // 记得在html里加一个canvas元素，这个元素是渲染出来的视图的容器
    aspect: document.getElementById('canvas').innerWidth / document.getElementById('canvas').innerHeight,
    near: 0.1,
    far: 100000
  }
);

## Utils.init 实现细节
function init (
  sceneConfig = {
    // 场景的背景色
    bgColor: 0xeeeeee
  },
  cameraConfig = {
    // 相机的视野角度
    fov: 75,
    // 相机的宽高比
    aspect: document.getElementById('canvas').innerWidth / document.getElementById('canvas').innerHeight,
    // 近截面（物体某些部分比摄像机的远截面远或者比近截面近的时候，该这些部分将不会被渲染到场景中）
    near: 0.1,
    // 远截面
    far: 1000
  },
  rendererConfig = {
    // 渲染器挂载的dom容器
    canvas: document.getElementById('canvas')
  }
) {
  // 创建场景
  const scene = new THREE.Scene();
  // 设置场景的背景色
  scene.background = new THREE.Color(sceneConfig.bgColor);
  // 创建相机
  const camera = new THREE.PerspectiveCamera( cameraConfig.fov, cameraConfig.aspect, cameraConfig.near, cameraConfig.far );
  // 创建渲染器
  const renderer = new THREE.WebGLRenderer(rendererConfig); 

  return { scene, camera, renderer };
}

## 创建完基本的 scene, camera, renderer 后，要设置相机的位置，不然相机会在（0, 0, 0）的位置；然后添加灯光，没有灯光的话，可能会看不到我们添加的模型
// 相机位置
camera.position.set( 0, 250, 1000 );
// 给场景添加一个环境光
scene.add( new THREE.AmbientLight( 0xf0f0f0 ) );

## 3、添加轨道控制器
// 创建一个轨道控制器实例，传入刚刚创建的的相机实例以及渲染器的容器dom对象
const controls = new OrbitControls(camera, renderer.domElement);
// 设置旋转的中心点
controls.target.set(0, 0, 0);

## 4、添加变换控制器
// 创建一个变换控制器实例，传入刚刚创建的的相机实例以及渲染器的容器dom对象
let transformControl = new TransformControls( camera, renderer.domElement );

// transformControl的dragging(拖动事件)发生时改变就控制一下轨道控制器启用禁用
transformControl.addEventListener( 'dragging-changed', ( event ) => { // 
  controls.enabled = !event.value;
} );

// 添加变换控制器到场景里
scene.add( transformControl );

## 5、添加一个底座平面，并且在这个底座上添加一些网格，以便标点参考位置
## 添加一个底座平面
// 平面几何
const planeGeometry = new THREE.PlaneGeometry( 2000, 2000 );

// 把xy平面变为xZ平面
planeGeometry.rotateX( - Math.PI / 2 );

// 基础网格材质
const planeMaterial = new THREE.MeshBasicMaterial();

// 把平面几何和基础网格材质 生成平面网格
const plane = new THREE.Mesh( planeGeometry, planeMaterial );

// 平面网格向下（y轴负方向）移动200单位
plane.position.y = -200;

// 把平面添加到场景里面
scene.add( plane );

## 网格辅助器
// 创建一个网格辅助器的实例，传入参数 坐标格尺寸、坐标格细分次数
const helper = new THREE.GridHelper( 2000, 100 ); 

// 向下（y轴负方向）移动199单位，与底座平面几乎重合
helper.position.y = - 199;

// 透明度
helper.material.opacity = 0.25;

// 是否可透明
helper.material.transparent = true;

// 添加到场景
scene.add( helper );

## 6、添加一个立方体在（0, 0, 0），用标点参考物体
// 创建以一个立方体
const geometry = new THREE.BoxGeometry(50, 50, 50);

// 创建一个网格材质
const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );

// 把立方体和材质添加到一个网格中
const cube = new THREE.Mesh( geometry, material );

// 设置立方体的位置
cube.position.set(0, 0, 0);

// 把网格添加到场景
scene.add( cube ); 

## 7、定义添加标点的工厂函数，并初始化一个默认标点
// 一个存储标点实例对象的数组（给标点添加事件时有用）
let objArr = []

// 利用纹理加载器，加载一个图片，用来做标点的样式
const map = new THREE.TextureLoader().load( "/public/icon.png" );

// 利用这个图片创建一个精灵图材质（无论在哪个视角看，精灵图材质的模型都是面向我们的），sizeAttenuation属性是让模型不随视图内容的缩小放大而缩小放大
const spriteMaterial = new THREE.SpriteMaterial( { map: map, sizeAttenuation: false } );

// 创建第二个精灵图材质，depthTest是让这个模型被其它模型遮挡仍然能被看见，opacity设置透明度（为什么要弄两个材质？为了让标点被遮住时有被遮住的效果）
const spriteMaterial2 = new THREE.SpriteMaterial( { map: map, sizeAttenuation: false, depthTest: false, opacity: 0.2 } );

// 创建精灵图模型实例的函数
function createMarker (m) {
  return new THREE.Sprite( m );
}

// 创建一个标点的函数
function createMarkerCon() {
  // 第一个精灵图模型
  let sprite1 = createMarker(spriteMaterial)
  // 第二个精灵图模型
  let sprite2 = createMarker(spriteMaterial2)
  // 第一个精灵图模型 把 第二个精灵图模型 添加为子模型
  sprite1.add(sprite2)
  // 设置精灵图模型的尺寸缩放
  sprite1.scale.set(0.1, 0.1, 0.1);
  // 设置精灵图模型初始位置
  sprite1.position.set(100, 100, 0);
  // 因为场景里不可能只有标点，所以要对精灵图模型添加特异性字段进行区分
  sprite1.isMarker = true;
  // 把第一个精灵图模型添加到场景
  scene.add(sprite1);
  // 把标点（第一个精灵图模型）添加到objArr
  objArr.push(sprite1);
}

// 创建一个标点
createMarkerCon()

## 9、定义获取所有标点的位置函数
let getPosition = () => {
  // 遍历 objArr 数组
  for (let i = 0; i < objArr.length; i++) {
    // 创建一个三维空间的点对象
    let p = new THREE.Vector3();
    // 把标点相对于世界（场景）的坐标复制到 p
    objArr[i].getWorldPosition(p);
    console.log('--------------- -- ');
    console.log('marker - ', i);
    console.log(p);
  }
  alert('位置信息已在控制台输出');
}

## 10、在html里面添加两个按钮，添加标点的按钮 和 获取标点位置的按钮，给这这两个按钮添加点击事件
let add = document.getElementById('add');
let get = document.getElementById('get');
add.onclick = createMarkerCon;
get.onclick = getPosition;

## 11、给标点添加鼠标的点击、拖拽等事件，以便能利用鼠标对标点位置进行调整。在threejs的视图里面不进行一些转换，是没办法监听模型的事件的，要利用Raycaster来计算焦点，获取哪个模型与射线相交，从而让模型触发事件
## // 事件捕捉
// 创建一个射线实例对象
let raycaster = new THREE.Raycaster();

// 创建一个二维空间点的对象（x,y），在进行将鼠标位置归一化为设备坐标时（x 和 y 方向的取值范围是 (-1 to +1)）有用
let mouse = new THREE.Vector2();

// 存储 鼠标按下时的二维空间点
let onDownPosition = new THREE.Vector2();

// 存储 鼠标松开时的二维空间点
let onUpPosition = new THREE.Vector2();

## // 鼠标在移动时触发的事件
let onPointermove = ( event ) => {
  // 通过 Utils.onTransitionMouseXYZ 函数把将鼠标位置归一化为设备坐标（实现细节请直接看Utils工具类）
  mouse = Utils.onTransitionMouseXYZ(event, renderer.domElement);

  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera( mouse, camera );

  // 计算模型和射线的焦点（objArr就是之前存储标点模型的数组）
  var intersects = raycaster.intersectObjects(objArr);

  // 获取到有焦点的模型的数组后，对于不是当前 transformControl 变换器正在变换的模型的焦点模型，把这个模型添加到 transformControl ，让当前变换的模型为获取到焦点的模型
  if ( intersects.length > 0 ) {
    const object = intersects[ 0 ].object;
    if ( object !== transformControl.object ) {
      transformControl.attach( object );
    }
  }
}

## // 鼠标按键按下时触发的事件
let onPointerdown = ( event ) => {
  onDownPosition.x = event.clientX;
  onDownPosition.y = event.clientY;
}

## // 鼠标按键松开时触发的事件（相当于点击事件触发）
let onPointerup = ( event ) => {
  onUpPosition.x = event.clientX;
  onUpPosition.y = event.clientY;

  // 如果鼠标按键按下和松开的时候是在同一个点同一个位置，则取消 transformControl 变换器正在变换的模型的变化状态，然后触发点击事件
  if ( onDownPosition.distanceTo( onUpPosition ) === 0 ) {
    transformControl.detach();
    onClick(event)
  }
}

## // 点击事件（在onPointerup函数里调用）
let onClick = (event) => {
  // 通过 Utils.onTransitionMouseXYZ 函数把将鼠标位置归一化为设备坐标（实现细节请直接看Utils工具类）
  let mouse = Utils.onTransitionMouseXYZ(event, renderer.domElement);

  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera( mouse, camera );

  // 计算模型和射线的焦点（objArr就是之前存储标点模型的数组）
  let intersects = raycaster.intersectObjects(objArr);

  // 如果有相交的标点模型，就显示弹窗（这不是threejs的内容，不进行介绍，直接看代码即可）
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
    }
  } else {
    info.style =  'display: none';
  }
}
// 添加事件委托
window.addEventListener( 'pointermove', onPointermove, false );
window.addEventListener( 'pointerdown', onPointerdown, false );
window.addEventListener( 'pointerup', onPointerup, false );

## 12、最后，虽然上面添加了很多东西，但是还是缺少很重要的一步，这一步不完成，页面是看不到效果的，因为加那么多东西，都没有利用初始化好的renderer对象来把相机和场景渲染到视图上。现在来完成这一步
function animate() {
  // 在浏览器重绘之前渲染（requestAnimationFrame是什么？请看：https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame）
  requestAnimationFrame( animate );

  // 在视图的大小发生变化的时候，是需要更新相机的宽高比的，不然看到的场景会发生变形，使用Utils.updateCameraAspect实现（实现细节请直接看Utils工具类）
  Utils.updateCameraAspect(renderer, camera);

  // 用渲染器把 场景 和 相机 渲染到页面
  renderer.render( scene, camera );
}
animate();

# 到了这里，基本上就完成了threejs的基本使用。如果要加载UI那么给过来的各种格式的模型的话（如 .gltf 格式的模型），可以使用threejs提供的模型加载器来实现，居然有哪些加载器，请看本教程头部链接的官方文档。加载模型举个例子：
// 导入 .gltf 格式的模型模型加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// 这里是一些相机、场景、渲染器等基本内容的定义...

// 绘制 GLTF 格式模型
const  GLTFloader = new GLTFLoader();
GLTFloader.load( '/public/Model.gltf', ( gltf ) => {
  scene.add( gltf.scene );
}, undefined, function ( error ) {
  console.error( error );
});

// 这里其他内容...