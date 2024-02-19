
import React, { useEffect, useRef } from "react";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
// import { Reflector } from "three/examples/jsm/objects/Reflector";
import { Water } from "three/examples/jsm/objects/Water2";

export default function ThreeCardDemo() {

  const ele = useRef({});

  useEffect(() => {
    const THREEElement = init();
    const control = createControl(THREEElement);
    THREEElement.control = control;

    // --------- 为场景添加模型 start -------------
    loadSceneBackground(THREEElement);
    loadLight(THREEElement);
    loadSceneModel(THREEElement);
    createPanel(THREEElement);
    createPanelReflector(THREEElement);
    createStars(THREEElement);
    // --------- 为场景添加模型 end -------------

    ele.current = THREEElement;
    render();

  }, []);


  function init() {
    // 创建场景
    const scene = new THREE.Scene();

    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(-3.23, 6.98, 4.06);

    // 创建渲染器 抗锯齿
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    // 渲染器大小
    const containerDom = document.querySelector('#scene');
    renderer.setSize(containerDom.clientWidth, containerDom.clientHeight);
    renderer.shadowMap.enabled = true;
    // 将渲染器canvas插入到DOM树中
    containerDom.appendChild(renderer.domElement);

    return ({
      renderer,
      camera,
      scene
    })
  };

  function loadSceneBackground({ scene }) {

    const textureCube = new THREE.CubeTextureLoader().setPath('/img/').load([
      "1.jpg",
      "2.jpg",
      "3.jpg",
      "4.jpg",
      "5.jpg",
      "6.jpg",
    ]); // 顺序：左、右、上、下、前、后
    scene.background = textureCube; // 作为背景贴图
  }

  function loadLight({ scene }) {
    const light = new THREE.AmbientLight(0x404040, 10);
    const pointLight = new THREE.PointLight(0xffffff, 100, 1000);

    pointLight.position.set(0, 3, 0);

    scene.add(light);
    scene.add(pointLight);
  };


  // 加载场景模型
  function loadSceneModel({ scene }) {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load('/model/robot.glb', (model) => {
      // 替换材质，实现水晶材质的效果
      // model.scene.children[0].children[0].children.forEach(child => {
      //   child.material = new THREE.MeshPhongMaterial({
      //     envMap: scene.background,
      //     color: 0xffffff,
      //     reflectivity: 0.99,
      //     refractionRatio: 0.7,
      //   });
      // });

      scene.add(model.scene);

    });
  };

  // 创建地面
  function createPanel({ scene }) {

    const videoDom = document.createElement('video');
    videoDom.src = '/model/zp2.mp4';
    videoDom.muted = true; // 静音播放
    videoDom.loop = true; // 循环播放
    videoDom.play();
    // 视频纹理
    const videoTexture = new THREE.VideoTexture(videoDom);


    const plane = new THREE.PlaneGeometry(8, 4.5);
    const material = new THREE.MeshBasicMaterial({
      map: videoTexture,
      alphaMap: videoTexture, // 灰度纹理，用于控制整个表面的不透明度
      side: THREE.DoubleSide,
      transparent: true,
    });
    const cube = new THREE.Mesh(plane, material);

    cube.rotation.set(-Math.PI / 2, 0, 0);

    scene.add(cube);
  };

  // 创建地面的镜面反射
  function createPanelReflector({ scene }) {
    const reflectorGeometry = new THREE.PlaneGeometry(100, 100);
    const container = document.querySelector('#scene');

    const water = new Water(reflectorGeometry, {
      textureWidth: container.innerWidth,
      textureHeight: container.innerHeight,
      color: 0xeeeeff,
      flowDirection: new THREE.Vector2(1, 1),
      scale: 100,
    });

    // const reflector = new Reflector(reflectorGeometry, {
    //   textureWidth: container.innerWidth,
    //   textureHeight: container.innerHeight,
    //   color: 0x332222,
    // });

    water.rotation.set(-Math.PI / 2, 0, 0);
    water.position.set(0, -0.2, 0);

    scene.add(water);
  };

  function createStars({ scene }) {
    const n = 100;
    const instanced = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.1, 32, 32),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 10,
      }),
      n
    );

    for (let i = 0; i < n; i += 1) {
      const matrix4 = new THREE.Matrix4();
      matrix4.setPosition(new THREE.Vector3(
        Math.random() * 100 - 50,
        Math.random() * 100,
        Math.random() * 100 - 50
      ));
      instanced.setMatrixAt(i, matrix4);
    }

    scene.add(instanced);
  }

  // 创建轨道控制器，方便拖拽画布调整视角
  function createControl({ camera, renderer }) {
    const control = new OrbitControls(camera, renderer.domElement);
    control.enableDamping = true;
    return control;
  };

  // 实时渲染
  function render() {
    requestAnimationFrame(render);
    const { control, renderer, scene, camera } = ele.current;
    control.update();
    renderer.render(scene, camera);
  };


  return (
    <div id='scene' style={{ height: '100vh' }} />
  )
}