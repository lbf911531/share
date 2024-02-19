

import React, { useRef } from 'react';
import { Button, Space } from 'antd';

/// 获取摄像头数据，处理成灰度图片，展示到video中

class Video2Canvas {

  animationId;
  width;
  height;

  constructor(video, canvas, width, height) {
    if (!video || !canvas) {
      throw new Error('不存在video或者canvas元素');
    }
    this.video = video;

    this.ctx = canvas.getContext('2d');
    this.width = width ?? video.clientWidth;
    this.height = height ?? video.clientHeight;
  }


  draw() {
    this.ctx.drawImage(this.video, this.video.width, this.video.height);

    const data = this.getData();
    const imageData = this.gray(data);

    this.ctx.putImageData(imageData, 0, 0);
  }

  getData() {
    const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    return imageData;
  }

  gray(data) {
    const { data: imageData, width, height } = data;

    // 灰度处理图片数据
    const newImageDataList = [];

    for (let i = 0, len = imageData.length; i < len; i += 4) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];

      const _gray = (r * 0.3 + g * 0.59 + b * 0.11);

      newImageDataList[i] = _gray;
      newImageDataList[i + 1] = _gray;
      newImageDataList[i + 2] = _gray;
      newImageDataList[i + 3] = imageData[i + 3];
    }

    const list = new Uint8ClampedArray(newImageDataList);
    const newImageData = new ImageData(list, width, height);
    return newImageData;
  }

  animate() {
    this.animationId = window.requestAnimationFrame(() => {
      this.draw();
      this.animate();
    });
  }

  pause() {
    // this.gray();
    if (this.animationId) {
      window.cancelAnimationFrame(this.animationId);
    }
  }
}


export default function VideoDemo() {

  const v2c = useRef();

  const _width = 640;
  const _height = 480;

  /**
   * 调用设备摄像头获取摄像数据stream
   */
  function onConnectCamera() {
    const constraints = { audio: false, video: {} };

    navigator.mediaDevices.getUserMedia(constraints).then(mediaStream => {
      const stream = formatVideoStream(mediaStream);
      showVideoStream(stream);
    }).catch(err => {
      console.log(err);
    })
  };


  /**
   * 处理媒体流数据
   * @param {*} stream 
   * @returns 
   */
  function formatVideoStream(stream) {
    return stream;
  };

  /**
   * 媒体流数据展示到video中
   */
  function showVideoStream(stream) {
    const video = document.querySelector('#video');
    if (!video) {
      throw new Error('video is not exist !!!');
    }
    if ("srcObject" in video) {
      video.srcObject = stream;
    } else {
      // 防止在新的浏览器里使用它，应为它已经不再支持了
      video.src = window.URL.createObjectURL(stream);
    }
    video.onloadedmetadata = function () {
      video.play();

      const canvas = document.querySelector('#canvas');
      canvas.width = _width;
      canvas.height = _height;
    };
  }

  function onDrawCanvas() {
    if (!v2c.current) {
      const video = document.querySelector('#video');
      const canvas = document.querySelector('#canvas');
      const vCtx = new Video2Canvas(video, canvas, _width, _height);
      vCtx.animate();
      v2c.current = vCtx;
    } else {
      v2c.current.animate();
    }
  }

  function onStopDrawing() {
    if (v2c.current) {
      v2c.current.pause();
    }
  }

  return (
    <div className='page8'>
      <div>
        <Space gutter={[8, 8]}>
          <Button onClick={onConnectCamera}>start</Button>
          <Button onClick={onDrawCanvas}>draw</Button>
          <Button onClick={onStopDrawing}>pause</Button>
        </Space>
      </div>
      <video id="video" style={{ display: 'none' }} />
      <canvas id="canvas" />
    </div>
  )
}