
import React, { useEffect, useRef } from "react";

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment'

export default function Page7() {

  const context = useRef();

  useEffect(() => {

    const ctx = init();
    const control = createControl(ctx);
    ctx.control = control;


    loadSceneConfig(ctx);
    loadSceneModel(ctx);
    loadLight(ctx);


    context.current = ctx;
    render();

  }, []);


  function init() {

    // 场景
    const scene = new THREE.Scene();
    // 相机
    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(5, 2, 8);
    // 渲染器
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    const container = document.querySelector('#scene');
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    return ({
      scene,
      renderer,
      camera,
    });
  };

  function createControl({ camera, renderer }) {
    const control = new OrbitControls(camera, renderer.domElement);
    control.enableDamping = true;
    return control;
  };


  function loadSceneConfig({ scene, renderer }) {
    // const pmremGenerator = new THREE.PMREMGenerator(renderer);
    // scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;
    scene.background = new THREE.Color(0xbfe3dd);

  };

  function onSetModelAnimation(ctx, model) {
    if (
      Array.isArray(model.animations) &&
      model.animations.length
    ) {
      const clock = new THREE.Clock();
      ctx.animate = {
        mixer: new THREE.AnimationMixer(model.scene),
        clock,
      };
      ctx.animate.mixer.clipAction(model.animations[0]).play();

    }
  }

  function loadSceneModel(ctx) {
    const { scene } = ctx;
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load('/model/LittlestTokyo.glb', (model) => {
      model.scene.scale.set(0.01, 0.01, 0.01);
      model.scene.rotation.set(0, 2 * Math.PI / 3, 0);
      onSetModelAnimation(ctx, model);
      scene.add(model.scene);
    });

  };

  function loadLight({ scene }) {

    const light = new THREE.AmbientLight(0x404040, 10);
    const pointLight = new THREE.PointLight(0xffffff, 100, 1000);

    pointLight.position.set(0, 3, 0);

    scene.add(light);
    scene.add(pointLight);

  }

  function render() {
    const { control, scene, camera, renderer, animate } = context.current;
    control.update();
    if (animate) {
      animate.mixer.update(animate.clock.getDelta());
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

  return (
    <div id='scene' style={{ height: '100vh' }} />
  )

}