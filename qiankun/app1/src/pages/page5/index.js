
import React, { useEffect, useRef, useState } from "react";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { Water } from "three/examples/jsm/objects/Water2";
import { useDebounceFn } from "ahooks";

import gsap from "gsap";

export default function ThreeCardDemo() {

  const ele = useRef({});
  const index = useRef(0);
  const animate = useRef();
  const [scenes] = useState([
    new THREE.Vector3(-3.23, 6.98, 4.06),
    new THREE.Vector3(7, 0, 23),
    new THREE.Vector3(10, 3, 0),
  ]);

  useEffect(() => {
    const THREEElement = init();
    const control = createControl(THREEElement);
    THREEElement.control = control;

    // --------- 为场景添加模型 start -------------
    loadLight(THREEElement);
    loadLightGroup(THREEElement);
    loadSceneBackground(THREEElement);
    loadSceneModel(THREEElement);

    const stats = [];
    const starGroup = createStars(THREEElement, stats);
    const starPaths = drawStar();

    THREEElement.starGroup = starGroup;
    THREEElement.starPaths = starPaths;
    THREEElement.stats = stats;
    // --------- 为场景添加模型 end -------------

    ele.current = THREEElement;
    render();

    const timerLiner = gsap.timeline();
    animate.current = timerLiner;



    window.addEventListener('wheel', requestSceneAnimation);

    return (() => {
      window.removeEventListener('wheel', requestSceneAnimation);
    });

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

  function loadLight({ scene }) {
    const light = new THREE.AmbientLight(0x40404, 10);
    const pointLight = new THREE.PointLight(0xffffff, 100, 1000);

    pointLight.position.set(0.5, 3, 0);
    pointLight.castShadow = true;

    scene.add(light);
    scene.add(pointLight);
  };

  function loadLightGroup({ scene }) {
    const group = new THREE.Group();
    // 创建球体材质，用来模拟灯泡
    const ball = new THREE.SphereGeometry(0.2, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
    });

    const radius = 3; // 假定球体环形排布，环形半径
    const n = 3;

    for (let i = 0; i < n; i += 1) {
      const cube = new THREE.Mesh(ball, material);
      // 将点光源添加到球体上
      const light = new THREE.PointLight(0xffffff);
      cube.add(light);

      cube.position.set(
        radius * Math.cos((i * 2 * Math.PI) / n),
        Math.sin((i * 2 * Math.PI) / n),
        radius * Math.sin((i * 2 * Math.PI) / n)
      );


      group.add(cube);
    };

    group.position.set(-8, 2.5, 0);
    scene.add(group);

    const options = { angle: 0 };
    console.log(group.children);
    gsap.to(options, {
      angle: Math.PI * 2,
      duration: 10,
      repeat: -1,
      ease: "linear",
      onUpdate: () => {
        group.rotation.y = options.angle;
        group.children.forEach((cube, index) => {
          cube.position.y = Math.cos((index * 2 * Math.PI) / 3 + options.angle * 5)
        })
      },
    });
  };

  const { run: requestSceneAnimation } = useDebounceFn(evt => {

    evt.preventDefault();
    evt.stopPropagation();

    const len = scenes.length;

    index.current++;
    if (index.current > len - 1) {
      index.current = 0;
    }

    const { camera } = ele.current;

    const position = scenes[index.current];
    animate.current.to(camera.position, {
      x: position.x,
      y: position.y,
      z: position.z,
      duration: 1,
      ease: "power2.inOut",
    });

    if (index.current === 1) {
      console.log(222);
      requestStarsAnimation();
    }

  }, { wait: 300 });

  // 天空中的星星
  function createStars({ scene }, stars) {

    const len = 100;
    const instanced = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.1, 32, 32),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 10,
      }),
      len
    );

    for (let i = 0; i < len; i += 1) {
      const position = new THREE.Vector3(
        Math.random() * 100 - 50,
        Math.random() * 100 - 50,
        Math.random() * 100 - 50
      );
      stars.push(position);
      const matrix4 = new THREE.Matrix4();
      matrix4.setPosition(position)
      instanced.setMatrixAt(i, matrix4);
    }

    scene.add(instanced);
    return instanced;
  };

  function drawStar() {

    const starPaths = [];
    const starShape = new THREE.Shape();

    // 定义五角星的顶点坐标
    const outerRadius = 1; // 外半径
    const innerRadius = 0.5; // 内半径
    const numPoints = 5; // 五角星的顶点数
    const angleStep = (Math.PI * 2) / numPoints;

    for (let i = 0; i < numPoints * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = i * angleStep;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      if (i === 0) {
        starShape.moveTo(x, y);
      } else {
        starShape.lineTo(x, y);
      }
    }

    // // 将路径封闭
    starShape.closePath();
    // starShape.moveTo(25, 25);
    // starShape.bezierCurveTo(25, 25, 20, 0, 0, 0);
    // starShape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
    // starShape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
    // starShape.bezierCurveTo(60, 77, 80, 55, 80, 35);
    // starShape.bezierCurveTo(80, 35, 80, 0, 50, 0);
    // starShape.bezierCurveTo(35, 0, 25, 25, 25, 25);

    const center = new THREE.Vector3(0, 2, 10);
    for (let i = 0; i < 100; i++) {
      const point = starShape.getPoint(i / 100);
      starPaths.push(
        new THREE.Vector3(
          // point.x * 0.1 + center.x,
          // point.y * 0.1 + center.y,
          point.x + center.x,
          point.y + center.y,
          center.z
        )
      );
    }

    return starPaths;
  };

  function requestStarsAnimation() {
    const { starGroup, stats: originPath, starPaths } = ele.current;
    const options = { time: 0 };
    gsap.to(options, {
      time: 1,
      direction: 1,
      onUpdate: () => {
        for (let i = 0; i < 100; i += 1) {
          const x = originPath[i].x + (starPaths[i].x - originPath[i].x) * options.time;
          const y = originPath[i].y + (starPaths[i].y - originPath[i].y) * options.time;
          const z = originPath[i].z + (starPaths[i].z - originPath[i].z) * options.time;
          const matrix = new THREE.Matrix4();
          matrix.setPosition(x, y, z);
          starGroup.setMatrixAt(i, matrix);
        }
        starGroup.instanceMatrix.needsUpdate = true;
      },
    })
  };

  // 加载环境背景
  function loadSceneBackground({ scene }) {
    // 加载环境纹理
    new RGBELoader().load("./textures/sky.hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
    });
  };

  // 加载场景模型
  function loadSceneModel({ scene }) {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load('/model/scene.glb', model => {
      model.scene.traverse((child) => {
        if (child.name === "Plane") {
          child.visible = false;
        }
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      scene.add(model.scene);
    });
    // 加载水波平面
    const waterGeometry = new THREE.CircleGeometry(300, 32);
    const water = new Water(waterGeometry, {
      textureWidth: 1024,
      textureHeight: 1024,
      color: 0xeeeeff,
      flowDirection: new THREE.Vector2(1, 1),
      scale: 100,
    });
    water.rotation.x = -Math.PI / 2;
    water.position.y = -0.4;
    scene.add(water);
  };

  // 创建轨道控制器，方便拖拽画布调整视角
  function createControl({ camera, renderer }) {
    const control = new OrbitControls(camera, renderer.domElement);
    control.enableDamping = true;
    // control.dampingFactor = 0.01;
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