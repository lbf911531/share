

import React, { useEffect, useRef } from "react";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function ThreeDemo() {

  const sceneWrapInst = useRef();
  const wrap = useRef({});

  useEffect(() => {

    init();
    raycasterAndClickChangeColor();
    // createBox();
    // createSceneAndShadow();
    createBall();
    createLight();
    // loadModal();
    createControls();
    render();
  }, []);

  useEffect(() => {

    function getMousePosition(evt) {
      // 将数据转化到[-1,1]
      const x = (evt.clientX / window.innerWidth) * 2 - 1;
      // y数据是上为1，下为-1，所以 加 - ，颠倒过来
      const y = -((evt.clientX / window.innerWidth) * 2 - 1);


      wrap.current.pointer.x = x;
      wrap.current.pointer.y = y;

      changeColor();
      wrap.current.renderer.render(wrap.current.scene, wrap.current.camera);
    }

    window.addEventListener('click', getMousePosition);

    return () => {
      window.removeEventListener('click', getMousePosition)
    }

  }, []);

  // function cameraChangeView(evt) {
  //   console.log('evt', evt);
  // }


  function init() {
    //创建场景
    const scene = new THREE.Scene();
    //天空盒
    wrap.current.scene = scene;
    // ！！！注意， 这里是异步加载，经过尝试发现，如果render和load同步执行，图片会渲染不出来，可能会是一片黑
    const textureCube = new THREE.CubeTextureLoader().setPath('/img/').load([
      "1.jpg",
      "2.jpg",
      "3.jpg",
      "4.jpg",
      "5.jpg",
      "6.jpg",
    ]); // 顺序：左、右、上、下、前、后
    scene.background = textureCube; // 作为背景贴图

    // 创建相机
    const camera = new THREE.PerspectiveCamera();
    camera.position.z = 5;
    camera.position.y = 10;
    // camera.position.set(600, 900, 600);
    camera.lookAt(scene.position); // 设置相机方向(指向的场景对象)

    wrap.current.camera = camera;

    // 创建渲染器对象
    const container = document.getElementById("scene");
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight); // 设置渲染区域尺寸
    container.appendChild(renderer.domElement); // body元素中插入canvas对象

    renderer.shadowMap.enabled = true; // 允许场景渲染阴影贴图

    wrap.current.renderer = renderer;


    const helper = new THREE.GridHelper(10, 10);
    scene.add(helper);

    // 线性雾
    // scene.fog = new THREE.Fog(0x999999, 0.1, 20);
    // scene.fog = new THREE.FogExp2(0x999999, 0.1);

  };

  // 创建一个带有点光源，使得能感光的物体存在阴影
  function createSceneAndShadow() {
    createBoxWithShadow();
    createGround();
    createLight();
  }

  // 创建一个能感光的盒子
  function createBoxWithShadow() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({
      color: 0x40E0D0,
      shininess: 100, // 越高的值越闪亮
    });

    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0.5, 0);
    cube.castShadow = true; // 投射光源
    cube.receiveShadow = true; // 接受光源
    wrap.current.scene.add(cube);
  };

  // 创建环境光和点光源
  function createLight() {
    const light = new THREE.AmbientLight(0x404040, 10);
    const pointLight = new THREE.PointLight(0xffffff, 100, 1000);
    // pointLight.position.set(3, 3, 5);
    pointLight.position.set(600, 900, 600);
    pointLight.castShadow = true;

    wrap.current.scene.add(light);
    wrap.current.scene.add(pointLight);

  };

  // 创建地面
  function createGround() {
    const geometry = new THREE.PlaneGeometry(10, 10);
    const material = new THREE.MeshPhongMaterial({
      color: 0xF0E68C,
      side: THREE.DoubleSide,
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.rotation.x -= Math.PI / 2;
    cube.receiveShadow = true; // 接受光源
    wrap.current.scene.add(cube);
  };

  function createBox() {
    // 创建纹理
    // const texture = new THREE.TextureLoader().setPath('/img/').load('4.png');
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      // map: texture,
      // envMap: wrap.current.scene.background, // 镜面反射（本质上其实是纹理贴图）
    });

    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 3, 0);

    wrap.current.scene.add(cube);
  };

  function createPanel() {

    // bufferGeometry是BoxGeometry,SphereGeometry的基类
    const geometry = new THREE.BufferGeometry();
    // 创建一个简单的矩形. 在这里我们左上和右下顶点被复制了两次。
    // 因为在两个三角面片里，这两个顶点都需要被用到。
    // const vertices = new Float32Array([
    //   -1.0, -1.0, 1.0,
    //   1.0, -1.0, 1.0,
    //   1.0, 1.0, 1.0,
    //   1.0, 1.0, 1.0,
    //   -1.0, 1.0, 1.0,
    //   -1.0, -1.0, 1.0
    // ]);
    // 从上发现，有些坐标是重复的，所以有另一种方式绘制：

    // 1. 穷举顶点坐标
    const vertices = new Float32Array([
      -1.0, -1.0, 1.0,
      1.0, -1.0, 1.0,
      1.0, 1.0, 1.0,
      -1.0, 1.0, 1.0,
    ]);
    // 2.通过索引指定连线
    geometry.index = new THREE.BufferAttribute(new Uint16Array([0, 1, 2, 2, 3, 0]), 1);

    // itemSize = 3 因为每个顶点都是一个三元组（x,y,z坐标）。
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide, // 前后两面都添加材质，默认只在前面添加,
      wireframe: true, // 展示线框
    });

    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 3, 0);

    wrap.current.scene.add(cube);
  };

  // 加载模型
  function loadModal() {
    const loader = new GLTFLoader();
    loader.load('/img/shanghai.gltf', modal => {
      wrap.current.scene.add(modal.scene);
    });
  };

  // 点击视图中的物体，使其修改颜色 【光线投射】
  function raycasterAndClickChangeColor() {
    // https://threejs.org/docs/index.html?q=ray#api/zh/core/Raycaster
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    wrap.current.pointer = pointer;
    wrap.current.raycaster = raycaster;
  };

  function changeColor() {
    wrap.current.raycaster.setFromCamera(wrap.current.pointer, wrap.current.camera);
    // 计算物体和射线的焦点
    const intersects = wrap.current?.raycaster?.intersectObjects(wrap.current.scene.children);
    console.log(intersects,'wrap.current.scene.children')
    intersects?.[0].object.material.color.set(0x40E0D0);
  }

  function createBall() {
    const ball1 = new THREE.Mesh(
      new THREE.SphereGeometry(),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
      })
    );
    ball1.position.set(0, 0, 0);
    const ball2 = new THREE.Mesh(
      new THREE.SphereGeometry(),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
      })
    );
    ball2.position.set(3, 0, 0);
    wrap.current.scene.add(ball1);
    wrap.current.scene.add(ball2);
  };

  function createControls() {
    // 创建轨道控制器，支持拖拽视图变换视角
    const control = new OrbitControls(wrap.current.camera, wrap.current.renderer.domElement);
    control.enableDamping = true;
    control.dampingFactor = 0.01;

    wrap.current.control = control;
  }

  function render() {
    // 渲染器渲染，及动画
    if (wrap.current.cube) {
      wrap.current.cube.rotation.x += 0.01;
    }
    wrap.current.control.update();
    wrap.current.renderer.render(wrap.current.scene, wrap.current.camera);
    requestAnimationFrame(render); // 请求再次执行渲染函数render
  };

  return (
    <div ref={sceneWrapInst} id='scene' style={{ height: '100vh' }}></div>
  )
}