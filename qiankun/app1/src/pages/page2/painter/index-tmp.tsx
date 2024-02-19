
import React, { useEffect, useRef, useState } from 'react';
import { pxRatio } from './utils';
import { Cycle, Rectangle } from './shapes';


import './style.less';
import PainterToolbar from './painter-toolbar';

interface Action {
  shapeIndex: number;
  type: 'MOVING' | 'PAINTING' | 'INIT';
  position?: { x: number; y: number };
}

export default function Painter({
  width = 600,
  height = 300,
  id = 'painter',
  isAdaptive = true,
}) {

  // 记录当前画布已绘制的图形
  const shapes = useRef<Array<Rectangle>>([]);

  // 画布操作栏勾选的配置信息（包括绘制图形的颜色，图形类型...）
  const [brush, setBrush] = useState<Record<string, string>>({ shapeType: 'rect', color: '#FFA500' });

  // 画布的原点及大小等信息
  const [scene, setSceneConfig] = useState({ x: 0, y: 0, width, height });

  // 托管绘制时需要的相关参数,以便mousedown,mousemove,mouseup事件访问
  const action = useRef<Action>({
    shapeIndex: -1,  // 操作的对象的在shapes数组的下标
    type: 'INIT',    // 当前操作类型（绘制/移动），
    // shapeType: 'INIT' // 当前操作的对象类型 （矩形，原型，线...）
  });

  const [toolList] = useState([
    {
      id: 'rect',
      name: "矩形",
    },
    {
      id: 'cycle',
      name: '圆形',
    }
  ]);

  useEffect(() => {
    const scene = init();
    setSceneConfig(scene);
    const unbind = registerEventListener();

    return unbind;
  }, []);

  function init() {
    const eCanvas: HTMLCanvasElement | null = document.querySelector(`#${id}`);
    if (eCanvas) {
      const eCanvasWrap = document.querySelector(`#${id}-wrap`);

      const w = isAdaptive ? eCanvasWrap?.clientWidth || width : width;
      const h = isAdaptive ? eCanvasWrap?.clientHeight || height : height;

      eCanvas.width = pxRatio(w);
      eCanvas.height = pxRatio(h);
      eCanvas.style.width = `${w}px`;
      eCanvas.style.height = `${h}px`;

      const cvsRect = eCanvas.getBoundingClientRect();
      return {
        x: cvsRect.left,
        y: cvsRect.top,
        width: eCanvas.width,
        height: eCanvas.height,
      }
    }
    return ({ x: 0, y: 0, width, height });
  };

  function registerEventListener() {

    function remove(evt) {
      if (evt.keyCode === 46) {
        removeShape();
      }
    }

    document.addEventListener('keydown', remove);

    return () => {
      document.removeEventListener('keydown', remove);
    }
  }

  function setAction(_action) {
    action.current = _action;
  };

  /**
   * @description 将shapes数组中存放的各类图形绘制到画布上
   * 每次绘制前，重置一层画布
   */
  function repaint() {
    if (action.current.type === 'INIT') return;

    const eCanvas: HTMLCanvasElement | null = document.querySelector(`#${id}`);
    const ctx = eCanvas?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, scene.width, scene.height);
      shapes.current.forEach(widget => {
        widget.draw(ctx);
      });
    }
    requestAnimationFrame(repaint);
  };

  function repaintOnce() {
    const eCanvas: HTMLCanvasElement | null = document.querySelector(`#${id}`);
    const ctx = eCanvas?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, scene.width, scene.height);
      shapes.current.forEach(widget => {
        widget.draw(ctx);
      });
    }
  };

  /**
  * @description 获取当前相对canvas画布原点的坐标
  * @param evt 
  * @returns 
  */
  function getRelPosition(evt) {
    return ({
      x: evt.clientX - scene.x,
      y: evt.clientY - scene.y,
    })
  };

  /**
   * @description 根据当前点击的位置，判断所在范围内是否存在已绘制图形，是则返回图形，否则返回null
   * @param pos 当前点击的坐标点
   * @returns 返回查找到的图形或null
   */
  function findShapeIndex(pos: { x: number; y: number }): number {
    for (let i = shapes.current.length - 1; i >= 0; i -= 1) {
      const isIncluded = shapes.current[i].isIncluded(pos.x, pos.y);
      if (isIncluded) {
        return i;
      }
    }
    return -1;
  };

  /**
   * @description 创建图形，设置图形起始坐标，画笔等相关配置
   * @param evt 
   */
  function createShape(pos) {
    const Shape = {
      'cycle': Cycle,
      'rect': Rectangle,
    };
    const shape = new Shape[brush.shapeType || 'rect'](
      pos.x,
      pos.y,
      brush.color,
      { enabled: true }
    );

    shapes.current.push(shape);
    setAction({
      type: 'PAINTING',
      shapeIndex: shapes.current.length - 1,
    });
  };

  /**
   * @description 根据鼠标点击的位置判断是否在已绘制图形上，从而决定执行拖拽逻辑或绘制逻辑
   * @param evt 
   */
  function onBeforePainting(evt) {
    evt.preventDefault();
    const pos = getRelPosition(evt);
    const shapeIndex = findShapeIndex(pos);
    if (shapeIndex >= 0) {
      setAction({
        type: 'MOVING',
        shapeIndex,
        position: {
          x: evt.clientX,
          y: evt.clientY,
        },
      })
    } else {
      createShape(pos);
    }
  };

  /**
   * @description 修改图形坐标，重绘画布
   * @param evt 
   */
  function painting(evt) {
    const { position = { x: 0, y: 0 }, type, shapeIndex } = action.current;

    const shape = shapes.current[shapeIndex];
    if (shape && type !== 'INIT') {
      const pos = getRelPosition(evt);

      if (type === 'MOVING') {
        const offsetX = evt.clientX - position.x;
        const offsetY = evt.clientY - position.y;

        shape.move(offsetX, offsetY);
        /**
         * 偏移量是基于上一次鼠标所在位置计算的，因此每次移动后，需要重设 偏移起点
         */
        setAction({
          ...action.current,
          position: {
            x: evt.clientX,
            y: evt.clientY,
          },
        });
      } else if (type === 'PAINTING') {
        shape.tick(pos.x, pos.y);
      }

      repaint();
    }
  };

  /**
   * @description 绘制结束，将相关配置重置
   */
  function onAfterPainting() {
    setAction({
      type: 'INIT',
      shapeIndex: -1,
    });
  };

  function removeShape() {
    // 不能用这个，需要有一个记录点击的
    const { shapeIndex } = action.current;

    if (shapeIndex >= 0) {
      shapes.current.splice(shapeIndex, 1);
      repaintOnce();
    }
  };


  return (
    <div className='cpt-painter-component'>
      <PainterToolbar list={toolList} onChange={setBrush} value={brush} />
      <div id={`${id}-wrap`} className='cpt-painter-wrap' style={{ height }}>
        <canvas
          id={id}
          onMouseDown={onBeforePainting}
          onMouseMove={painting}
          onMouseUp={onAfterPainting}
        />
      </div>
    </div>
  )
}